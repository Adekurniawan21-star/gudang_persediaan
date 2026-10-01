<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Struk Peminjaman</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            font-size: 13px;
            padding: 20px;
            color: #000;
            background-color: #fff;
        }

        .header {
            text-align: center;
            margin-bottom: 10px;
        }

        .header h2 {
            margin: 0;
            font-size: 20px;
            text-transform: uppercase;
        }

        .header p {
            margin: 4px 0 8px;
            font-size: 14px;
        }

        .garis-pemisah {
            width: 100%;
            border: 2px solid #000;
            margin: 10px 0 20px;
        }

        .info {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        .info td {
            padding: 6px 8px;
            vertical-align: top;
            font-size: 13px;
        }

        .info td:first-child {
            width: 130px;
            font-weight: bold;
        }

        .ttd {
            width: 100%;
            margin-top: 10px;
        }

        .ttd td {
            text-align: center;
            padding-top: 50px;
            font-size: 13px;
        }

        .qr {
            text-align: center;
            margin-top: 40px;
        }

        .barcode {
            display: inline-block;
            padding: 10px;
            border: 1px solid #000;
            border-radius: 4px;
            background: #fff;
            margin-bottom: 8px;
        }

        .qr-note {
            font-size: 10px;
            color: #555;
        }

        .qr-url {
            font-size: 10px;
            word-break: break-word;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>STRUK PEMINJAMAN BARANG</h2>
        <p>Gudang Environment</p>
    </div>

    <div class="garis-pemisah"></div>

    <table class="info">
        <tr><td>Nama Peminjam</td><td>: {{ $pinjam->nama_peminjam }}</td></tr>
        <tr><td>Divisi</td><td>: {{ $pinjam->divisi ?? '-' }}</td></tr> {{-- ✅ Tambahan divisi biasa --}}
        <tr><td>Kontak</td><td>: {{ $pinjam->kontak_peminjam }}</td></tr>
        <tr><td>Barang</td><td>: {{ $pinjam->barang->nama_barang ?? '-' }}</td></tr>
        <tr><td>Jumlah</td><td>: {{ $pinjam->jumlah }} pcs</td></tr>
        <tr><td>Tanggal Pinjam</td><td>: {{ \Carbon\Carbon::parse($pinjam->tanggal_pinjam)->format('d M Y') }}</td></tr>
        <tr><td>Tanggal Kembali</td><td>: {{ \Carbon\Carbon::parse($pinjam->tanggal_kembali)->format('d M Y') }}</td></tr>
        <tr><td>Status</td><td>: {{ ucfirst($pinjam->status) }}</td></tr>
    </table>

    <table class="ttd">
        <tr>
            <td>Peminjam</td>
            <td>Petugas</td>
        </tr>
        <tr>
            <td>( {{ $pinjam->nama_peminjam }} )</td>
            <td>( ____________________ )</td>
        </tr>
    </table>

    {{-- QR Code --}}
    <div class="qr">
        @php
            use Milon\Barcode\Facades\DNS2DFacade as DNS2D;
            $qrUrl = route('peminjaman.konfirmasi.qr', $pinjam->id);
        @endphp
        <p class="qr-note">Scan QR ini saat pengembalian untuk konfirmasi & penyelesaian</p>
        <div class="barcode">
            {!! DNS2D::getBarcodeHTML($qrUrl, 'QRCODE', 3, 3) !!}
        </div>
    </div>
</body>
</html>
