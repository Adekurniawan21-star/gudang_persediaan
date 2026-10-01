@extends('layouts.app')

@section('title', 'Peminjaman Barang')

@section('content')
<style>
    .judul-page {
        font-weight: 800;
        font-size: 3rem;
        background: linear-gradient(90deg, #4e73df, #1cc88a);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: 1px;
        text-transform: uppercase;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        display: inline-block;
        margin-bottom: 15px;
    }
</style>
<div class="container-fluid custom-container mt-0">
     <!-- Judul Tengah dan Rapat -->
    <div class="d-flex justify-content-center align-items-center mb-0" style="margin-top: -40px;">
        <h1 class="judul-page text-center">Daftar Peminjaman</h1>
    </div>

    <!-- Tombol Aksi -->
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <a href="{{ route('peminjaman.create') }}" 
           class="btn btn-primary shadow-sm px-4 py-2 fw-semibold rounded-pill d-flex align-items-center gap-2"
           style="transition: 0.3s;">
            <i class="fas fa-plus-circle"></i> Tambah Peminjaman
        </a>

        <a href="{{ route('peminjaman.scan.qr') }}" 
           class="btn btn-dark shadow-sm px-4 py-2 fw-semibold rounded-pill d-flex align-items-center gap-2"
           style="transition: 0.3s;">
            <i class="fas fa-qrcode"></i> Scan QR
        </a>
    </div>

    <form method="GET" action="{{ route('peminjaman.index') }}" class="row gy-2 gx-3 align-items-end mb-4">
        <div class="col-md-4">
            <label class="form-label fw-semibold">Cari Nama Peminjam / Barang</label>
            <input type="text" name="search" class="form-control rounded-3 shadow-sm" value="{{ request('search') }}">
        </div>
        <div class="col-md-3">
            <label class="form-label fw-semibold">Status</label>
            <select name="status" class="form-select rounded-3 shadow-sm">
                <option value="">-- Semua Status --</option>
                <option value="dipinjam" {{ request('status') == 'dipinjam' ? 'selected' : '' }}>Dipinjam</option>
                <option value="selesai" {{ request('status') == 'selesai' ? 'selected' : '' }}>Selesai</option>
            </select>
        </div>
        <div class="col-md-2">
            <button class="btn btn-primary w-100 rounded-3 fw-semibold shadow-sm">🔎 Filter</button>
        </div>
        <div class="col-md-2">
            <a href="{{ route('peminjaman.index') }}" class="btn btn-secondary w-100 rounded-3 fw-semibold shadow-sm">🔁 Reset</a>
        </div>
    </form>

    <div class="card shadow border-0 rounded-4">
        <div class="card-body table-responsive">
            <table class="table table-hover table-bordered text-center align-middle custom-table">
                <thead class="table-primary text-white">
                    <tr class="align-middle">
                        <th>No</th>
                        <th>Barang</th>
                        <th>Jumlah</th>
                        <th>Tanggal Berlaku</th>
                        <th>Pengembalian</th>
                        <th>Peminjam</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($peminjaman as $item)
                        @php
                            $today = \Carbon\Carbon::today();
                            $kembali = \Carbon\Carbon::parse($item->tanggal_kembali);
                            $diff = $today->diffInDays($kembali, false);
                        @endphp
                        <tr>
                            <td>{{ $loop->iteration }}</td>
                            <td>
                                <div class="fw-bold">{{ $item->barang->nama_barang ?? '-' }}</div>
                                @if($item->barang?->kategori)
                                    <small class="text-muted">({{ $item->barang->kategori }})</small>
                                @endif
                            </td>
                            <td class="fw-bold text-primary">{{ $item->jumlah ?? '❌' }}</td>
                            <td>
                                <span class="badge bg-light text-dark rounded-pill shadow-sm px-3 py-2">
                                    {{ $item->tanggal_pinjam }} s/d {{ $item->tanggal_kembali }}
                                </span>
                            </td>
                            <td>
                                @if($item->status == 'selesai' && $item->tanggal_dikembalikan)
                                    <span class="text-success fw-semibold">
                                        {{ \Carbon\Carbon::parse($item->tanggal_dikembalikan)->translatedFormat('d F Y') }}
                                    </span>
                                @else
                                    <span class="text-muted">-</span>
                                @endif
                            </td>
                            <td>
                                <div class="d-flex align-items-center gap-2 text-start">
                                    @if($item->foto_peminjam)
                                        <a href="#" data-bs-toggle="modal" data-bs-target="#fotoModal{{ $item->id }}">
                                            <img src="{{ asset('storage/' . $item->foto_peminjam) }}" width="50" height="50" class="rounded border shadow-sm" style="object-fit: cover;" />
                                        </a>

                                        <!-- Modal Foto -->
                                        <div class="modal fade" id="fotoModal{{ $item->id }}" tabindex="-1" aria-labelledby="fotoModalLabel{{ $item->id }}" aria-hidden="true">
                                            <div class="modal-dialog modal-dialog-centered">
                                                <div class="modal-content">
                                                    <div class="modal-body p-0">
                                                        <img src="{{ asset('storage/' . $item->foto_peminjam) }}" class="img-fluid rounded" alt="Foto Peminjam">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    @endif

                                    <div class="peminjam-info">
                                        <div class="fw-semibold">{{ $item->nama_peminjam }}</div>
                                        <small class="text-muted">{{ $item->kontak_peminjam }}</small>
                                    </div>
                                </div>
                            </td>

                            <td>
                                @if($item->status == 'selesai')
                                    <span class="badge bg-secondary text-dark rounded-pill status-badge">Selesai</span>
                                @elseif($diff < 0)
                                    <span class="badge bg-danger text-white rounded-pill blink status-badge">Jatuh Tempo</span>
                                @elseif($diff == 0)
                                    <span class="badge bg-danger text-white rounded-pill status-badge">Hari Ini</span>
                                @elseif($diff <= 2)
                                    <span class="badge bg-warning text-dark rounded-pill status-badge">Mendekati</span>
                                @else
                                    <span class="badge bg-success text-white rounded-pill status-badge">Dipinjam</span>
                                @endif
                            </td>

                            <td>
                                <div class="d-flex gap-2 justify-content-center flex-wrap">
                                    @if($item->status == 'dipinjam')
                                        <form action="{{ route('peminjaman.selesai', $item->id) }}" method="POST" onsubmit="return confirm('Apakah Anda yakin ingin menyelesaikan peminjaman ini?')">
                                            @csrf
                                            @method('PUT')
                                            <button type="submit" class="btn btn-sm text-white fw-semibold d-flex align-items-center px-3" style="background-color: #198754;">
                                                <i class="bi bi-check-circle-fill me-1"></i> Selesai
                                            </button>
                                        </form>
                                    @endif

                                    <a href="{{ route('peminjaman.struk', $item->id) }}" class="btn btn-sm text-white fw-semibold d-flex align-items-center px-3" style="background-color: #17c1e8;">
                                        <i class="bi bi-printer-fill me-1"></i> Cetak
                                    </a>

                                    <a href="{{ route('peminjaman.edit', $item->id) }}" class="btn btn-sm text-dark fw-semibold d-flex align-items-center px-3" style="background-color: #fcd34d;">
                                        <i class="bi bi-pencil-square me-1"></i> Edit
                                    </a>

                                    <form action="{{ route('peminjaman.destroy', $item->id) }}" method="POST" onsubmit="return confirm('Yakin ingin menghapus data ini?')">
                                        @csrf
                                        @method('DELETE')
                                        <button class="btn btn-sm text-white fw-semibold d-flex align-items-center px-3" style="background-color: #ef4444;">
                                            <i class="bi bi-trash-fill me-1"></i> Hapus
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            @if($peminjaman->isEmpty())
                <div class="text-center text-muted py-4">📭 Tidak ada data peminjaman</div>
            @endif
        </div>
    </div>
</div>

<style>
    .judul-page {
        font-size: 2rem;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 1.5rem;
        border-bottom: 2px solid #ccc;
        padding-bottom: 0.5rem;
    }

    .custom-table th {
        background-color: #4e73df !important;
        color: #fff !important;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.9rem;
    }

    .custom-table td, .custom-table th {
        vertical-align: middle;
    }

    .blink {
        animation: blink 1.2s infinite;
    }

    @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0.3; }
        100% { opacity: 1; }
    }

    .custom-container {
        animation: fadeIn 0.4s ease-in-out;
    }

    .peminjam-info {
        line-height: 1.2;
    }

    .status-badge {
        font-size: 15px;
        padding: 10px 10px;
        font-weight: 600;
        letter-spacing: 0.5px;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.09);
        transition: 0.3s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }
</style>
@endsection
