@extends('layouts.app')

@section('title', 'Tambah Barang Keluar')

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
        box-shadow: 0 6px 15px rgba(0,0,0,0.2);
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-bottom: 20px;
        transition: all 0.3s;
    }

    .judul-tombol:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    }

    .card-custom {
        border-radius: 20px;
        box-shadow: 0 12px 30px rgba(0,0,0,0.12);
        padding: 25px;
    }

    .label-button {
        display: block;
        width: 100%;
        background-color: rgba(78, 115, 223, 0.15);
        color: #4e73df;
        font-weight: 600;
        text-align: left;
        border-radius: 8px;
        padding: 8px 15px;
        margin-bottom: 6px;
        letter-spacing: 0.5px;
    }

    .form-control, select {
        border-radius: 10px;
        border: 1px solid #d1d3e2;
        transition: all 0.3s;
        font-size: 1rem;
    }

    .form-control::placeholder {
        color: #a0a4ac;
        font-style: italic;
    }

    .form-control:focus, select:focus {
        box-shadow: 0 0 10px rgba(78, 115, 223, 0.3);
        border-color: #4e73df;
    }

    .btn-submit {
        border-radius: 12px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.12);
        transition: all 0.3s;
        font-weight: 700;
        font-size: 1rem;
    }

    .btn-submit i {
        margin-right: 5px;
    }

    .btn-submit:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 25px rgba(0,0,0,0.2);
    }

    #listItems {
        max-height: 250px;
        overflow-y: auto;
        margin-bottom: 10px;
        border: 1px solid #d1d3e2;
        border-radius: 8px;
        padding: 10px;
    }
</style>

<div class="container-fluid d-flex justify-content-center">
    <div class="w-100" style="max-width: 800px;">
        <h1 class="judul-tombol text-center">Tambah Barang Keluar</h1>

        @if (session('error'))
            <div class="alert alert-danger">{{ session('error') }}</div>
        @endif

        <div class="card card-custom mb-5">
            <div class="card-body">

                <!-- Scan Form -->
                <span class="label-button text-center">Scan Barcode (Multi Barang)</span>
                <form id="scanForm" onsubmit="addItem(event)">
                    <div class="mb-2">
                        <span class="label-button">Kode Barang (Scan)</span>
                        <input type="text" id="kode_scan" class="form-control" placeholder="Masukkan atau scan kode" autofocus>
                    </div>
                    <div class="mb-2">
                        <span class="label-button">Jumlah</span>
                        <input type="number" id="jumlah_scan" class="form-control" value="1" min="1">
                    </div>
                    <button type="submit" class="btn btn-info btn-submit w-100 mb-3">Tambah ke Daftar</button>
                </form>

                <!-- Daftar Scan -->
                <span class="label-button text-center">Daftar Barang Scan</span>
                <form action="{{ route('barang_keluar.store') }}" method="POST" id="mainForm">
                    @csrf
                    <input type="hidden" name="tanggal" value="{{ date('Y-m-d') }}">
                    <div id="listItems" class="text-muted">Belum ada barang di-scan.</div>
                    <button type="submit" class="btn btn-success btn-submit w-100 mt-2">
                        <i class="fas fa-save"></i> Simpan Semua Scan
                    </button>
                </form>

                <hr class="my-4">

                <!-- Toggle Manual Form Checkbox -->
                <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" id="toggleManualForm" onchange="toggleManual()">
                    <label class="form-check-label" for="toggleManualForm">
                        Tampilkan Form Manual
                    </label>
                </div>

                <!-- Manual Form -->
                <div id="manualForm" style="display: none;">
                    <span class="label-button text-center">Tambah Manual (Satu Barang)</span>
                    <form action="{{ route('barang_keluar.store') }}" method="POST">
                        @csrf
                        <div class="mb-2">
                            <span class="label-button">Pilih Barang</span>
                            <select name="id_barang" class="form-control" required>
                                <option value="">-- Pilih --</option>
                                @foreach ($barang as $b)
                                    <option value="{{ $b->id_barang }}">{{ $b->nama_barang }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="mb-2">
                            <span class="label-button">Jumlah</span>
                            <input type="number" name="jumlah" class="form-control" required>
                        </div>
                        <div class="mb-2">
                            <span class="label-button">Tanggal</span>
                            <input type="date" name="tanggal" class="form-control" value="{{ date('Y-m-d') }}" required>
                        </div>
                        <div class="mb-3">
                            <span class="label-button">Keterangan</span>
                            <input type="text" name="keterangan" class="form-control" placeholder="Opsional">
                        </div>
                        <button type="submit" class="btn btn-primary btn-submit w-100">
                            <i class="fas fa-save"></i> Simpan Manual
                        </button>
                    </form>
                </div>

            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    let items = [];

    function addItem(e) {
        e.preventDefault();
        const kode = document.getElementById('kode_scan').value.trim();
        const jumlah = parseInt(document.getElementById('jumlah_scan').value);

        if (!kode || jumlah <= 0) {
            alert('Isi kode dan jumlah dengan benar');
            return;
        }

        items.push({ kode_barang: kode, jumlah: jumlah });
        renderItems();

        document.getElementById('kode_scan').value = '';
        document.getElementById('jumlah_scan').value = 1;
        document.getElementById('kode_scan').focus();
    }

    function hapusItem(index) {
        items.splice(index, 1);
        renderItems();
    }

    function renderItems() {
        const container = document.getElementById('listItems');
        container.innerHTML = '';

        if (items.length === 0) {
            container.innerHTML = '<p class="text-muted">Belum ada barang di-scan.</p>';
            return;
        }

        let html = '<table class="table table-bordered mb-0"><thead><tr><th>Kode Barang</th><th>Jumlah</th><th>Aksi</th></tr></thead><tbody>';
        items.forEach((item, index) => {
            html += `
                <tr>
                    <td>
                        ${item.kode_barang}
                        <input type="hidden" name="items[${index}][kode_barang]" value="${item.kode_barang}">
                    </td>
                    <td>
                        ${item.jumlah}
                        <input type="hidden" name="items[${index}][jumlah]" value="${item.jumlah}">
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger btn-sm" onclick="hapusItem(${index})">Hapus</button>
                    </td>
                </tr>
            `;
        });
        html += '</tbody></table>';
        container.innerHTML = html;
    }

    function toggleManual() {
        const checkbox = document.getElementById('toggleManualForm');
        const manualForm = document.getElementById('manualForm');
        manualForm.style.display = checkbox.checked ? 'block' : 'none';
    }
</script>
@endpush
