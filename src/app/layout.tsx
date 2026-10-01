import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIPERSEDIA — Sistem Informasi Persediaan Barang | BPS Kab. OKU Selatan',
  description: 'Sistem Informasi Persediaan Barang Badan Pusat Statistik Kabupaten Ogan Komering Ulu Selatan. Kelola inventaris, transaksi masuk/keluar, dan laporan persediaan bulanan.',
  keywords: ['BPS', 'persediaan', 'inventaris', 'OKU Selatan', 'gudang', 'barang'],
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
