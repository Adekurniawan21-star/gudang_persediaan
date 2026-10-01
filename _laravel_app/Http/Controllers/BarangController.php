<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BarangController extends Controller
{
    public function index()
    {
        $barang = Barang::all();
        return view('barang.index', compact('barang'));
    }

    private function generateKodeBarang()
    {
        $lastBarang = Barang::orderBy('id_barang', 'desc')->first();
        $newNumber = $lastBarang ? intval(substr($lastBarang->kode_barang, 4)) + 1 : 1;
        return 'BRG-' . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }

    public function create()
    {
        $kode_barang = $this->generateKodeBarang();
        return view('barang.create', compact('kode_barang'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_barang' => 'required',
            'kategori'    => 'required|in:Barang Sekali Pakai,Barang Pinjam',
            'stok'        => 'required|integer',
            'foto'        => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $kode_barang = $this->generateKodeBarang();

        $data = [
            'nama_barang' => $request->nama_barang,
            'kode_barang' => $kode_barang,
            'kategori'    => $request->kategori,
            'stok'        => $request->stok,
        ];

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('barang', 'public');
            $data['foto'] = $path;
        }

        Barang::create($data);

        return redirect()->route('barang.index')->with('success', 'Barang berhasil ditambahkan!');
    }

    public function edit($id)
    {
        $barang = Barang::findOrFail($id);
        return view('barang.edit', compact('barang'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_barang' => 'required',
            'kode_barang' => 'required|unique:barang,kode_barang,' . $id . ',id_barang',
            'kategori'    => 'required|in:Barang Sekali Pakai,Barang Pinjam',
            'stok'        => 'required|integer',
            'foto'        => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $barang = Barang::findOrFail($id);
        $data = $request->only(['nama_barang', 'kode_barang', 'kategori', 'stok']);

        if ($request->hasFile('foto')) {
            if ($barang->foto && Storage::disk('public')->exists($barang->foto)) {
                Storage::disk('public')->delete($barang->foto);
            }
            $path = $request->file('foto')->store('barang', 'public');
            $data['foto'] = $path;
        }

        $barang->update($data);

        return redirect()->route('barang.index')->with('success', 'Barang berhasil diupdate!');
    }

    public function destroy($id)
    {
        $barang = Barang::findOrFail($id);

        if ($barang->foto && Storage::disk('public')->exists($barang->foto)) {
            Storage::disk('public')->delete($barang->foto);
        }

        $barang->delete();
        return redirect()->route('barang.index')->with('success', 'Barang berhasil dihapus!');
    }

    public function cetakBarcode($id)
    {
        $barang = Barang::findOrFail($id);
        return view('barang.cetak_barcode', compact('barang'));
    }

    public function cetakSemuaBarcode()
    {
        $barangs = Barang::all();
        return view('barang.cetak_semua_barcode', compact('barangs'));
    }
}
