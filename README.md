# 📦 SIPERSEDIA — Sistem Informasi Gudang Persediaan
### BPS (Badan Pusat Statistik) Kabupaten Ogan Komering Ulu Selatan

Aplikasi web modern untuk pencatatan, pemantauan, dan pelaporan barang persediaan kantor BPS Kabupaten OKU Selatan.

---

## 🚀 Teknologi Utama

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Library**: [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Cloud Database (Opsional)**: [Supabase](https://supabase.com/)
- **Deployment Platform**: [Vercel](https://vercel.com/)

> **Catatan**: Aplikasi ini adalah aplikasi web modern berbasis Node.js / Next.js, sehingga **TIDAK memerlukan Laragon/Apache/PHP**. Aplikasi dapat dijalankan langsung di komputer lokal menggunakan Node.js dan siap di-hosting langsung ke **Vercel**.

---

## 💻 Menjalankan di Lokal (Development)

1. Pastikan **Node.js** (v18 ke atas) telah terinstal di komputer.
2. Buka terminal di folder project ini:
   ```bash
   npm install
   ```
3. Jalankan server development:
   ```bash
   npm run dev
   ```
4. Buka browser dan akses:
   [http://localhost:3000](http://localhost:3000)

---

## 🌐 Cara Hosting ke Vercel

### Langkah 1: Push ke GitHub
Simpan seluruh perubahan ke repositori GitHub:
```bash
git add .
git commit -m "Deploy: Gudang Persediaan SIPERSEDIA Next.js"
git push origin main
```

### Langkah 2: Hubungkan ke Vercel
1. Buka [https://vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik tombol **"Add New..."** > **"Project"**.
3. Pilih repositori GitHub Anda (`gudang_barang` atau `gudang_persediaan`).
4. Pada konfigurasi framework, Vercel akan otomatis mendeteksi **Next.js**.
5. Klik **"Deploy"**.
6. Selesai! Web Anda akan online dengan domain `https://nama-project.vercel.app`.

---

## 📋 Fitur Utama SIPERSEDIA

1. **Dashboard Eksekutif**:
   - Statistik stok barang, transaksi masuk & keluar bulan berjalan.
   - Grafik pergerakan persediaan.
2. **Transaksi Masuk**:
   - Pencatatan barang masuk (Pembelian / Transfer Masuk dari Provinsi).
   - Penomoran otomatis BAST & Nota.
   - Cetak Bukti Penerimaan Barang resmi dengan Kop Surat BPS & tanda tangan Pengurus Barang.
3. **Pemakaian Barang (Transaksi Keluar)**:
   - Pencatatan pemakaian barang per tim kerja BPS (Kepala, Tim Umum, Statistik Sosial, Distribusi, Pertanian, IPDS, Nerwilis, PEK/KTIP).
   - Cetak Formulir Permintaan dan Pengeluaran Barang (FPPB) sesuai format resmi.
4. **Kartu Kendali Persediaan**:
   - Riwayat keluar-masuk per barang secara terperinci.
   - Perhitungan saldo fisik dan saldo nilai otomatis yang selalu balance.
   - Cetak Kartu Kendali per barang resmi.
5. **Laporan Persediaan & Berita Acara Rekapitulasi**:
   - Rekap saldo awal, penerimaan, pemakaian, dan saldo akhir.
   - Dilengkapi fungsi Edit dan Cetak Berita Acara Rekapitulasi resmi (Kop Surat, Pejabat BPS, Nip, Nomer Surat).
6. **Manajemen User & Multi-Role**:
   - Role Admin & Pegawai.
7. **Pengaturan & Manajemen Data**:
   - Kemudahan mengosongkan/reset database untuk memulai data baru.
   - Kemudahan memuat kembali Data Sampel Resmi BPS untuk pengujian.
