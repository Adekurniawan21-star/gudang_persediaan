@extends('layouts.app')

@section('title', 'Konfirmasi Pengembalian')

@section('content')
<style>
    .judul-keren {
        display: inline-block;
        font-size: 1.8rem;
        font-weight: 700;
        background: linear-gradient(90deg, #4e73df, #1cc88a);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
        margin-bottom: 20px;
    }

    .card-custom {
        border-radius: 16px;
        box-shadow: 0 12px 25px rgba(0, 0, 0, 0.08);
        padding: 25px;
        background: white;
    }

    .table-custom th {
        background: #4e73df;
        color: white;
        text-align: left;
        vertical-align: middle;
        width: 30%;
        font-weight: 600;
        font-size: 0.95rem;
    }

    .table-custom td {
        background: #f8f9fc;
        vertical-align: middle;
        font-size: 0.95rem;
    }

    .btn-success {
        background: linear-gradient(to right, #1cc88a, #17a673);
        border: none;
        font-weight: bold;
        letter-spacing: 0.5px;
        border-radius: 8px;
        padding: 10px 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
    }

    .btn-success:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }

    .btn-secondary {
        border-radius: 8px;
        padding: 10px 20px;
        font-weight: bold;
        background: #e2e6ea;
        color: #343a40;
        transition: 0.3s ease;
    }

    .btn-secondary:hover {
        background: #d6d8db;
    }

    .badge-status {
        font-size: 0.9rem;
        padding: 5px 10px;
        border-radius: 20px;
    }
</style>

<div class="container-fluid mt-3">
    <h1 class="judul-keren">Konfirmasi Pengembalian</h1>

    <div class="card card-custom mx-auto" style="max-width: 800px;">
        <div class="card-body">
            <h5 class="mb-3 fw-bold"><i class="fas fa-box-open me-2 text-primary"></i> Detail Peminjaman</h5>
            <table class="table table-bordered table-custom">
                <tr>
                    <th>Nama Peminjam</th>
                    <td>{{ $pinjam->nama_peminjam }}</td>
                </tr>
                <tr>
                    <th>Divisi</th>
                    <td>{{ $pinjam->divisi ?? '-' }}</td>
                </tr>
                <tr>
                    <th>Barang</th>
                    <td>{{ $pinjam->barang->nama_barang ?? '-' }}</td>
                </tr>
                <tr>
                    <th>Jumlah</th>
                    <td>{{ $pinjam->jumlah }} pcs</td>
                </tr>
                <tr>
                    <th>Tanggal Pinjam</th>
                    <td>{{ \Carbon\Carbon::parse($pinjam->tanggal_pinjam)->format('d M Y') }}</td>
                </tr>
                <tr>
                    <th>Tanggal Kembali</th>
                    <td>{{ \Carbon\Carbon::parse($pinjam->tanggal_kembali)->format('d M Y') }}</td>
                </tr>
                <tr>
                    <th>Status</th>
                    <td>
                        <span class="badge bg-success badge-status text-white">{{ ucfirst($pinjam->status) }}</span>
                    </td>
                </tr>
            </table>

            <form action="{{ route('peminjaman.selesai', $pinjam->id) }}" method="POST" onsubmit="return confirm('Apakah kamu yakin ingin menyelesaikan peminjaman ini?')">
                @csrf
                @method('PUT')
                <div class="d-flex justify-content-between mt-4 flex-wrap gap-2">
                    <button class="btn btn-success">
                        <i class="fas fa-check-circle me-1"></i> Selesaikan Peminjaman
                    </button>
                    <a href="{{ route('peminjaman.index') }}" class="btn btn-secondary">
                        <i class="fas fa-times-circle me-1"></i> Batal
                    </a>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
