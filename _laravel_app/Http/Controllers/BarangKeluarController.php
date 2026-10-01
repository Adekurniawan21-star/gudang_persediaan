<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\BarangKeluar;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class BarangKeluarController extends Controller
{
    public function index()
    {
        $barangKeluar = BarangKeluar::with('barang')->orderBy('tanggal', 'desc')->get();
        return view('barang_keluar.index', compact('barangKeluar'));
    }

    public function create()
    {
        $barang = Barang::all();
        return view('barang_keluar.create', compact('barang'));
    }

    public function store(Request $request)
    {
        // Kalau array items (scan barcode multiple)
        if ($request->has('items')) {
            foreach ($request->items as $item) {
                $barang = Barang::where('kode_barang', $item['kode_barang'])->first();
                if (!$barang) {
                    return redirect()->back()->with('error', 'Barang dengan kode ' . $item['kode_barang'] . ' tidak ditemukan!');
                }

                if ($barang->stok < $item['jumlah']) {
                    return redirect()->back()->with('error', 'Stok barang ' . $barang->nama_barang . ' tidak mencukupi!');
                }

                $barang->stok -= $item['jumlah'];
                $barang->save();

                BarangKeluar::create([
                    'id_barang' => $barang->id_barang,
                    'jumlah'    => $item['jumlah'],
                    'tanggal'   => date('Y-m-d'),
                    'keterangan'=> 'Scan Barcode',
                ]);
            }

            return redirect()->route('barang_keluar.index')->with('success', 'Data barang keluar (scan) berhasil disimpan!');
        }

        // Kalau manual (form biasa)
        $request->validate([
            'id_barang' => 'required',
            'jumlah'    => 'required|integer',
            'tanggal'   => 'required|date',
            'keterangan'=> 'nullable'
        ]);

        $barang = Barang::findOrFail($request->id_barang);

        if ($barang->stok < $request->jumlah) {
            return redirect()->back()->with('error', 'Stok tidak mencukupi!');
        }

        $barang->stok -= $request->jumlah;
        $barang->save();

        BarangKeluar::create($request->all());

        return redirect()->route('barang_keluar.index')->with('success', 'Data barang keluar berhasil ditambahkan!');
    }

    public function edit($id)
    {
        $barangKeluar = BarangKeluar::findOrFail($id);
        $barang = Barang::all();
        return view('barang_keluar.edit', compact('barangKeluar', 'barang'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'id_barang' => 'required',
            'jumlah'    => 'required|integer',
            'tanggal'   => 'required|date',
            'keterangan'=> 'nullable'
        ]);

        $barangKeluar = BarangKeluar::findOrFail($id);
        $barang = Barang::findOrFail($barangKeluar->id_barang);

        // Kembalikan stok lama
        $barang->stok += $barangKeluar->jumlah;

        // Update data
        $barangKeluar->update($request->all());

        // Kurangi stok lagi
        if ($barang->stok < $barangKeluar->jumlah) {
            return redirect()->back()->with('error', 'Stok tidak mencukupi untuk jumlah yang baru!');
        }

        $barang->stok -= $barangKeluar->jumlah;
        $barang->save();

        return redirect()->route('barang_keluar.index')->with('success', 'Data barang keluar berhasil diupdate!');
    }

    public function destroy($id)
    {
        $barangKeluar = \App\Models\BarangKeluar::findOrFail($id);
        $barang = \App\Models\Barang::findOrFail($barangKeluar->id_barang);

        // Kembalikan stok
        $barang->stok += $barangKeluar->jumlah;
        $barang->save();

        $barangKeluar->delete();

        return redirect()->route('barang_keluar.index')->with('success', 'Data barang keluar berhasil dihapus!');
    }


    public function exportPdf(Request $request)
    {
        $query = BarangKeluar::with('barang')->orderBy('tanggal', 'desc');

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('tanggal', [$request->start_date, $request->end_date]);
        }

        $barangKeluar = $query->get();

        $pdf = Pdf::loadView('barang_keluar.export_pdf', compact('barangKeluar'))->setPaper('a4', 'portrait');

        return $pdf->download('laporan-barang-keluar.pdf');
    }
}
