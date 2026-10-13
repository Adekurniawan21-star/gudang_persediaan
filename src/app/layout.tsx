import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIMPAN OKUS — Sistem Informasi Manajemen Persediaan BPS Kab. OKU Selatan',
  description: 'SIMPAN OKUS (Sistem Informasi Manajemen Persediaan Ogan Komering Ulu Selatan) Badan Pusat Statistik Kabupaten Ogan Komering Ulu Selatan. Kelola inventaris persediaan, transaksi masuk/keluar, kartu kendali, dan laporan bulanan.',
  keywords: ['BPS', 'persediaan', 'gudang persediaan', 'SIMPAN OKUS', 'simpan okus', 'inventaris', 'OKU Selatan', 'Ogan Komering Ulu Selatan'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-dark-50 text-dark-800 antialiased">
        {children}
      </body>
    </html>
  );
}
