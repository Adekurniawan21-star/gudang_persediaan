// ==========================================
// Mock Data untuk Development
// Akan diganti dengan data Supabase saat production
// ==========================================

import type { Barang, TransaksiMasuk, TransaksiKeluar, DashboardStats, ChartDataPoint, User, KartuKendali } from '@/types';
import { DATA_REKAPITULASI_AGUSTUS } from './data-rekapitulasi-agustus';

export const mockCurrentUser: User = {
  id: 'admin-001',
  name: 'Admin Persediaan',
  nip: '199003142010011001',
  email: 'admin@bps-okus.go.id',
  role: 'admin',
  bidang: 'Subbagian Umum',
  avatar_url: null,
  is_active: true,
  created_at: '2026-01-01',
};

export const mockUsers: User[] = [
  mockCurrentUser,
  { id: 'usr-001', name: 'Ahmad Fauzi', nip: '199112052012011002', email: 'ahmad@bps-okus.go.id', role: 'user', bidang: 'Tim Statistik Sosial', avatar_url: null, is_active: true, created_at: '2026-01-15' },
  { id: 'usr-002', name: 'Siti Nurhaliza', nip: '199205182013012003', email: 'siti@bps-okus.go.id', role: 'user', bidang: 'Tim Pertanian', avatar_url: null, is_active: true, created_at: '2026-01-15' },
  { id: 'usr-003', name: 'Budi Santoso', nip: '199307252014011004', email: 'budi@bps-okus.go.id', role: 'user', bidang: 'Tim Statistik Distribusi', avatar_url: null, is_active: true, created_at: '2026-02-01' },
  { id: 'usr-004', name: 'Dewi Lestari', nip: '199408122015012005', email: 'dewi@bps-okus.go.id', role: 'user', bidang: 'Tim IPDS', avatar_url: null, is_active: true, created_at: '2026-02-01' },
  { id: 'usr-005', name: 'Riko Pratama', nip: '199510302016011006', email: 'riko@bps-okus.go.id', role: 'user', bidang: 'Tim Nerwilis', avatar_url: null, is_active: true, created_at: '2026-03-01' },
  { id: 'usr-006', name: 'Maya Anggraini', nip: '199601172017012007', email: 'maya@bps-okus.go.id', role: 'user', bidang: 'Subbagian Umum', avatar_url: null, is_active: true, created_at: '2026-03-01' },
  { id: 'usr-007', name: 'Hendra Wijaya', nip: '199703082018011008', email: 'hendra@bps-okus.go.id', role: 'user', bidang: 'Tim PEK dan KTIP', avatar_url: null, is_active: true, created_at: '2026-04-01' },
  { id: 'usr-008', name: 'Putri Rahayu', nip: '199809212019012009', email: 'putri@bps-okus.go.id', role: 'user', bidang: 'Kepala', avatar_url: null, is_active: false, created_at: '2026-04-01' },
];

