@extends('layouts.app')

@section('title', 'Tambah Barang')

@section('content')
<style>
    /* Judul style tombol */
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
        margin-bottom: 30px;
        transition: all 0.3s;
    }
    .judul-tombol:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.3);
    }

    /* Card style */
    .card-custom {
        border-radius: 20px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        padding: 30px;
    }

    /* Label style seperti tombol panjang */
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

    /* Input style */
    .form-control, .form-control-file {
        border-radius: 10px;
        border: 1px solid #d1d3e2;
        transition: all 0.3s;
        font-size: 1rem;
    }
    .form-control::placeholder {
        color: #9da5b1;
        font-style: italic;
        text-align: left;
    }
    .form-control:focus, .form-control-file:focus {
        box-shadow: 0 0 12px rgba(78, 115, 223, 0.3);
        border-color: #4e73df;
    }

    /* Tombol submit */
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

<div class="container-fluid text-center">

    <!-- Page Heading -->
    <h1 class="judul-tombol">Tambah Barang</h1>

    <div class="card card-custom mx-auto mb-5" style="max-width: 700px;">
        <div class="card-body text-start">

            <form action="{{ route('barang.store') }}" method="POST" enctype="multipart/form-data">
                @csrf

                <div class="mb-3">
                    <span class="label-button">Nama Barang</span>
                    <input type="text" name="nama_barang" class="form-control" placeholder="Contoh: Helm Safety" required>
                </div>

                <div class="mb-3">
                    <span class="label-button">Kode Barang</span>
                    <input type="text" class="form-control mb-2" value="{{ $kode_barang }}" readonly>
                    <input type="hidden" name="kode_barang" value="{{ $kode_barang }}">
                </div>

                <div class="mb-3">
                    <span class="label-button">Kategori</span>
                    <select name="kategori" class="form-control" required>
                        <option value="">-- Pilih Kategori --</option>
                        <option value="Barang Sekali Pakai">Barang Sekali Pakai</option>
                        <option value="Barang Pinjam">Barang Pinjam</option>
                    </select>
                </div>


                <div class="mb-3">
                    <span class="label-button">Stok</span>
                    <input type="number" name="stok" class="form-control" placeholder="Masukkan jumlah stok" required>
                </div>

                <div class="mb-4">
                    <span class="label-button">Foto Barang (opsional)</span>
                    <input type="file" name="foto" class="form-control-file">
                </div>

                <button type="submit" class="btn btn-success btn-submit w-100 mt-2">
                    <i class="fas fa-save"></i> Simpan
                </button>
            </form>

        </div>
    </div>
</div>
@endsection
