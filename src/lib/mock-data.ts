// ==========================================
// Mock Data untuk Development
// Akan diganti dengan data Supabase saat production
// ==========================================

import type { Barang, TransaksiMasuk, TransaksiKeluar, DashboardStats, ChartDataPoint, User, KartuKendali } from '@/types';

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
  { id: 'usr-006', name: 'Maya Anggraini', nip: '199601172017012007', email: 'maya@bps-okus.go.id', role: 'user', bidang: 'Tim Umum', avatar_url: null, is_active: true, created_at: '2026-03-01' },
  { id: 'usr-007', name: 'Hendra Wijaya', nip: '199703082018011008', email: 'hendra@bps-okus.go.id', role: 'user', bidang: 'Tim PEK dan KTIP', avatar_url: null, is_active: true, created_at: '2026-04-01' },
  { id: 'usr-008', name: 'Putri Rahayu', nip: '199809212019012009', email: 'putri@bps-okus.go.id', role: 'user', bidang: 'Kepala', avatar_url: null, is_active: false, created_at: '2026-04-01' },
];

export const mockBarang: Barang[] = [
  { id: 1, kode_barang: 'ATK-001', nama_barang: 'Kertas HVS A4 70gsm', id_kategori: 1, id_satuan: 2, id_lokasi: 2, stok: 150, stok_minimum: 50, foto_url: null, deskripsi: 'Kertas HVS ukuran A4', created_at: '2026-01-10', updated_at: '2026-09-28',
    kategori: { id: 1, nama_kategori: 'Alat Tulis Kantor', deskripsi: null, created_at: '' },
    satuan: { id: 2, nama_satuan: 'Rim', created_at: '' },
    lokasi: { id: 2, nama_lokasi: 'Gudang ATK', deskripsi: null, created_at: '' },
  },
  { id: 2, kode_barang: 'ATK-002', nama_barang: 'Pulpen Pilot Hitam', id_kategori: 1, id_satuan: 3, id_lokasi: 2, stok: 45, stok_minimum: 20, foto_url: null, deskripsi: null, created_at: '2026-01-10', updated_at: '2026-09-25',
    kategori: { id: 1, nama_kategori: 'Alat Tulis Kantor', deskripsi: null, created_at: '' },
    satuan: { id: 3, nama_satuan: 'Lusin', created_at: '' },
    lokasi: { id: 2, nama_lokasi: 'Gudang ATK', deskripsi: null, created_at: '' },
  },
  { id: 3, kode_barang: 'ATK-003', nama_barang: 'Map Snelhecter', id_kategori: 1, id_satuan: 1, id_lokasi: 2, stok: 8, stok_minimum: 25, foto_url: null, deskripsi: null, created_at: '2026-01-10', updated_at: '2026-09-20',
    kategori: { id: 1, nama_kategori: 'Alat Tulis Kantor', deskripsi: null, created_at: '' },
    satuan: { id: 1, nama_satuan: 'Buah', created_at: '' },
    lokasi: { id: 2, nama_lokasi: 'Gudang ATK', deskripsi: null, created_at: '' },
  },
  { id: 4, kode_barang: 'KOM-001', nama_barang: 'Toner Printer HP LaserJet', id_kategori: 2, id_satuan: 1, id_lokasi: 3, stok: 3, stok_minimum: 5, foto_url: null, deskripsi: 'Toner untuk printer HP', created_at: '2026-02-05', updated_at: '2026-09-15',
    kategori: { id: 2, nama_kategori: 'Peralatan Komputer', deskripsi: null, created_at: '' },
    satuan: { id: 1, nama_satuan: 'Buah', created_at: '' },
    lokasi: { id: 3, nama_lokasi: 'Rak Server', deskripsi: null, created_at: '' },
  },
  { id: 5, kode_barang: 'KOM-002', nama_barang: 'Mouse Wireless Logitech', id_kategori: 2, id_satuan: 1, id_lokasi: 3, stok: 12, stok_minimum: 5, foto_url: null, deskripsi: null, created_at: '2026-02-05', updated_at: '2026-09-10',
    kategori: { id: 2, nama_kategori: 'Peralatan Komputer', deskripsi: null, created_at: '' },
    satuan: { id: 1, nama_satuan: 'Buah', created_at: '' },
    lokasi: { id: 3, nama_lokasi: 'Rak Server', deskripsi: null, created_at: '' },
  },
  { id: 6, kode_barang: 'RTG-001', nama_barang: 'Tissu Kotak Paseo', id_kategori: 3, id_satuan: 5, id_lokasi: 1, stok: 24, stok_minimum: 10, foto_url: null, deskripsi: null, created_at: '2026-03-01', updated_at: '2026-09-28',
    kategori: { id: 3, nama_kategori: 'Perlengkapan Rumah Tangga', deskripsi: null, created_at: '' },
    satuan: { id: 5, nama_satuan: 'Dus', created_at: '' },
    lokasi: { id: 1, nama_lokasi: 'Gudang Utama', deskripsi: null, created_at: '' },
  },
  { id: 7, kode_barang: 'BRS-001', nama_barang: 'Sabun Cuci Tangan Lifebuoy', id_kategori: 4, id_satuan: 10, id_lokasi: 1, stok: 2, stok_minimum: 10, foto_url: null, deskripsi: null, created_at: '2026-03-01', updated_at: '2026-09-28',
    kategori: { id: 4, nama_kategori: 'Alat Kebersihan', deskripsi: null, created_at: '' },
    satuan: { id: 10, nama_satuan: 'Botol', created_at: '' },
    lokasi: { id: 1, nama_lokasi: 'Gudang Utama', deskripsi: null, created_at: '' },
  },
  { id: 8, kode_barang: 'CTK-001', nama_barang: 'Buku Induk Registrasi', id_kategori: 5, id_satuan: 1, id_lokasi: 4, stok: 30, stok_minimum: 10, foto_url: null, deskripsi: null, created_at: '2026-04-01', updated_at: '2026-09-01',
    kategori: { id: 5, nama_kategori: 'Perlengkapan Cetakan', deskripsi: null, created_at: '' },
    satuan: { id: 1, nama_satuan: 'Buah', created_at: '' },
    lokasi: { id: 4, nama_lokasi: 'Ruang Arsip', deskripsi: null, created_at: '' },
  },
];