export const SAMPLE_BARANG_BPS: Barang[] = [
  { id: 17, kode_barang: '000001', nama_barang: 'Stabillo', id_kategori: 1, id_satuan: 1, id_lokasi: 2, stok: 12, stok_minimum: 5, foto_url: null, deskripsi: 'Stabilo Highlighter Kuning/Hijau', created_at: '2025-01-01', updated_at: '2026-08-31',
    kategori: { id: 1, nama_kategori: 'Alat Tulis Kantor', deskripsi: null, created_at: '' },
    satuan: { id: 1, nama_satuan: 'Buah', created_at: '' },
    lokasi: { id: 2, nama_lokasi: 'Gudang ATK', deskripsi: null, created_at: '' },
  },
  { id: 2, kode_barang: '000018', nama_barang: 'Ballpoint', id_kategori: 1, id_satuan: 1, id_lokasi: 2, stok: 646, stok_minimum: 50, foto_url: null, deskripsi: 'Ballpoint Standard Hitam/Biru', created_at: '2025-01-01', updated_at: '2026-08-31',
    kategori: { id: 1, nama_kategori: 'Alat Tulis Kantor', deskripsi: null, created_at: '' },
    satuan: { id: 1, nama_satuan: 'Buah', created_at: '' },
    lokasi: { id: 2, nama_lokasi: 'Gudang ATK', deskripsi: null, created_at: '' },
  },
  { id: 5, kode_barang: '000019', nama_barang: 'Pensil 2B Faber Castel', id_kategori: 1, id_satuan: 4, id_lokasi: 2, stok: 7, stok_minimum: 5, foto_url: null, deskripsi: 'Pensil 2B Ujian', created_at: '2025-01-01', updated_at: '2026-08-31',
    kategori: { id: 1, nama_kategori: 'Alat Tulis Kantor', deskripsi: null, created_at: '' },
    satuan: { id: 4, nama_satuan: 'Kotak', created_at: '' },
    lokasi: { id: 2, nama_lokasi: 'Gudang ATK', deskripsi: null, created_at: '' },
  },
  { id: 11, kode_barang: '000026', nama_barang: 'Paper Klip', id_kategori: 1, id_satuan: 4, id_lokasi: 2, stok: 3, stok_minimum: 10, foto_url: null, deskripsi: 'Penjepit Kertas Klip No. 3', created_at: '2025-01-01', updated_at: '2026-08-31',
    kategori: { id: 1, nama_kategori: 'Alat Tulis Kantor', deskripsi: null, created_at: '' },
    satuan: { id: 4, nama_satuan: 'Kotak', created_at: '' },
    lokasi: { id: 2, nama_lokasi: 'Gudang ATK', deskripsi: null, created_at: '' },
  },
  { id: 20, kode_barang: '000005', nama_barang: 'Map Biola', id_kategori: 1, id_satuan: 1, id_lokasi: 2, stok: 13, stok_minimum: 20, foto_url: null, deskripsi: 'Map Kertas Folio Biola', created_at: '2025-01-01', updated_at: '2026-08-31',
    kategori: { id: 1, nama_kategori: 'Alat Tulis Kantor', deskripsi: null, created_at: '' },
    satuan: { id: 1, nama_satuan: 'Buah', created_at: '' },
    lokasi: { id: 2, nama_lokasi: 'Gudang ATK', deskripsi: null, created_at: '' },
  },
  { id: 22, kode_barang: '000025', nama_barang: 'Map BPS', id_kategori: 1, id_satuan: 1, id_lokasi: 2, stok: 371, stok_minimum: 50, foto_url: null, deskripsi: 'Map Resmi Berlogo BPS', created_at: '2025-01-01', updated_at: '2026-08-31',
    kategori: { id: 1, nama_kategori: 'Alat Tulis Kantor', deskripsi: null, created_at: '' },
    satuan: { id: 1, nama_satuan: 'Buah', created_at: '' },
    lokasi: { id: 2, nama_lokasi: 'Gudang ATK', deskripsi: null, created_at: '' },
  },
  { id: 1, kode_barang: '000004', nama_barang: 'KERTAS A4', id_kategori: 1, id_satuan: 2, id_lokasi: 2, stok: 9, stok_minimum: 10, foto_url: null, deskripsi: 'Kertas HVS Ukuran A4 70/80gsm', created_at: '2025-01-01', updated_at: '2026-08-31',
    kategori: { id: 1, nama_kategori: 'Alat Tulis Kantor', deskripsi: null, created_at: '' },
    satuan: { id: 2, nama_satuan: 'Rim', created_at: '' },
    lokasi: { id: 2, nama_lokasi: 'Gudang ATK', deskripsi: null, created_at: '' },
  },
  { id: 7, kode_barang: '000007', nama_barang: 'Joyko Gel Pen', id_kategori: 1, id_satuan: 4, id_lokasi: 2, stok: 4, stok_minimum: 3, foto_url: null, deskripsi: 'Pena Gel Joyko Hitam', created_at: '2025-01-01', updated_at: '2026-08-31',
    kategori: { id: 1, nama_kategori: 'Alat Tulis Kantor', deskripsi: null, created_at: '' },
    satuan: { id: 4, nama_satuan: 'Kotak', created_at: '' },
    lokasi: { id: 2, nama_lokasi: 'Gudang ATK', deskripsi: null, created_at: '' },
  },
  { id: 9, kode_barang: '000010', nama_barang: 'Pena Tizo Hitam', id_kategori: 1, id_satuan: 4, id_lokasi: 2, stok: 1, stok_minimum: 2, foto_url: null, deskripsi: 'Pena Tizo Tinta Hitam', created_at: '2025-01-01', updated_at: '2026-08-31',
    kategori: { id: 1, nama_kategori: 'Alat Tulis Kantor', deskripsi: null, created_at: '' },
    satuan: { id: 4, nama_satuan: 'Kotak', created_at: '' },
    lokasi: { id: 2, nama_lokasi: 'Gudang ATK', deskripsi: null, created_at: '' },
  },
  { id: 4, kode_barang: '000104', nama_barang: 'Toner HP Laserjet 89A Premmium', id_kategori: 2, id_satuan: 1, id_lokasi: 3, stok: 2, stok_minimum: 2, foto_url: null, deskripsi: 'Toner Printer HP LaserJet 89A', created_at: '2025-01-01', updated_at: '2026-08-31',
    kategori: { id: 2, nama_kategori: 'Peralatan Komputer', deskripsi: null, created_at: '' },
    satuan: { id: 1, nama_satuan: 'Pcs', created_at: '' },
    lokasi: { id: 3, nama_lokasi: 'Rak Server', deskripsi: null, created_at: '' },
  },
  { id: 81, kode_barang: '000367', nama_barang: 'Rompi SE2026', id_kategori: 5, id_satuan: 1, id_lokasi: 1, stok: 0, stok_minimum: 0, foto_url: null, deskripsi: 'Rompi Petugas Lapangan Sensus Ekonomi 2026', created_at: '2026-01-10', updated_at: '2026-08-31',
    kategori: { id: 5, nama_kategori: 'Perlengkapan Lapangan', deskripsi: null, created_at: '' },
    satuan: { id: 1, nama_satuan: 'Buah', created_at: '' },
    lokasi: { id: 1, nama_lokasi: 'Gudang Utama', deskripsi: null, created_at: '' },
  },
];

