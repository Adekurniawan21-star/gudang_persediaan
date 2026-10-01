@extends('layouts.app')

@section('title', 'Scan QR Peminjaman')

@section('content')
<style>
    .judul-keren {
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
        box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
        padding: 25px;
    }

    .video-border {
        border: 3px solid #4e73df;
        border-radius: 12px;
        box-shadow: 0 8px 18px rgba(0,0,0,0.1);
    }

    .alert-info-custom {
        background-color: #e2f0ff;
        border: 1px solid #b6d4fe;
        color: #1b4b91;
        font-weight: 500;
    }

    .btn-secondary {
        border-radius: 10px;
        padding: 10px 20px;
        font-weight: bold;
        transition: all 0.3s ease;
    }

    .btn-secondary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
</style>

<div class="container-fluid mt-0 text-center">

    <div class="alert alert-info alert-info-custom mx-auto" style="max-width: 600px;">
        📷 Arahkan kamera ke QR Code pada struk peminjaman untuk menyelesaikan.
    </div>

    <div class="card card-custom mx-auto mt-4" style="max-width: 600px;">
        <div class="card-body text-center">
            <video id="preview" width="100%" class="video-border" autoplay></video>
            <div class="mt-4">
                <a href="{{ route('peminjaman.index') }}" class="btn btn-secondary">
                    <i class="fas fa-arrow-left me-1"></i> Kembali
                </a>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script src="https://unpkg.com/jsqr/dist/jsQR.js"></script>

<script>
    const video = document.getElementById('preview');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    let scanning = true;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function (stream) {
            video.srcObject = stream;
            video.setAttribute("playsinline", true);
            video.play();
            requestAnimationFrame(scanFrame);
        })
        .catch(function (err) {
            alert("Gagal mengakses kamera: " + err.message);
        });

    function scanFrame() {
        if (!scanning) return;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);

            if (code) {
                scanning = false;
                const url = code.data;

                const confirmScan = confirm("✅ QR Terdeteksi!\n\nLanjutkan ke halaman pengembalian?");
                if (confirmScan) {
                    window.location.href = url;
                } else {
                    scanning = true;
                    requestAnimationFrame(scanFrame);
                }
                return;
            }
        }
        requestAnimationFrame(scanFrame);
    }
</script>
@endpush
