<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\BarangMasuk;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class BarangMasukController extends Controller
{
    public function index()
    {
        $barangMasuk = BarangMasuk::with('barang')->orderBy('tanggal', 'desc')->get();
        return view('barang_masuk.index', compact('barangMasuk'));
    }

    public function create()
    {
        $barang = Barang::all();
        return view('barang_masuk.create', compact('barang'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_barang' => 'required',
            'jumlah'    => 'required|integer',
            'tanggal'   => 'required|date',
            'keterangan'=> 'nullable'
        ]);

        $barang = Barang::findOrFail($request->id_barang);
        $barang->stok += $request->jumlah;
        $barang->save();

        BarangMasuk::create($request->all());

        return redirect()->route('barang_masuk.index')->with('success', 'Data barang masuk berhasil ditambahkan!');
    }

    public function edit($id)
    {
        $barangMasuk = BarangMasuk::findOrFail($id);
        $barang = Barang::all();
        return view('barang_masuk.edit', compact('barangMasuk', 'barang'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'id_barang' => 'required',
            'jumlah'    => 'required|integer',
            'tanggal'   => 'required|date',
            'keterangan'=> 'nullable'
        ]);

        $barangMasuk = BarangMasuk::findOrFail($id);
        $barang = Barang::findOrFail($barangMasuk->id_barang);

        // Step 1: Kembalikan stok lama
        $barang->stok -= $barangMasuk->jumlah;

        // Step 2: Update data barang masuk
        $barangMasuk->update($request->all());

        // Step 3: Tambahkan stok baru
        $barang->stok += $barangMasuk->jumlah;
        $barang->save();

        return redirect()->route('barang_masuk.index')->with('success', 'Data barang masuk berhasil diupdate!');
    }

    public function destroy($id)
    {
        $barangMasuk = \App\Models\BarangMasuk::findOrFail($id);
        $barang = \App\Models\Barang::findOrFail($barangMasuk->id_barang);

        // Kembalikan stok
        $barang->stok -= $barangMasuk->jumlah;
        $barang->save();

        $barangMasuk->delete();

        return redirect()->route('barang_masuk.index')->with('success', 'Data barang masuk berhasil dihapus!');
    }


    public function laporan(Request $request)
    {
        $query = \App\Models\BarangMasuk::with('barang')->orderBy('tanggal', 'desc');

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('tanggal', [$request->start_date, $request->end_date]);
        }

        $barangMasuk = $query->get();
        return view('barang_masuk.laporan', compact('barangMasuk'));
    }

    public function exportPdf(Request $request)
    {
        $query = \App\Models\BarangMasuk::with('barang')->orderBy('tanggal', 'desc');

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('tanggal', [$request->start_date, $request->end_date]);
        }

        $barangMasuk = $query->get();

        $pdf = PDF::loadView('barang_masuk.export_pdf', compact('barangMasuk'))->setPaper('a4', 'portrait');

        return $pdf->download('laporan-barang-masuk.pdf');
    }
}