// Gabungan 81 Item Resmi BPS Berdasarkan Rekapitulasi Fisik Agustus 2026
export const ALL_81_BARANG_BPS: Barang[] = DATA_REKAPITULASI_AGUSTUS.map((item) => {
  const existing = SAMPLE_BARANG_BPS.find(s => 
    s.id === item.no || 
    s.nama_barang.toLowerCase() === item.uraian_barang.toLowerCase()
  );
  if (existing) {
    return {
      ...existing,
      stok: item.total_persediaan,
    };
  }

  const lower = item.uraian_barang.toLowerCase();
  let idKat = 1;
  let namaKat = 'Alat Tulis Kantor';
  if (lower.includes('toner') || lower.includes('tinta') || lower.includes('kabel') || lower.includes('flash disk') || lower.includes('memori') || lower.includes('lampu') || lower.includes('baterai') || lower.includes('maintenance')) {
    idKat = 2;
    namaKat = 'Peralatan Komputer / Elektronik';
  } else if (lower.includes('rompi') || lower.includes('plastik dokumen') || lower.includes('kotak arsip')) {
    idKat = 5;
    namaKat = 'Perlengkapan Lapangan & Arsip';
  }

  return {
    id: item.no,
    kode_barang: String(item.no).padStart(6, '0'),
    nama_barang: item.uraian_barang,
    id_kategori: idKat,
    id_satuan: 1,
    id_lokasi: 2,
    stok: item.total_persediaan,
    stok_minimum: 5,
    foto_url: null,
    deskripsi: `Persediaan resmi BPS: ${item.uraian_barang}`,
    created_at: '2025-01-01',
    updated_at: '2026-08-31',
    kategori: { id: idKat, nama_kategori: namaKat, deskripsi: null, created_at: '' },
    satuan: { id: 1, nama_satuan: item.satuan, created_at: '' },
    lokasi: { id: 2, nama_lokasi: 'Gudang ATK', deskripsi: null, created_at: '' },
  };
});

// Data Barang Resmi BPS Aktif (81 Item Lengkap)
export const mockBarang: Barang[] = ALL_81_BARANG_BPS;

// Data Contoh Transaksi Masuk — per No. Dokumen (Master-Detail)
export const SAMPLE_TRANSAKSI_MASUK: TransaksiMasuk[] = [
  {
    id: 1,
    no_dokumen: 'BM-2026/09/001',
    tanggal: '2026-09-28',
    sumber: 'Pembelian',
    no_referensi: 'NOTA/2026/09/001',
    items: [
      { id_barang: 1, jumlah: 50, harga_satuan: 45000, keterangan: 'Pengadaan Q3', barang: SAMPLE_BARANG_BPS[0] },
      { id_barang: 2, jumlah: 10, harga_satuan: 30000, keterangan: null, barang: SAMPLE_BARANG_BPS[1] },
    ],
    keterangan: 'Pengadaan ATK Triwulan 3',
    created_by: 'admin-001',
    created_at: '2026-09-28',
  },
  {
    id: 2,
    no_dokumen: 'BM-2026/09/002',
    tanggal: '2026-09-27',
    sumber: 'Pembelian',
    no_referensi: 'NOTA/2026/09/002',
    items: [
      { id_barang: 6, jumlah: 12, harga_satuan: 35000, keterangan: null, barang: SAMPLE_BARANG_BPS[5] },
      { id_barang: 7, jumlah: 6, harga_satuan: 25000, keterangan: null, barang: SAMPLE_BARANG_BPS[6] },
    ],
    keterangan: null,
    created_by: 'admin-001',
    created_at: '2026-09-27',
  },
  {
    id: 3,
    no_dokumen: 'BM-2026/09/003',
    tanggal: '2026-09-25',
    sumber: 'Pembelian',
    no_referensi: 'NOTA/2026/09/003',
    items: [
      { id_barang: 4, jumlah: 5, harga_satuan: 850000, keterangan: 'Toner printer lantai 2', barang: SAMPLE_BARANG_BPS[3] },
    ],
    keterangan: 'Pengadaan toner printer',
    created_by: 'admin-001',
    created_at: '2026-09-25',
  },
  {
    id: 4,
    no_dokumen: 'BM-2026/08/001',
    tanggal: '2026-08-15',
    sumber: 'Transfer Masuk',
    no_referensi: 'BAST/BPS-SUMSEL/128/VIII/2026',
    items: [
      { id_barang: 2, jumlah: 20, harga_satuan: 30000, keterangan: null, barang: SAMPLE_BARANG_BPS[1] },
      { id_barang: 3, jumlah: 30, harga_satuan: 5000, keterangan: null, barang: SAMPLE_BARANG_BPS[2] },
    ],
    keterangan: 'Transfer dari BPS Provinsi Sumatera Selatan',
    created_by: 'admin-001',
    created_at: '2026-08-15',
  },
  {
    id: 5,
    no_dokumen: 'BM-2026/08/002',
    tanggal: '2026-08-10',
    sumber: 'Transfer Masuk',
    no_referensi: 'BAST/BPS-SUMSEL/115/VIII/2026',
    items: [
      { id_barang: 8, jumlah: 24, harga_satuan: 15000, keterangan: 'Buku registrasi', barang: SAMPLE_BARANG_BPS[7] },
    ],
    keterangan: 'Transfer dari BPS Provinsi',
    created_by: 'admin-001',
    created_at: '2026-08-10',
  },
];

