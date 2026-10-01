@extends('layouts.app')

@section('title', 'Edit Barang')

@section('content')
<div class="container-fluid">

    <!-- Page Heading -->
    <h1 class="h3 mb-4 text-gray-800">Edit Barang</h1>

    <div class="card shadow mb-4">
        <div class="card-body">

            <form action="{{ route('barang.update', $barang->id_barang) }}" method="POST" enctype="multipart/form-data">
                @csrf
                @method('PUT')
                <div class="form-group">
                    <label>Nama Barang</label>
                    <input type="text" name="nama_barang" class="form-control" value="{{ $barang->nama_barang }}" required>
                </div>
                <div class="form-group">
                    <label>Kode Barang</label>
                    <input type="text" name="kode_barang" class="form-control" value="{{ $barang->kode_barang }}" readonly>
                </div>
                <div class="form-group">
                    <label>Kategori</label>
                    <select name="kategori" class="form-control" required>
                        <option value="">-- Pilih Kategori --</option>
                        <option value="Barang Sekali Pakai" {{ $barang->kategori == 'Barang Sekali Pakai' ? 'selected' : '' }}>Barang Sekali Pakai</option>
                        <option value="Barang Pinjam" {{ $barang->kategori == 'Barang Pinjam' ? 'selected' : '' }}>Barang Pinjam</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Stok</label>
                    <input type="number" name="stok" class="form-control" value="{{ $barang->stok }}" required>
                </div>
                <div class="form-group">
                    <label>Foto Barang (opsional)</label>
                    <input type="file" name="foto" class="form-control-file">

                    @if ($barang->foto)
                        <div class="mt-2">
                            <img src="{{ asset('storage/' . $barang->foto) }}" alt="Foto Barang" style="max-width: 150px; cursor: pointer;" onclick="openImage('{{ asset('storage/' . $barang->foto) }}')">
                        </div>
                    @endif
                </div>
                <button type="submit" class="btn btn-primary mt-3">
                    <i class="fas fa-save"></i> Update
                </button>
            </form>

        </div>
    </div>
</div>

<!-- Modal untuk preview gambar -->
<div id="imageModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.7); justify-content:center; align-items:center;">
    <img id="modalImage" src="" style="max-width:90%; max-height:90%;">
</div>
@endsection

@push('scripts')
<script>
    function openImage(src) {
        document.getElementById('modalImage').src = src;
        document.getElementById('imageModal').style.display = 'flex';
    }

    document.getElementById('imageModal').addEventListener('click', function() {
        this.style.display = 'none';
    });
</script>
@endpush
