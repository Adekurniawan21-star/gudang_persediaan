@extends('layouts.app')

@section('title', 'Edit Peminjaman')

@section('content')
<style>
    .judul-tombol {
        display: inline-block;
        padding: 12px 35px;
        font-size: 1.3rem;
        font-weight: 700;
        color: white;
        background: linear-gradient(90deg, #4e73df, #1cc88a);
        border: none;
        border-radius: 50px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-bottom: 25px;
        transition: all 0.3s;
    }

    .judul-tombol:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.3);
    }

    .card-custom {
        border-radius: 20px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        padding: 30px;
    }

    .label-button {
        display: block;
        width: 100%;
        background: linear-gradient(90deg, rgba(78, 115, 223, 0.7), rgba(28, 200, 138, 0.7));
        color: white;
        font-weight: 700;
        text-align: left;
        border-radius: 8px;
        padding: 8px 15px;
        margin-bottom: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        letter-spacing: 0.5px;
        transition: all 0.3s;
        opacity: 0.9;
    }

    .label-button:hover {
        opacity: 1;
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.15);
    }

    .form-control, .form-control-file, .form-select {
        border-radius: 10px;
        border: 1px solid #d1d3e2;
        transition: all 0.3s;
        font-size: 1rem;
    }

    .form-control::placeholder {
        color: #9da5b1;
        font-style: italic;
    }

    .form-control:focus, .form-control-file:focus {
        box-shadow: 0 0 12px rgba(78, 115, 223, 0.3);
        border-color: #4e73df;
    }

    .btn-submit {
        border-radius: 12px;
        box-shadow: 0 6px 15px rgba(0,0,0,0.15);
        transition: all 0.3s;
        font-weight: 700;
        letter-spacing: 0.5px;
        font-size: 1rem;
    }

    .btn-submit i {
        margin-right: 5px;
    }

    .btn-submit:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 25px rgba(0,0,0,0.25);
    }
</style>

<div class="container-fluid mt-3 text-center">
    <h1 class="judul-tombol">Edit Peminjaman</h1>

    <div class="card card-custom mx-auto mb-4" style="max-width: 700px;">
        <div class="card-body text-start">
            <form action="{{ route('peminjaman.update', $pinjam->id) }}" method="POST" enctype="multipart/form-data">
                @csrf
                @method('PUT')

                <div class="mb-3 form-check text-start">
                    <input type="checkbox" class="form-check-input" id="toggleSekaliPakai"
                        onchange="window.location='{{ route('peminjaman.edit', $pinjam->id) }}' + (this.checked ? '?include_sekali_pakai=1' : '')"
                        {{ $includeSekaliPakai ? 'checked' : '' }}>
                    <label class="form-check-label" for="toggleSekaliPakai">
                        Tampilkan juga Barang Sekali Pakai
                    </label>
                </div>

                <div class="mb-3">
                    <span class="label-button">Pilih Barang</span>
                    <select name="id_barang" class="form-control" required>
                        <option value="">-- Pilih Barang --</option>
                        @foreach($barangPinjam as $b)
                            <option value="{{ $b->id_barang }}" {{ $b->id_barang == $pinjam->id_barang ? 'selected' : '' }}>
                                {{ $b->nama_barang }} ({{ $b->kategori }})
                            </option>
                        @endforeach
                        @foreach($barangSekaliPakai as $b)
                            <option value="{{ $b->id_barang }}" {{ $b->id_barang == $pinjam->id_barang ? 'selected' : '' }}>
                                {{ $b->nama_barang }} ({{ $b->kategori }})
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="mb-3">
                    <span class="label-button">Jumlah Barang</span>
                    <input type="number" name="jumlah" class="form-control" value="{{ $pinjam->jumlah }}" min="1" required>
                </div>

                <div class="mb-3">
                    <span class="label-button">Nama Peminjam</span>
                    <input type="text" name="nama_peminjam" class="form-control" value="{{ $pinjam->nama_peminjam }}" required>
                </div>

                <div class="mb-3">
                    <span class="label-button">Nomor Kontak</span>
                    <input type="text" name="kontak_peminjam" class="form-control" value="{{ $pinjam->kontak_peminjam }}" required>
                </div>

                <div class="mb-3">
                    <span class="label-button">Divisi</span> <!-- ✅ Tambahan field Divisi -->
                    <input type="text" name="divisi" class="form-control" value="{{ $pinjam->divisi }}" placeholder="Contoh: HRD atau Operasional" required>
                </div>

                <div class="mb-3">
                    <span class="label-button">Tanggal Pinjam</span>
                    <input type="date" name="tanggal_pinjam" class="form-control" value="{{ $pinjam->tanggal_pinjam }}" required>
                </div>

                <div class="mb-3">
                    <span class="label-button">Tanggal Kembali</span>
                    <input type="date" name="tanggal_kembali" class="form-control" value="{{ $pinjam->tanggal_kembali }}" required>
                </div>

                <div class="mb-4">
                    <span class="label-button">Foto Peminjam (opsional)</span>
                    <input type="file" name="foto_peminjam" class="form-control-file">
                    @if($pinjam->foto_peminjam)
                        <div class="mt-2">
                            <img src="{{ asset('storage/' . $pinjam->foto_peminjam) }}" width="100" class="rounded shadow-sm">
                            <p class="text-muted mb-0">Foto saat ini</p>
                        </div>
                    @endif
                </div>

                <button type="submit" class="btn btn-primary btn-submit w-100 mt-2">
                    <i class="fas fa-save"></i> Simpan Perubahan
                </button>
                <a href="{{ route('peminjaman.index') }}" class="btn btn-secondary w-100 mt-2">
                    <i class="fas fa-times"></i> Batal
                </a>
            </form>
        </div>
    </div>
</div>
@endsection
