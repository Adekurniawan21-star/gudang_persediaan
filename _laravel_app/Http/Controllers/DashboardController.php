<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Barang;
use App\Models\BarangMasuk;
use App\Models\BarangKeluar;
use App\Models\Peminjaman;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->filter ?? 'daily';

        // Total jumlah
        $totalStok     = Barang::sum('stok');
        $totalMasuk    = BarangMasuk::sum('jumlah');
        $totalKeluar   = BarangKeluar::sum('jumlah');
        $totalDipinjam = Peminjaman::where('status', 'dipinjam')->sum('jumlah');

        // Data untuk tabel
        $stokBarang     = Barang::all();
        $barangDipinjam = Peminjaman::with('barang')
                            ->where('status', 'dipinjam')
                            ->orderBy('tanggal_pinjam', 'desc')
                            ->get();

        // Hari ini
        $today = Carbon::today();
        $masukHariIni = BarangMasuk::with('barang')->whereDate('tanggal', $today)->get();
        $keluarHariIni = BarangKeluar::with('barang')->whereDate('tanggal', $today)->get();

        return view('dashboard.index', compact(
            'totalStok',
            'totalMasuk',
            'totalKeluar',
            'totalDipinjam',
            'stokBarang',
            'barangDipinjam',
            'masukHariIni',
            'keluarHariIni',
            'filter'
        ));
    }
}
