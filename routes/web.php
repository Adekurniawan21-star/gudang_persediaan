<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\BarangMasukController;
use App\Http\Controllers\BarangKeluarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PeminjamanController;

// Route awal: redirect ke login
Route::get('/', function () {
    return redirect()->route('login');
});

// Auth routes (login & logout)
Route::middleware('guest')->group(function () {
    Route::get('login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);
});
Route::post('logout', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])->name('logout');

// Semua route setelah login
Route::middleware(['auth'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Barang
    Route::resource('barang', BarangController::class)->except(['show']);
    Route::get('barang/{id}/cetak-barcode', [BarangController::class, 'cetakBarcode'])->name('barang.cetak_barcode');
    Route::get('barang/cetak-semua-barcode', [BarangController::class, 'cetakSemuaBarcode'])->name('barang.cetak_semua_barcode');

    // Barang Masuk
    Route::get('barang-masuk', [BarangMasukController::class, 'index'])->name('barang_masuk.index');
    Route::get('barang-masuk/create', [BarangMasukController::class, 'create'])->name('barang_masuk.create');
    Route::post('barang-masuk', [BarangMasukController::class, 'store'])->name('barang_masuk.store');
    Route::get('barang-masuk/{id}/edit', [BarangMasukController::class, 'edit'])->name('barang_masuk.edit');
    Route::put('barang-masuk/{id}', [BarangMasukController::class, 'update'])->name('barang_masuk.update');
    Route::delete('barang-masuk/{id}', [BarangMasukController::class, 'destroy'])->name('barang_masuk.destroy');
    Route::get('barang-masuk/export-pdf', [BarangMasukController::class, 'exportPdf'])->name('barang_masuk.export_pdf');

    // Barang Keluar
    Route::get('barang-keluar', [BarangKeluarController::class, 'index'])->name('barang_keluar.index');
    Route::get('barang-keluar/create', [BarangKeluarController::class, 'create'])->name('barang_keluar.create');
    Route::post('barang-keluar', [BarangKeluarController::class, 'store'])->name('barang_keluar.store');
    Route::get('barang-keluar/{id}/edit', [BarangKeluarController::class, 'edit'])->name('barang_keluar.edit');
    Route::put('barang-keluar/{id}', [BarangKeluarController::class, 'update'])->name('barang_keluar.update');
    Route::delete('barang-keluar/{id}', [BarangKeluarController::class, 'destroy'])->name('barang_keluar.destroy');
    Route::get('barang-keluar/export-pdf', [BarangKeluarController::class, 'exportPdf'])->name('barang_keluar.export_pdf');

    // Peminjaman
    Route::get('/peminjaman', [PeminjamanController::class, 'index'])->name('peminjaman.index');
    Route::get('/peminjaman/create', [PeminjamanController::class, 'create'])->name('peminjaman.create');
    Route::post('/peminjaman', [PeminjamanController::class, 'store'])->name('peminjaman.store');
    Route::get('/peminjaman/{id}/edit', [PeminjamanController::class, 'edit'])->name('peminjaman.edit');
    Route::put('/peminjaman/{id}', [PeminjamanController::class, 'update'])->name('peminjaman.update');
    Route::delete('/peminjaman/{id}', [PeminjamanController::class, 'destroy'])->name('peminjaman.destroy');

    // Cetak Struk
    Route::get('/peminjaman/{id}/struk', [PeminjamanController::class, 'cetakStruk'])->name('peminjaman.struk');

    // Penyelesaian peminjaman manual
    Route::put('/peminjaman/{id}/selesai', [PeminjamanController::class, 'selesai'])->name('peminjaman.selesai');

    // ✅ Penyelesaian peminjaman via QR GET (untuk scan kamera)
    Route::get('/peminjaman/selesai-via-qr/{id}', [PeminjamanController::class, 'selesaiViaQr'])->name('peminjaman.selesai.qr');
    Route::get('/peminjaman/konfirmasi/{id}', [PeminjamanController::class, 'konfirmasiQr'])->name('peminjaman.konfirmasi.qr');

    // ✅ Tampilan halaman scan kamera
    Route::get('/peminjaman/scan-qr', function () {
        return view('peminjaman.scan');
    })->name('peminjaman.scan.qr');
});
