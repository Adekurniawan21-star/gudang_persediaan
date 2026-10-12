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
  // 1. Kategori: Alat Tulis Kantor (1) | Satuan: Buah (1) | Lokasi: Gudang ATK (2)
  {
    id: 1,
    kode_barang: '000001',
    nama_barang: 'Stabillo',
    id_kategori: 1,
    id_satuan: 1,
    id_lokasi: 2,
    stok: 18,
    stok_minimum: 5,
    foto_url: null,
    deskripsi: 'Stabilo Highlighter Kuning/Hijau',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
    kategori: { id: 1, nama_kategori: 'Alat Tulis Kantor', deskripsi: 'Perlengkapan tulis perkantoran', created_at: '' },
    satuan: { id: 1, nama_satuan: 'Buah', created_at: '' },
    lokasi: { id: 2, nama_lokasi: 'Gudang ATK', deskripsi: 'Ruang penyimpanan khusus alat tulis kantor', created_at: '' },
  },
  // 2. Kategori: Alat Tulis Kantor (1) | Satuan: Rim (2) | Lokasi: Gudang ATK (2)
  {
    id: 2,
    kode_barang: '000004',
    nama_barang: 'Kertas HVS A4 80gr',
    id_kategori: 1,
    id_satuan: 2,
    id_lokasi: 2,
    stok: 25,
    stok_minimum: 10,
    foto_url: null,
    deskripsi: 'Kertas HVS Ukuran A4 80gr PaperOne',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
    kategori: { id: 1, nama_kategori: 'Alat Tulis Kantor', deskripsi: 'Perlengkapan tulis perkantoran', created_at: '' },
    satuan: { id: 2, nama_satuan: 'Rim', created_at: '' },
    lokasi: { id: 2, nama_lokasi: 'Gudang ATK', deskripsi: 'Ruang penyimpanan khusus alat tulis kantor', created_at: '' },
  },
  // 3. Kategori: Alat Tulis Kantor (1) | Satuan: Kotak (11) | Lokasi: Gudang ATK (2)
  {
    id: 3,
    kode_barang: '000018',
    nama_barang: 'Ballpoint Standard',
    id_kategori: 1,
    id_satuan: 11,
    id_lokasi: 2,
    stok: 50,
    stok_minimum: 10,
    foto_url: null,
    deskripsi: 'Ballpoint Standard Hitam 0.5mm',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
    kategori: { id: 1, nama_kategori: 'Alat Tulis Kantor', deskripsi: 'Perlengkapan tulis perkantoran', created_at: '' },
    satuan: { id: 11, nama_satuan: 'Kotak', created_at: '' },
    lokasi: { id: 2, nama_lokasi: 'Gudang ATK', deskripsi: 'Ruang penyimpanan khusus alat tulis kantor', created_at: '' },
  },
  // 4. Kategori: Peralatan Komputer (2) | Satuan: Unit (7) | Lokasi: Rak Server (3)
  {
    id: 4,
    kode_barang: '000104',
    nama_barang: 'Toner HP Laserjet 89A',
    id_kategori: 2,
    id_satuan: 7,
    id_lokasi: 3,
    stok: 5,
    stok_minimum: 2,
    foto_url: null,
    deskripsi: 'Toner Cartridge HP LaserJet 89A Black',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
    kategori: { id: 2, nama_kategori: 'Peralatan Komputer', deskripsi: 'Perangkat keras dan aksesoris komputer', created_at: '' },
    satuan: { id: 7, nama_satuan: 'Unit', created_at: '' },
    lokasi: { id: 3, nama_lokasi: 'Rak Server', deskripsi: 'Tempat penyimpanan peralatan IT', created_at: '' },
  },
  // 5. Kategori: Perlengkapan Cetakan (5) | Satuan: Lusin (3) | Lokasi: Ruang Arsip (4)
  {
    id: 5,
    kode_barang: '000005',
    nama_barang: 'Map Snelhecter Biola',
    id_kategori: 5,
    id_satuan: 3,
    id_lokasi: 4,
    stok: 12,
    stok_minimum: 5,
    foto_url: null,
    deskripsi: 'Map Kertas Snelhecter Biola Warna Hijau',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
    kategori: { id: 5, nama_kategori: 'Perlengkapan Cetakan', deskripsi: 'Formulir, buku, dan cetakan', created_at: '' },
    satuan: { id: 3, nama_satuan: 'Lusin', created_at: '' },
    lokasi: { id: 4, nama_lokasi: 'Ruang Arsip', deskripsi: 'Ruang penyimpanan dokumen dan cetakan', created_at: '' },
  },
  // 6. Kategori: Perlengkapan Lapangan (6) | Satuan: Buah (1) | Lokasi: Gudang Utama (1)
  {
    id: 6,
    kode_barang: '000367',
    nama_barang: 'Rompi Petugas SE2026',
    id_kategori: 6,
    id_satuan: 1,
    id_lokasi: 1,
    stok: 30,
    stok_minimum: 5,
    foto_url: null,
    deskripsi: 'Rompi Identitas Petugas Lapangan Sensus Ekonomi 2026',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
    kategori: { id: 6, nama_kategori: 'Perlengkapan Lapangan', deskripsi: 'Perlengkapan sensus & survei lapangan', created_at: '' },
    satuan: { id: 1, nama_satuan: 'Buah', created_at: '' },
    lokasi: { id: 1, nama_lokasi: 'Gudang Utama', deskripsi: 'Ruang penyimpanan utama lantai 1', created_at: '' },
  },
];

// Perwakilan 6 Item Bersih
export const ALL_81_BARANG_BPS: Barang[] = SAMPLE_BARANG_BPS;

// Data Barang Aktif
export const mockBarang: Barang[] = SAMPLE_BARANG_BPS;

// Data Contoh Transaksi Masuk Bersih (Kosong)
export const SAMPLE_TRANSAKSI_MASUK: TransaksiMasuk[] = [];
export const mockTransaksiMasuk: TransaksiMasuk[] = [];

// Data Transaksi Keluar Bersih (Kosong untuk Pengujian)
export const SAMPLE_TRANSAKSI_KELUAR: TransaksiKeluar[] = [];
export const mockTransaksiKeluar: TransaksiKeluar[] = [];

export const mockDashboardStats: DashboardStats = {
  totalBarang: 6,
  totalStokRendah: 0,
  totalTransaksiMasukBulanIni: 0,
  totalTransaksiKeluarBulanIni: 0,
  totalNilaiPersediaan: 0,
  pendingRequests: 0,
};

export const mockChartData: ChartDataPoint[] = [
  { bulan: 'Mei', masuk: 0, keluar: 0 },
  { bulan: 'Jun', masuk: 0, keluar: 0 },
  { bulan: 'Jul', masuk: 0, keluar: 0 },
  { bulan: 'Agt', masuk: 0, keluar: 0 },
  { bulan: 'Sep', masuk: 0, keluar: 0 },
  { bulan: 'Okt', masuk: 0, keluar: 0 },
];

// Data Kartu Kendali Bersih (Kosong - Dihitung dinamis dari Transaksi & Master Barang)
export const SAMPLE_KARTU_KENDALI: KartuKendali[] = [];
export const mockKartuKendali: KartuKendali[] = [];

