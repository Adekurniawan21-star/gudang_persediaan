<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Peminjaman;
use App\Models\Barang;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class PeminjamanController extends Controller
{
    public function index(Request $request)
    {
        $query = Peminjaman::with('barang');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_peminjam', 'like', "%$search%")
                  ->orWhere('divisi', 'like', "%$search%") // cari juga berdasarkan divisi
                  ->orWhereHas('barang', function ($qb) use ($search) {
                      $qb->where('nama_barang', 'like', "%$search%");
                  });
            });
        }

        $peminjaman = $query->get()->sortBy(function ($item) {
            $kembali = Carbon::parse($item->tanggal_kembali);
            $today = Carbon::today();
            $diff = $today->diffInDays($kembali, false);

            return match (true) {
                $item->status === 'selesai' => 4,
                $diff < 0 => 0,
                $diff == 0 => 1,
                $diff <= 2 => 2,
                default => 3
            };
        });

        return view('peminjaman.index', compact('peminjaman'));
    }

    public function create(Request $request)
    {
        $includeSekaliPakai = $request->has('include_sekali_pakai');

        $barang = Barang::where(function ($q) use ($includeSekaliPakai) {
            $q->where('kategori', 'Barang Pinjam');
            if ($includeSekaliPakai) {
                $q->orWhere('kategori', 'Barang Sekali Pakai');
            }
        })->get();

        return view('peminjaman.create', compact('barang', 'includeSekaliPakai'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_barang'       => 'required|exists:barang,id_barang',
            'jumlah'          => 'required|integer|min:1',
            'nama_peminjam'   => 'required|string',
            'kontak_peminjam' => 'required|string',
            'divisi'          => 'nullable|string|max:255', // ✅ validasi divisi
            'tanggal_pinjam'  => 'required|date',
            'tanggal_kembali' => 'required|date|after_or_equal:tanggal_pinjam',
            'foto_peminjam'   => 'nullable|image|max:2048',
        ]);

        DB::beginTransaction();
        try {
            $barang = Barang::findOrFail($request->id_barang);

            if ($barang->stok < $request->jumlah) {
                return back()->with('error', 'Stok barang tidak mencukupi!');
            }

            $data = $request->only([
                'id_barang', 'jumlah', 'nama_peminjam', 'kontak_peminjam',
                'divisi', // ✅ simpan divisi
                'tanggal_pinjam', 'tanggal_kembali'
            ]);

            if ($request->hasFile('foto_peminjam')) {
                $data['foto_peminjam'] = $request->file('foto_peminjam')->store('foto_peminjam', 'public');
            }

            $data['status'] = 'dipinjam';

            $peminjaman = Peminjaman::create($data);

            $barang->stok -= $request->jumlah;
            $barang->save();

            DB::commit();
            return redirect()->route('peminjaman.index')->with('success', 'Data peminjaman berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function selesai($id)
    {
        DB::beginTransaction();
        try {
            $pinjam = Peminjaman::findOrFail($id);
            $barang = Barang::findOrFail($pinjam->id_barang);

            $barang->stok += $pinjam->jumlah;
            $barang->save();

            $pinjam->update([
                'status' => 'selesai',
                'tanggal_dikembalikan' => now(),
            ]);

            DB::commit();
            return redirect()->route('peminjaman.index')->with('success', 'Peminjaman diselesaikan.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->with('error', 'Terjadi kesalahan saat menyelesaikan: ' . $e->getMessage());
        }
    }

    public function selesaiViaQR($id)
    {
        DB::beginTransaction();
        try {
            $pinjam = Peminjaman::findOrFail($id);

            if ($pinjam->status !== 'dipinjam') {
                return redirect()->route('peminjaman.index')->with('error', 'Peminjaman sudah selesai.');
            }

            $barang = Barang::findOrFail($pinjam->id_barang);
            $barang->stok += $pinjam->jumlah;
            $barang->save();

            $pinjam->update([
                'status' => 'selesai',
                'tanggal_dikembalikan' => now(),
            ]);

            DB::commit();
            return redirect()->route('peminjaman.index')->with('success', 'Peminjaman diselesaikan melalui scan QR.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('peminjaman.index')->with('error', 'Gagal menyelesaikan melalui scan QR.');
        }
    }

    public function konfirmasiQr($id)
    {
        $pinjam = Peminjaman::with('barang')->findOrFail($id);

        return view('peminjaman.konfirmasi', compact('pinjam'));
    }

    public function edit(Request $request, $id)
    {
        $pinjam = Peminjaman::findOrFail($id);
        $includeSekaliPakai = $request->has('include_sekali_pakai');

        $barang = Barang::where(function ($q) use ($includeSekaliPakai) {
            $q->where('kategori', 'Barang Pinjam');
            if ($includeSekaliPakai) {
                $q->orWhere('kategori', 'Barang Sekali Pakai');
            }
        })->get();

        return view('peminjaman.edit', [
            'pinjam' => $pinjam,
            'barangPinjam' => $barang->where('kategori', 'Barang Pinjam'),
            'barangSekaliPakai' => $barang->where('kategori', 'Barang Sekali Pakai'),
            'includeSekaliPakai' => $includeSekaliPakai
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'id_barang'        => 'required|exists:barang,id_barang',
            'jumlah'           => 'required|integer|min:1',
            'nama_peminjam'    => 'required|string',
            'kontak_peminjam'  => 'required|string',
            'divisi'           => 'nullable|string|max:255', // ✅ validasi divisi
            'tanggal_pinjam'   => 'required|date',
            'tanggal_kembali'  => 'required|date|after_or_equal:tanggal_pinjam',
            'foto_peminjam'    => 'nullable|image|max:2048',
        ]);

        DB::beginTransaction();
        try {
            $pinjam = Peminjaman::findOrFail($id);

            $barangLama = Barang::findOrFail($pinjam->id_barang);
            $barangBaru = Barang::findOrFail($request->id_barang);

            // Kembalikan stok dari peminjaman lama
            $barangLama->stok += $pinjam->jumlah;
            $barangLama->save();

            // Cek stok barang baru
            if ($barangBaru->stok < $request->jumlah) {
                return back()->with('error', 'Stok tidak mencukupi untuk barang yang dipilih.');
            }

            // Kurangi stok barang baru
            $barangBaru->stok -= $request->jumlah;
            $barangBaru->save();

            $data = $request->only([
                'id_barang', 'jumlah', 'nama_peminjam', 'kontak_peminjam',
                'divisi', // ✅ simpan divisi
                'tanggal_pinjam', 'tanggal_kembali'
            ]);

            if ($request->hasFile('foto_peminjam')) {
                if ($pinjam->foto_peminjam && Storage::disk('public')->exists($pinjam->foto_peminjam)) {
                    Storage::disk('public')->delete($pinjam->foto_peminjam);
                }
                $data['foto_peminjam'] = $request->file('foto_peminjam')->store('foto_peminjam', 'public');
            }

            $pinjam->update($data);

            DB::commit();
            return redirect()->route('peminjaman.index')->with('success', 'Data peminjaman berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->with('error', 'Terjadi kesalahan saat memperbarui: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $pinjam = Peminjaman::findOrFail($id);

            if ($pinjam->status === 'dipinjam') {
                $barang = Barang::findOrFail($pinjam->id_barang);
                $barang->stok += $pinjam->jumlah;
                $barang->save();
            }

            if ($pinjam->foto_peminjam && Storage::disk('public')->exists($pinjam->foto_peminjam)) {
                Storage::disk('public')->delete($pinjam->foto_peminjam);
            }

            $pinjam->delete();

            DB::commit();
            return back()->with('success', 'Data dihapus!');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->with('error', 'Terjadi kesalahan saat menghapus: ' . $e->getMessage());
        }
    }

    public function cetakStruk($id)
    {
        $pinjam = Peminjaman::with('barang')->findOrFail($id);
        $pdf = Pdf::loadView('peminjaman.struk', compact('pinjam'))->setPaper('A5', 'portrait');
        return $pdf->stream("Struk_Peminjaman_{$pinjam->id}.pdf");
    }
}