// Default Data Transaksi Masuk Bersih (Kosong)
export const mockTransaksiMasuk: TransaksiMasuk[] = [];

// Data Contoh Transaksi Keluar / Pemakaian Barang
export const SAMPLE_TRANSAKSI_KELUAR: TransaksiKeluar[] = [
  // --- Transaksi Resmi Bulan Agustus 2026 (Sesuai Rekapitulasi & BA Mbak Guspita Karleni) ---
  {
    id: 101,
    no_dokumen: 'BK-2026/08/001',
    tanggal: '2026-08-25',
    tim_pemohon: 'tim-sosial',
    nama_tim: 'Tim Statistik Sosial',
    penanggung_jawab: 'FATONAH AMINI, S.Tr.Stat.',
    nip_pj: '19990317 202104 2001',
    items: [
      { id_barang: 5, jumlah: 3, keterangan: 'Kegiatan Sakernas & Susenas', barang: SAMPLE_BARANG_BPS.find(b => b.id === 5) },
      { id_barang: 7, jumlah: 1, keterangan: 'Kegiatan Susenas', barang: SAMPLE_BARANG_BPS.find(b => b.id === 7) },
      { id_barang: 9, jumlah: 1, keterangan: 'Operasional Lapangan', barang: SAMPLE_BARANG_BPS.find(b => b.id === 9) },
      { id_barang: 17, jumlah: 1, keterangan: 'Editing Coding Dokumen Susenas', barang: SAMPLE_BARANG_BPS.find(b => b.id === 17) },
      { id_barang: 20, jumlah: 80, keterangan: 'Pengarsipan Kuesioner Susenas', barang: SAMPLE_BARANG_BPS.find(b => b.id === 20) },
      { id_barang: 22, jumlah: 40, keterangan: 'Distribusi Petugas Lapangan Susenas', barang: SAMPLE_BARANG_BPS.find(b => b.id === 22) },
      { id_barang: 81, jumlah: 23, keterangan: 'Alokasi PCL & PML Sensus', barang: SAMPLE_BARANG_BPS.find(b => b.id === 81) },
    ],
    keterangan: 'Kebutuhan ATK Pelaksanaan Sakernas dan Susenas SE 2026',
    created_by: 'usr-001',
    created_at: '2026-08-25',
  },
  {
    id: 102,
    no_dokumen: 'BK-2026/08/002',
    tanggal: '2026-08-27',
    tim_pemohon: 'tim-umum',
    nama_tim: 'Subbagian Umum',
    penanggung_jawab: 'SURYA WAGITO, SST',
    nip_pj: '19910814 201412 1001',
    items: [
      { id_barang: 11, jumlah: 20, keterangan: 'Kearsipan Subbagian Umum', barang: SAMPLE_BARANG_BPS.find(b => b.id === 11) },
      { id_barang: 17, jumlah: 1, keterangan: 'Operasional Surat Dinas', barang: SAMPLE_BARANG_BPS.find(b => b.id === 17) },
      { id_barang: 20, jumlah: 7, keterangan: 'Penataan Berkas Arsip BPS', barang: SAMPLE_BARANG_BPS.find(b => b.id === 20) },
      { id_barang: 22, jumlah: 7, keterangan: 'Administrasi Umum', barang: SAMPLE_BARANG_BPS.find(b => b.id === 22) },
    ],
    keterangan: 'Pengarsipan SPJ dan dokumen dinas rutin',
    created_by: 'usr-006',
    created_at: '2026-08-27',
  },
  {
    id: 103,
    no_dokumen: 'BK-2026/08/003',
    tanggal: '2026-08-28',
    tim_pemohon: 'tim-distribusi',
    nama_tim: 'Tim Statistik Distribusi',
    penanggung_jawab: 'USWAR M. ALGHIFARI A.P, S.Tr.Stat.',
    nip_pj: '19980512 202012 1002',
    items: [
      { id_barang: 11, jumlah: 10, keterangan: 'Survei Perdagangan & Hotel', barang: SAMPLE_BARANG_BPS.find(b => b.id === 11) },
      { id_barang: 17, jumlah: 1, keterangan: 'Pemeriksaan Dokumen VHT', barang: SAMPLE_BARANG_BPS.find(b => b.id === 17) },
      { id_barang: 20, jumlah: 15, keterangan: 'Penyimpanan Kuesioner Distribusi', barang: SAMPLE_BARANG_BPS.find(b => b.id === 20) },
      { id_barang: 22, jumlah: 10, keterangan: 'Survei Pariwisata & Transportasi', barang: SAMPLE_BARANG_BPS.find(b => b.id === 22) },
    ],
    keterangan: 'Perlengkapan survei statistik distribusi',
    created_by: 'usr-003',
    created_at: '2026-08-28',
  },
  {
    id: 104,
    no_dokumen: 'BK-2026/08/004',
    tanggal: '2026-08-29',
    tim_pemohon: 'tim-nerwilis',
    nama_tim: 'Tim Neraca (Nerwilis)',
    penanggung_jawab: 'NURLATIFAH KHOIRUN NISSA, S.Tr.Stat.',
    nip_pj: '19970823 201912 2001',
    items: [
      { id_barang: 22, jumlah: 5, keterangan: 'Penyusunan Publikasi PDRB', barang: SAMPLE_BARANG_BPS.find(b => b.id === 22) },
    ],
    keterangan: 'Penyusunan Publikasi PDRB Triwulanan',
    created_by: 'usr-005',
    created_at: '2026-08-29',
  },
  // --- Transaksi Bulan September 2026 ---
  {
    id: 1,
    no_dokumen: 'BK-2026/09/001',
    tanggal: '2026-09-29',
    tim_pemohon: 'tim-sosial',
    nama_tim: 'Tim Statistik Sosial',
    penanggung_jawab: 'FATONAH AMINI, S.Tr.Stat.',
    nip_pj: '19990317 202104 2001',
    items: [
      { id_barang: 1, jumlah: 1, keterangan: 'Kebutuhan cetak laporan Susenas', barang: SAMPLE_BARANG_BPS.find(b => b.id === 1) },
      { id_barang: 2, jumlah: 2, keterangan: 'Operasional PCL', barang: SAMPLE_BARANG_BPS.find(b => b.id === 2) },
    ],
    keterangan: 'Kebutuhan operasional Susenas',
    created_by: 'usr-001',
    created_at: '2026-09-29',
  },
  {
    id: 2,
    no_dokumen: 'BK-2026/09/002',
    tanggal: '2026-09-28',
    tim_pemohon: 'tim-ipds',
    nama_tim: 'Tim IPDS',
    penanggung_jawab: 'DANU ABDI SAPUTRA, S.Tr.Stat.',
    nip_pj: '20000626 202201 1005',
    items: [
      { id_barang: 2, jumlah: 3, keterangan: 'Entri Data', barang: SAMPLE_BARANG_BPS.find(b => b.id === 2) },
      { id_barang: 4, jumlah: 1, keterangan: 'Toner printer ruang IPDS', barang: SAMPLE_BARANG_BPS.find(b => b.id === 4) },
    ],
    keterangan: 'Operasional Tim IPDS',
    created_by: 'usr-004',
    created_at: '2026-09-28',
  },
  {
    id: 3,
    no_dokumen: 'BK-2026/09/003',
    tanggal: '2026-09-30',
    tim_pemohon: 'tim-pertanian',
    nama_tim: 'Tim Pertanian & Kehutanan',
    penanggung_jawab: 'HERA YUDHO KARTIKO, SP',
    nip_pj: '19861024 201003 1002',
    items: [
      { id_barang: 4, jumlah: 1, keterangan: 'Toner printer cetak dokumen Ubinan', barang: SAMPLE_BARANG_BPS.find(b => b.id === 4) },
    ],
    keterangan: 'Operasional Tim Pertanian',
    created_by: 'usr-002',
    created_at: '2026-09-30',
  },
  {
    id: 4,
    no_dokumen: 'BK-2026/09/004',
    tanggal: '2026-09-30',
    tim_pemohon: 'tim-umum',
    nama_tim: 'Subbagian Umum',
    penanggung_jawab: 'SURYA WAGITO, SST',
    nip_pj: '19910814 201412 1001',
    items: [
      { id_barang: 1, jumlah: 1, keterangan: 'Kebutuhan dokumen operasional', barang: SAMPLE_BARANG_BPS.find(b => b.id === 1) },
    ],
    keterangan: 'Kebutuhan umum kantor',
    created_by: 'usr-006',
    created_at: '2026-09-30',
  },
];