// Transaksi Masuk — per No. Dokumen (Master-Detail)
export const mockTransaksiMasuk: TransaksiMasuk[] = [
  {
    id: 1,
    no_dokumen: 'BM-2026/09/001',
    tanggal: '2026-09-28',
    sumber: 'Pembelian',
    no_referensi: 'BAST/001/IX/2026',
    items: [
      { id_barang: 1, jumlah: 50, harga_satuan: 45000, keterangan: 'Pengadaan Q3', barang: mockBarang[0] },
      { id_barang: 2, jumlah: 10, harga_satuan: 30000, keterangan: null, barang: mockBarang[1] },
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
    no_referensi: 'BAST/002/IX/2026',
    items: [
      { id_barang: 6, jumlah: 12, harga_satuan: 35000, keterangan: null, barang: mockBarang[5] },
      { id_barang: 7, jumlah: 6, harga_satuan: 25000, keterangan: null, barang: mockBarang[6] },
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
    no_referensi: 'BAST/003/IX/2026',
    items: [
      { id_barang: 4, jumlah: 5, harga_satuan: 850000, keterangan: 'Toner printer lantai 2', barang: mockBarang[3] },
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
    no_referensi: 'SP/BPS-SUMSEL/128/VIII/2026',
    items: [
      { id_barang: 2, jumlah: 20, harga_satuan: 30000, keterangan: null, barang: mockBarang[1] },
      { id_barang: 3, jumlah: 30, harga_satuan: 5000, keterangan: null, barang: mockBarang[2] },
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
    no_referensi: 'SP/BPS-SUMSEL/115/VIII/2026',
    items: [
      { id_barang: 8, jumlah: 24, harga_satuan: 15000, keterangan: 'Buku registrasi', barang: mockBarang[7] },
    ],
    keterangan: 'Transfer dari BPS Provinsi',
    created_by: 'admin-001',
    created_at: '2026-08-10',
  },
];

// Transaksi Keluar / Pemakaian Barang — tanpa approval
export const mockTransaksiKeluar: TransaksiKeluar[] = [
  {
    id: 1,
    no_dokumen: 'BK-2026/09/001',
    tanggal: '2026-09-29',
    tim_pemohon: 'tim-sosial',
    nama_tim: 'Tim Statistik Sosial',
    penanggung_jawab: 'FATONAH AMINI, S.Tr.Stat.',
    nip_pj: '',
    items: [
      { id_barang: 1, jumlah: 10, keterangan: 'Kebutuhan cetak laporan Susenas', barang: mockBarang[0] },
      { id_barang: 2, jumlah: 2, keterangan: null, barang: mockBarang[1] },
    ],
    keterangan: null,
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
    nip_pj: '',
    items: [
      { id_barang: 2, jumlah: 3, keterangan: null, barang: mockBarang[1] },
      { id_barang: 4, jumlah: 1, keterangan: 'Toner printer ruang IPDS', barang: mockBarang[3] },
    ],
    keterangan: null,
    created_by: 'usr-004',
    created_at: '2026-09-28',
  },
  {
    id: 3,
    no_dokumen: 'BK-2026/09/003',
    tanggal: '2026-09-30',
    tim_pemohon: 'tim-pertanian',
    nama_tim: 'Tim Pertanian',
    penanggung_jawab: 'HERA YUDHO KARTIKO, SP',
    nip_pj: '',
    items: [
      { id_barang: 4, jumlah: 2, keterangan: 'Toner printer ruang cetak', barang: mockBarang[3] },
    ],
    keterangan: null,
    created_by: 'usr-002',
    created_at: '2026-09-30',
  },
  {
    id: 4,
    no_dokumen: 'BK-2026/09/004',
    tanggal: '2026-09-30',
    tim_pemohon: 'tim-umum',
    nama_tim: 'Tim Umum',
    penanggung_jawab: 'SURYA WAGITO, SST',
    nip_pj: '',
    items: [
      { id_barang: 6, jumlah: 4, keterangan: 'Untuk rapat koordinasi', barang: mockBarang[5] },
      { id_barang: 7, jumlah: 3, keterangan: 'Kebutuhan toilet kantor', barang: mockBarang[6] },
    ],
    keterangan: null,
    created_by: 'usr-006',
    created_at: '2026-09-30',
  },
];

export const mockDashboardStats: DashboardStats = {
  totalBarang: 8,
  totalStokRendah: 3,
  totalTransaksiMasukBulanIni: 3,
  totalTransaksiKeluarBulanIni: 4,
  totalNilaiPersediaan: 28750000,
  pendingRequests: 0,
};

export const mockChartData: ChartDataPoint[] = [
  { bulan: 'Apr', masuk: 15, keluar: 12 },
  { bulan: 'Mei', masuk: 22, keluar: 18 },
  { bulan: 'Jun', masuk: 18, keluar: 24 },
  { bulan: 'Jul', masuk: 30, keluar: 20 },
  { bulan: 'Agt', masuk: 25, keluar: 15 },
  { bulan: 'Sep', masuk: 67, keluar: 19 },
];

// Kartu Kendali mock data
export const mockKartuKendali: KartuKendali[] = [
  {
    id_barang: 1,
    kode_barang: 'ATK-001',
    nama_barang: 'Kertas HVS A4 70gsm',
    satuan: 'Rim',
    tahun: 2026,
    entries: [
      { id: 1, tanggal: '2026-01-05', no_referensi: 'BAST/001/I/2026', uraian: 'Saldo Awal', masuk: 120, keluar: 0, sisa: 120 },
      { id: 2, tanggal: '2026-02-10', no_referensi: 'BK-2026/02/003', uraian: 'Pemakaian Tim Sosial', masuk: 0, keluar: 15, sisa: 105 },
      { id: 3, tanggal: '2026-03-15', no_referensi: 'BAST/005/III/2026', uraian: 'Pembelian ATK Q1', masuk: 30, keluar: 0, sisa: 135 },
      { id: 4, tanggal: '2026-04-20', no_referensi: 'BK-2026/04/001', uraian: 'Pemakaian Tim IPDS', masuk: 0, keluar: 10, sisa: 125 },
      { id: 5, tanggal: '2026-06-12', no_referensi: 'BK-2026/06/002', uraian: 'Pemakaian Tim Umum', masuk: 0, keluar: 20, sisa: 105 },
      { id: 6, tanggal: '2026-07-05', no_referensi: 'BAST/012/VII/2026', uraian: 'Pembelian ATK Q2', masuk: 55, keluar: 0, sisa: 160 },
      { id: 7, tanggal: '2026-09-28', no_referensi: 'BAST/001/IX/2026', uraian: 'Pembelian ATK Q3', masuk: 50, keluar: 0, sisa: 210 },
      { id: 8, tanggal: '2026-09-29', no_referensi: 'BK-2026/09/001', uraian: 'Pemakaian Tim Statistik Sosial', masuk: 0, keluar: 10, sisa: 200 },
    ],
  },
  {
    id_barang: 2,
    kode_barang: 'ATK-002',
    nama_barang: 'Pulpen Pilot Hitam',
    satuan: 'Lusin',
    tahun: 2026,
    entries: [
      { id: 1, tanggal: '2026-01-05', no_referensi: 'BAST/001/I/2026', uraian: 'Saldo Awal', masuk: 30, keluar: 0, sisa: 30 },
      { id: 2, tanggal: '2026-03-20', no_referensi: 'BK-2026/03/001', uraian: 'Pemakaian Tim Distribusi', masuk: 0, keluar: 5, sisa: 25 },
      { id: 3, tanggal: '2026-08-15', no_referensi: 'SP/BPS-SUMSEL/128/VIII/2026', uraian: 'Transfer dari Provinsi', masuk: 20, keluar: 0, sisa: 45 },
      { id: 4, tanggal: '2026-09-28', no_referensi: 'BAST/001/IX/2026', uraian: 'Pembelian ATK Q3', masuk: 10, keluar: 0, sisa: 55 },
      { id: 5, tanggal: '2026-09-28', no_referensi: 'BK-2026/09/002', uraian: 'Pemakaian Tim IPDS', masuk: 0, keluar: 3, sisa: 52 },
      { id: 6, tanggal: '2026-09-29', no_referensi: 'BK-2026/09/001', uraian: 'Pemakaian Tim Statistik Sosial', masuk: 0, keluar: 2, sisa: 50 },
    ],
  },
  {
    id_barang: 4,
    kode_barang: 'KOM-001',
    nama_barang: 'Toner Printer HP LaserJet',
    satuan: 'Buah',
    tahun: 2026,
    entries: [
      { id: 1, tanggal: '2026-01-05', no_referensi: '-', uraian: 'Saldo Awal', masuk: 5, keluar: 0, sisa: 5 },
      { id: 2, tanggal: '2026-04-10', no_referensi: 'BK-2026/04/005', uraian: 'Pemakaian Tim Umum', masuk: 0, keluar: 2, sisa: 3 },
      { id: 3, tanggal: '2026-09-25', no_referensi: 'BAST/003/IX/2026', uraian: 'Pembelian toner', masuk: 5, keluar: 0, sisa: 8 },
      { id: 4, tanggal: '2026-09-28', no_referensi: 'BK-2026/09/002', uraian: 'Pemakaian Tim IPDS', masuk: 0, keluar: 1, sisa: 7 },
      { id: 5, tanggal: '2026-09-30', no_referensi: 'BK-2026/09/003', uraian: 'Pemakaian Tim Pertanian', masuk: 0, keluar: 2, sisa: 5 },
    ],
  },
];
