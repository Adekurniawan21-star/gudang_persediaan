import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIPERSEDIA — Gudang Persediaan BPS Kab. OKU Selatan',
  description: 'Sistem Informasi Gudang Persediaan Badan Pusat Statistik Kabupaten Ogan Komering Ulu Selatan. Kelola inventaris persediaan, transaksi masuk/keluar, kartu kendali, dan laporan bulanan.',
  keywords: ['BPS', 'persediaan', 'gudang persediaan', 'sipersedia', 'inventaris', 'OKU Selatan'],
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