// Default Data Transaksi Keluar Bersih (Kosong)
export const mockTransaksiKeluar: TransaksiKeluar[] = [];

export const mockDashboardStats: DashboardStats = {
  totalBarang: 0,
  totalStokRendah: 0,
  totalTransaksiMasukBulanIni: 0,
  totalTransaksiKeluarBulanIni: 0,
  totalNilaiPersediaan: 0,
  pendingRequests: 0,
};

export const mockChartData: ChartDataPoint[] = [
  { bulan: 'Apr', masuk: 0, keluar: 0 },
  { bulan: 'Mei', masuk: 0, keluar: 0 },
  { bulan: 'Jun', masuk: 0, keluar: 0 },
  { bulan: 'Jul', masuk: 0, keluar: 0 },
  { bulan: 'Agt', masuk: 0, keluar: 0 },
  { bulan: 'Sep', masuk: 0, keluar: 0 },
];

// ==========================================
// Data Contoh Kartu Kendali Persediaan — Persis Format Excel PDF 1 Hal 3
// ==========================================
export const SAMPLE_KARTU_KENDALI: KartuKendali[] = [
  // 1. STABILLO (Persis Dokumen Excel PDF 1 Halaman 3)
  {
    id_barang: 17,
    kode_barang: '000001',
    nama_barang: 'Stabillo',
    satuan: 'Buah',
    tahun: 2025,
    proyek_rutin: 'Rutin',
    halaman: 1,
    stock_awal_tahun: 18,
    pengeluaran_bulanan: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 },
    entries: [
      { id: 1, tanggal: '2025-01-02', no_referensi: '-', uraian: 'Saldo 1 Januari', masuk: 18, keluar: 0, sisa: 18 },
    ],
  },
  // 2. BALLPOINT (Kode: 000018 Sesuai PDF 1 & PDF 2)
  {
    id_barang: 2,
    kode_barang: '000018',
    nama_barang: 'Ballpoint',
    satuan: 'Buah',
    tahun: 2026,
    proyek_rutin: 'Rutin',
    halaman: 1,
    stock_awal_tahun: 1080,
    pengeluaran_bulanan: { 1: 11, 2: 11, 3: 11, 4: 11, 5: 26, 6: 182, 7: 182, 8: 0, 9: 2, 10: 0, 11: 0, 12: 0 },
    entries: [
      { id: 1, tanggal: '2026-01-02', no_referensi: 'BA-OPN/12/2025', uraian: 'Saldo 31 Desember 2025', masuk: 1080, keluar: 0, sisa: 1080 },
      { id: 2, tanggal: '2026-01-20', no_referensi: 'BK-2026/01/001', uraian: 'Pengeluaran Januari (Operasional Kantor)', masuk: 0, keluar: 11, sisa: 1069 },
      { id: 3, tanggal: '2026-02-25', no_referensi: 'BK-2026/02/001', uraian: 'Pengeluaran Februari', masuk: 0, keluar: 11, sisa: 1058 },
      { id: 4, tanggal: '2026-03-20', no_referensi: 'BK-2026/03/001', uraian: 'Pengeluaran Maret', masuk: 0, keluar: 11, sisa: 1047 },
      { id: 5, tanggal: '2026-04-20', no_referensi: 'BK-2026/04/001', uraian: 'Pengeluaran April', masuk: 0, keluar: 11, sisa: 1036 },
      { id: 6, tanggal: '2026-05-25', no_referensi: 'BK-2026/05/001', uraian: 'Pengeluaran Mei (Persiapan Sensus)', masuk: 0, keluar: 26, sisa: 1010 },
      { id: 7, tanggal: '2026-06-25', no_referensi: 'BK-2026/06/001', uraian: 'Pengeluaran Juni (Pelaksanaan Sensus)', masuk: 0, keluar: 182, sisa: 828 },
      { id: 8, tanggal: '2026-07-28', no_referensi: 'BK-2026/07/001', uraian: 'Pengeluaran Juli (Petugas Lapangan)', masuk: 0, keluar: 182, sisa: 646 },
      { id: 9, tanggal: '2026-09-29', no_referensi: 'BK-2026/09/001', uraian: 'Pemakaian Tim Statistik Sosial', masuk: 0, keluar: 2, sisa: 644 },
    ],
  },
  // 3. PENSIL 2B FABER CASTEL (Kode: 000019)
  {
    id_barang: 5,
    kode_barang: '000019',
    nama_barang: 'Pensil 2B Faber Castel',
    satuan: 'Kotak',
    tahun: 2026,
    proyek_rutin: 'Rutin',
    halaman: 1,
    stock_awal_tahun: 17,
    pengeluaran_bulanan: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 3, 6: 2, 7: 2, 8: 3, 9: 0, 10: 0, 11: 0, 12: 0 },
    entries: [
      { id: 1, tanggal: '2026-01-02', no_referensi: 'BA-OPN/12/2025', uraian: 'Saldo 31 Desember 2025', masuk: 17, keluar: 0, sisa: 17 },
      { id: 2, tanggal: '2026-05-15', no_referensi: 'BK-2026/05/002', uraian: 'Pengeluaran Mei', masuk: 0, keluar: 3, sisa: 14 },
      { id: 3, tanggal: '2026-06-20', no_referensi: 'BK-2026/06/002', uraian: 'Pengeluaran Juni', masuk: 0, keluar: 2, sisa: 12 },
      { id: 4, tanggal: '2026-07-15', no_referensi: 'BK-2026/07/002', uraian: 'Pengeluaran Juli', masuk: 0, keluar: 2, sisa: 10 },
      { id: 5, tanggal: '2026-08-25', no_referensi: 'BK-2026/08/001', uraian: 'Permintaan Tim Statistik Sosial (Sakernas/Susenas)', masuk: 0, keluar: 3, sisa: 7 },
    ],
  },
  // 4. PAPER KLIP (Kode: 000026)
  {
    id_barang: 11,
    kode_barang: '000026',
    nama_barang: 'Paper Klip',
    satuan: 'Kotak',
    tahun: 2026,
    proyek_rutin: 'Rutin',
    halaman: 1,
    stock_awal_tahun: 29,
    pengeluaran_bulanan: { 1: 0, 2: 1, 3: 1, 4: 5, 5: 0, 6: 17, 7: 20, 8: 30, 9: 0, 10: 0, 11: 0, 12: 0 },
    entries: [
      { id: 1, tanggal: '2026-01-02', no_referensi: 'BA-OPN/12/2025', uraian: 'Saldo 31 Desember 2025', masuk: 29, keluar: 0, sisa: 29 },
      { id: 2, tanggal: '2026-02-15', no_referensi: 'BK-2026/02/003', uraian: 'Pengeluaran Februari', masuk: 0, keluar: 1, sisa: 28 },
      { id: 3, tanggal: '2026-03-12', no_referensi: 'BK-2026/03/002', uraian: 'Pengeluaran Maret', masuk: 0, keluar: 1, sisa: 27 },
      { id: 4, tanggal: '2026-04-18', no_referensi: 'BK-2026/04/003', uraian: 'Pengeluaran April', masuk: 0, keluar: 5, sisa: 22 },
      { id: 5, tanggal: '2026-06-10', no_referensi: 'BAST/006/VI/2026', uraian: 'Pembelian Pengadaan Juni', masuk: 48, keluar: 0, sisa: 70 },
      { id: 6, tanggal: '2026-06-25', no_referensi: 'BK-2026/06/003', uraian: 'Pengeluaran Juni', masuk: 0, keluar: 17, sisa: 53 },
      { id: 7, tanggal: '2026-07-20', no_referensi: 'BK-2026/07/003', uraian: 'Pengeluaran Juli', masuk: 0, keluar: 20, sisa: 33 },
      { id: 8, tanggal: '2026-08-27', no_referensi: 'BK-2026/08/002', uraian: 'Permintaan Subbagian Umum (Kearsipan)', masuk: 0, keluar: 20, sisa: 13 },
      { id: 9, tanggal: '2026-08-28', no_referensi: 'BK-2026/08/003', uraian: 'Permintaan Tim Distribusi (Survei)', masuk: 0, keluar: 10, sisa: 3 },
    ],
  },
  // 5. MAP BIOLA (Kode: 000005)
  {
    id_barang: 20,
    kode_barang: '000005',
    nama_barang: 'Map Biola',
    satuan: 'Buah',
    tahun: 2026,
    proyek_rutin: 'Rutin',
    halaman: 1,
    stock_awal_tahun: 140,
    pengeluaran_bulanan: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 25, 7: 0, 8: 102, 9: 0, 10: 0, 11: 0, 12: 0 },
    entries: [
      { id: 1, tanggal: '2026-01-02', no_referensi: 'BA-OPN/12/2025', uraian: 'Saldo 31 Desember 2025', masuk: 140, keluar: 0, sisa: 140 },
      { id: 2, tanggal: '2026-06-25', no_referensi: 'BK-2026/06/004', uraian: 'Pengeluaran Juni', masuk: 0, keluar: 25, sisa: 115 },
      { id: 3, tanggal: '2026-08-25', no_referensi: 'BK-2026/08/001', uraian: 'Permintaan Tim Sosial (80 buah)', masuk: 0, keluar: 80, sisa: 35 },
      { id: 4, tanggal: '2026-08-27', no_referensi: 'BK-2026/08/002', uraian: 'Permintaan Subbagian Umum (7 buah)', masuk: 0, keluar: 7, sisa: 28 },
      { id: 5, tanggal: '2026-08-28', no_referensi: 'BK-2026/08/003', uraian: 'Permintaan Tim Distribusi (15 buah)', masuk: 0, keluar: 15, sisa: 13 },
    ],
  },
  // 6. MAP BPS (Kode: 000025)
  {
    id_barang: 22,
    kode_barang: '000025',
    nama_barang: 'Map BPS',
    satuan: 'Buah',
    tahun: 2026,
    proyek_rutin: 'Rutin',
    halaman: 1,
    stock_awal_tahun: 522,
    pengeluaran_bulanan: { 1: 7, 2: 7, 3: 8, 4: 0, 5: 0, 6: 36, 7: 25, 8: 74, 9: 0, 10: 0, 11: 0, 12: 0 },
    entries: [
      { id: 1, tanggal: '2026-01-02', no_referensi: 'BA-OPN/12/2025', uraian: 'Saldo 31 Desember 2025', masuk: 522, keluar: 0, sisa: 522 },
      { id: 2, tanggal: '2026-01-25', no_referensi: 'BK-2026/01/004', uraian: 'Pengeluaran Januari', masuk: 0, keluar: 7, sisa: 515 },
      { id: 3, tanggal: '2026-02-25', no_referensi: 'BK-2026/02/004', uraian: 'Pengeluaran Februari', masuk: 0, keluar: 7, sisa: 508 },
      { id: 4, tanggal: '2026-03-25', no_referensi: 'BK-2026/03/004', uraian: 'Pengeluaran Maret', masuk: 0, keluar: 8, sisa: 500 },
      { id: 5, tanggal: '2026-06-25', no_referensi: 'BK-2026/06/005', uraian: 'Pengeluaran Juni', masuk: 0, keluar: 36, sisa: 464 },
      { id: 6, tanggal: '2026-07-25', no_referensi: 'BK-2026/07/005', uraian: 'Pengeluaran Juli', masuk: 0, keluar: 19, sisa: 445 },
      { id: 7, tanggal: '2026-08-25', no_referensi: 'BK-2026/08/001', uraian: 'Permintaan Tim Statistik Sosial (40 buah)', masuk: 0, keluar: 40, sisa: 405 },
      { id: 8, tanggal: '2026-08-27', no_referensi: 'BK-2026/08/002', uraian: 'Permintaan Subbagian Umum (7 buah)', masuk: 0, keluar: 7, sisa: 398 },
      { id: 9, tanggal: '2026-08-28', no_referensi: 'BK-2026/08/003', uraian: 'Permintaan Tim Distribusi (10 buah)', masuk: 0, keluar: 10, sisa: 388 },
      { id: 10, tanggal: '2026-08-29', no_referensi: 'BK-2026/08/004', uraian: 'Permintaan Tim Neraca (5 buah)', masuk: 0, keluar: 5, sisa: 383 },
      { id: 11, tanggal: '2026-08-30', no_referensi: 'BK-2026/08/005', uraian: 'Permintaan Tim Lainnya (IPDS 3, Pertanian 4, PEK 5)', masuk: 0, keluar: 12, sisa: 371 },
    ],
  },
  // 7. KERTAS A4 (Kode: 000004)
  {
    id_barang: 1,
    kode_barang: '000004',
    nama_barang: 'KERTAS A4',
    satuan: 'Rim',
    tahun: 2026,
    proyek_rutin: 'Rutin',
    halaman: 1,
    stock_awal_tahun: 32,
    pengeluaran_bulanan: { 1: 6, 2: 7, 3: 7, 4: 11, 5: 7, 6: 0, 7: 10, 8: 1, 9: 2, 10: 0, 11: 0, 12: 0 },
    entries: [
      { id: 1, tanggal: '2026-01-02', no_referensi: 'BA-OPN/12/2025', uraian: 'Saldo 31 Desember 2025', masuk: 32, keluar: 0, sisa: 32 },
      { id: 2, tanggal: '2026-01-20', no_referensi: 'BK-2026/01/005', uraian: 'Pengeluaran Januari', masuk: 0, keluar: 6, sisa: 26 },
      { id: 3, tanggal: '2026-02-20', no_referensi: 'BK-2026/02/005', uraian: 'Pengeluaran Februari', masuk: 0, keluar: 7, sisa: 19 },
      { id: 4, tanggal: '2026-03-20', no_referensi: 'BK-2026/03/005', uraian: 'Pengeluaran Maret', masuk: 0, keluar: 7, sisa: 12 },
      { id: 5, tanggal: '2026-04-20', no_referensi: 'BK-2026/04/005', uraian: 'Pengeluaran April', masuk: 0, keluar: 11, sisa: 1 },
      { id: 6, tanggal: '2026-05-10', no_referensi: 'BAST/005/V/2026', uraian: 'Pembelian Mei', masuk: 17, keluar: 0, sisa: 18 },
      { id: 7, tanggal: '2026-05-25', no_referensi: 'BK-2026/05/005', uraian: 'Pengeluaran Mei', masuk: 0, keluar: 7, sisa: 11 },
      { id: 8, tanggal: '2026-07-25', no_referensi: 'BK-2026/07/006', uraian: 'Pengeluaran Juli', masuk: 0, keluar: 1, sisa: 10 },
      { id: 9, tanggal: '2026-08-25', no_referensi: 'BK-2026/08/006', uraian: 'Permintaan Kegiatan Sakernas', masuk: 0, keluar: 1, sisa: 9 },
    ],
  },
];

// Default Data Kartu Kendali Bersih (Kosong)
export const mockKartuKendali: KartuKendali[] = [];
