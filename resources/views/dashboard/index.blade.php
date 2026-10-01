@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="container-fluid py-3">

    {{-- Kartu Ringkasan --}}
    <div class="row g-4">
        <div class="col-md-3">
            <div class="card border-0 shadow-sm bg-primary text-white rounded-4">
                <div class="card-body">
                    <h6 class="fw-light mb-1">Total Stok Barang</h6>
                    <h4 class="fw-bold">{{ $totalStok }}</h4>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm bg-success text-white rounded-4">
                <div class="card-body">
                    <h6 class="fw-light mb-1">Barang Masuk</h6>
                    <h4 class="fw-bold">{{ $totalMasuk }}</h4>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm bg-danger text-white rounded-4">
                <div class="card-body">
                    <h6 class="fw-light mb-1">Barang Keluar</h6>
                    <h4 class="fw-bold">{{ $totalKeluar }}</h4>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm bg-warning text-dark rounded-4">
                <div class="card-body">
                    <h6 class="fw-light mb-1">Barang Dipinjam</h6>
                    <h4 class="fw-bold">{{ $totalDipinjam }}</h4>
                </div>
            </div>
        </div>
    </div>

    {{-- Stok dan Dipinjam --}}
    <div class="row mt-5 g-4">
        <div class="col-md-6">
            <div class="card shadow-sm rounded-4">
                <div class="card-header bg-primary text-white fw-bold rounded-top-4">Stok Barang</div>
                <div class="card-body table-responsive" style="max-height: 300px;">
                    <table class="table table-sm table-bordered table-hover align-middle">
                        <thead style="background-color: #dfe6fd;" class="text-dark fw-bold">
                            <tr>
                                <th>No</th>
                                <th>Nama Barang</th>
                                <th>Stok</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($stokBarang as $index => $b)
                                <tr>
                                    <td>{{ $index + 1 }}</td>
                                    <td>{{ $b->nama_barang }}</td>
                                    <td>{{ $b->stok }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="card shadow-sm rounded-4">
                <div class="card-header bg-warning text-dark fw-bold rounded-top-4">Barang Dipinjam</div>
                <div class="card-body table-responsive" style="max-height: 300px;">
                    <table class="table table-sm table-bordered table-hover align-middle">
                        <thead style="background-color: #fff3cd;" class="text-dark fw-bold">
                            <tr>
                                <th>No</th>
                                <th>Barang</th>
                                <th>Jumlah</th>
                                <th>Status</th>
                                <th>Tgl Kembali</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($barangDipinjam as $index => $item)
                                @php
                                    $today = \Carbon\Carbon::today();
                                    $kembali = \Carbon\Carbon::parse($item->tanggal_kembali);
                                    $diff = $today->diffInDays($kembali, false);
                                @endphp
                                <tr>
                                    <td>{{ $index + 1 }}</td>
                                    <td>{{ $item->barang->nama_barang ?? '-' }}</td>
                                    <td>{{ $item->jumlah }} pcs</td>
                                    <td>
                                        @switch(true)
                                            @case($item->status === 'selesai')
                                                <span class="badge bg-secondary">Selesai</span>
                                                @break
                                            @case($diff < 0)
                                                <span class="badge bg-danger blink text-white">Jatuh Tempo</span>
                                                @break
                                            @case($diff == 0)
                                                <span class="badge bg-danger text-white">Hari Ini</span>
                                                @break
                                            @case($diff <= 2)
                                                <span class="badge bg-warning text-dark">Mendekati</span>
                                                @break
                                            @default
                                                <span class="badge bg-success text-white">Dipinjam</span>
                                        @endswitch
                                    </td>
                                    <td>{{ \Carbon\Carbon::parse($item->tanggal_kembali)->format('d M Y') }}</td>
                                </tr>
                            @empty
                                <tr><td colspan="5" class="text-center text-muted">Tidak ada data</td></tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    {{-- Hari Ini --}}
    <div class="row mt-4 g-4">
        <div class="col-md-6">
            <div class="card shadow-sm rounded-4">
                <div class="card-header bg-success text-white fw-bold rounded-top-4">Barang Masuk Hari Ini</div>
                <div class="card-body table-responsive">
                    <table class="table table-sm table-bordered align-middle">
                        <thead style="background-color: #d1e7dd;" class="text-dark fw-bold">
                            <tr>
                                <th>No</th>
                                <th>Barang</th>
                                <th>Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($masukHariIni as $index => $m)
                                <tr>
                                    <td>{{ $index + 1 }}</td>
                                    <td>{{ $m->barang->nama_barang ?? '-' }}</td>
                                    <td>{{ $m->jumlah }}</td>
                                </tr>
                            @empty
                                <tr><td colspan="3" class="text-center text-muted">Tidak ada data</td></tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="card shadow-sm rounded-4">
                <div class="card-header bg-danger text-white fw-bold rounded-top-4">Barang Keluar Hari Ini</div>
                <div class="card-body table-responsive">
                    <table class="table table-sm table-bordered align-middle">
                        <thead style="background-color: #f8d7da;" class="text-dark fw-bold">
                            <tr>
                                <th>No</th>
                                <th>Barang</th>
                                <th>Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($keluarHariIni as $index => $k)
                                <tr>
                                    <td>{{ $index + 1 }}</td>
                                    <td>{{ $k->barang->nama_barang ?? '-' }}</td>
                                    <td>{{ $k->jumlah }}</td>
                                </tr>
                            @empty
                                <tr><td colspan="3" class="text-center text-muted">Tidak ada data</td></tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Animasi Blink --}}
<style>
    .blink {
        animation: blink 1s infinite;
    }

    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
    }

    .table th, .table td {
        vertical-align: middle;
    }
</style>
@endsection
