@extends('layouts.app')

@section('title', 'Barang Masuk')

@section('content')
<style>
    /* Header tabel */
    .table thead th {
        background-color: #4e73df;
        color: white !important;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 0.95rem;
        text-align: center;
    }

    .table td {
        font-weight: 500;
        color: #343a40;
        vertical-align: middle;
    }

    .table tbody tr:hover {
        background-color: rgba(78, 115, 223, 0.05);
        transition: all 0.3s;
    }

    .btn-action {
        border-radius: 50px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        transition: all 0.3s;
        font-weight: 600;
        padding: 6px 16px;
        letter-spacing: 0.5px;
    }
    .btn-action i {
        margin-right: 4px;
    }
    .btn-action:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    }

    .judul-page {
        font-weight: 800;
        font-size: 2rem;
        background: linear-gradient(90deg, #4e73df, #1cc88a);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: 1px;
        text-transform: uppercase;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        display: inline-block;
        margin-bottom: 15px;
    }

    .card-custom {
        border-radius: 20px;
        box-shadow: 0 12px 30px rgba(0,0,0,0.1);
    }
</style>

<div class="container-fluid">

    <div class="d-flex justify-content-center align-items-center " style="margin-top: -40px;">
        <h1 class="judul-page text-center">Daftar Barang Masuk</h1>
    </div>

    <div class="d-flex flex-wrap gap-2 mb-3">
        <a href="{{ route('barang_masuk.create') }}" class="btn btn-primary btn-action">
            <i class="fas fa-plus"></i> Tambah Barang Masuk
        </a>
        <a href="{{ route('barang_masuk.export_pdf') }}" class="btn btn-danger btn-action">
            <i class="fas fa-file-pdf"></i> Export PDF
        </a>
    </div>

    @if (session('success'))
        <div class="alert alert-success shadow-sm fw-semibold">{{ session('success') }}</div>
    @endif

    <div class="card p-3 mb-4 shadow-sm">
        <div class="row g-2 align-items-center">
            <div class="col-md-2">
                <input type="date" id="filterTanggal" class="form-control">
            </div>
            <div class="col-md-2">
                <select id="filterBulan" class="form-select">
                    <option value="">Pilih Bulan</option>
                    @for ($i = 1; $i <= 12; $i++)
                        <option value="{{ str_pad($i, 2, '0', STR_PAD_LEFT) }}">
                            {{ DateTime::createFromFormat('!m', $i)->format('F') }}
                        </option>
                    @endfor
                </select>
            </div>
            <div class="col-md-2">
                <select id="filterTahun" class="form-select">
                    <option value="">Pilih Tahun</option>
                    @for ($year = date('Y'); $year >= 2020; $year--)
                        <option value="{{ $year }}">{{ $year }}</option>
                    @endfor
                </select>
            </div>
            <div class="col-md-3 text-end">
                <button class="btn btn-primary me-2" id="applyFilter">Filter</button>
                <button class="btn btn-secondary" id="resetFilter">Reset</button>
            </div>
        </div>
    </div>

    <div class="card card-custom mb-4 border-0">
        <div class="card-body">

            <div class="table-responsive">
                <table id="tableBarangMasuk" class="table table-bordered align-middle" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Barang</th>
                            <th>Jumlah</th>
                            <th>Tanggal</th>
                            <th>Keterangan</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($barangMasuk as $bm)
                        <tr>
                            <td class="text-center">{{ $loop->iteration }}</td>
                            <td class="fw-semibold">{{ $bm->barang->nama_barang }}</td>
                            <td class="text-center">{{ $bm->jumlah }}</td>
                            <td>{{ $bm->tanggal }}</td>
                            <td>{{ $bm->keterangan }}</td>
                            <td class="text-center">
                                <a href="{{ route('barang_masuk.edit', $bm->id_masuk) }}" class="btn btn-warning btn-sm btn-action mb-1" title="Edit">
                                    <i class="fas fa-edit"></i> Edit
                                </a>
                                <form action="{{ route('barang_masuk.destroy', $bm->id_masuk) }}" method="POST" style="display:inline;">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-danger btn-sm btn-action" onclick="return confirm('Yakin ingin hapus?')" title="Hapus">
                                        <i class="fas fa-trash"></i> Hapus
                                    </button>
                                </form>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css">
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>

<script>
    $(document).ready(function() {
        const table = $('#tableBarangMasuk').DataTable({
            "pageLength": 10,
            "lengthMenu": [10, 25, 50, 100],
            "order": [[3, "desc"]],
            "language": {
                "search": "Cari:",
                "lengthMenu": "Tampilkan _MENU_ data",
                "info": "Menampilkan _START_ - _END_ dari _TOTAL_ data",
                "paginate": {
                    "first": "Awal",
                    "last": "Akhir",
                    "next": "Berikutnya",
                    "previous": "Sebelumnya"
                },
                "zeroRecords": "Tidak ada data ditemukan",
                "infoEmpty": "Menampilkan 0 data",
                "infoFiltered": "(difilter dari _MAX_ total data)"
            }
        });

        $('#filterTanggal, #filterBulan, #filterTahun').on('change', function() {
            table.draw();
        });

        $('#resetFilter').on('click', function() {
            $('#filterTanggal').val('');
            $('#filterBulan').val('');
            $('#filterTahun').val('');
            table.search('').columns().search('').draw();
        });

        $.fn.dataTable.ext.search.push(
            function(settings, data, dataIndex) {
                let tanggal = data[3] || ""; // kolom tanggal
                let selectedTanggal = $('#filterTanggal').val();
                let selectedBulan = $('#filterBulan').val();
                let selectedTahun = $('#filterTahun').val();

                let tglObj = new Date(tanggal);

                if (selectedTanggal) {
                    if (tanggal !== selectedTanggal) {
                        return false;
                    }
                }
                if (selectedBulan) {
                    if ((tglObj.getMonth() + 1).toString().padStart(2, '0') !== selectedBulan) {
                        return false;
                    }
                }
                if (selectedTahun) {
                    if (tglObj.getFullYear().toString() !== selectedTahun) {
                        return false;
                    }
                }
                return true;
            }
        );
    });
</script>
@endpush
@endsection
