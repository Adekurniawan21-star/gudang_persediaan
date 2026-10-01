// ==========================================
// SIPERSEDIA - Type Definitions
// BPS Kab. OKU Selatan
// ==========================================

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  nip: string;
  email: string;
  role: UserRole;
  bidang: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Kategori {
  id: number;
  nama_kategori: string;
  deskripsi: string | null;
  created_at: string;
}

export interface Satuan {
  id: number;
  nama_satuan: string;
  created_at: string;
}

export interface Lokasi {
  id: number;
  nama_lokasi: string;
  deskripsi: string | null;
  created_at: string;
}

export interface Barang {
  id: number;
  kode_barang: string;
  nama_barang: string;
  id_kategori: number;
  id_satuan: number;
  id_lokasi: number;
  stok: number;
  stok_minimum: number;
  foto_url: string | null;
  deskripsi: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  kategori?: Kategori;
  satuan?: Satuan;
  lokasi?: Lokasi;
}

// ==========================================
// Tim Pemohon & Penanggung Jawab
// ==========================================

export interface TimPemohon {
  id: string;
  nama_tim: string;
  penanggung_jawab: string;
  nip_pj: string;
}

export const TIM_PEMOHON_LIST: TimPemohon[] = [
  { id: 'kepala', nama_tim: 'Kepala', penanggung_jawab: 'RIVAL ABDUL JABAR, S.ST., M.Si.', nip_pj: '' },
  { id: 'tim-umum', nama_tim: 'Tim Umum', penanggung_jawab: 'SURYA WAGITO, SST', nip_pj: '' },
  { id: 'tim-sosial', nama_tim: 'Tim Statistik Sosial', penanggung_jawab: 'FATONAH AMINI, S.Tr.Stat.', nip_pj: '' },
  { id: 'tim-distribusi', nama_tim: 'Tim Statistik Distribusi', penanggung_jawab: 'USWAR M. ALGHIFARI A.P, S.Tr.Stat.', nip_pj: '' },
  { id: 'tim-pertanian', nama_tim: 'Tim Pertanian', penanggung_jawab: 'HERA YUDHO KARTIKO, SP', nip_pj: '' },
  { id: 'tim-ipds', nama_tim: 'Tim IPDS', penanggung_jawab: 'DANU ABDI SAPUTRA, S.Tr.Stat.', nip_pj: '' },
  { id: 'tim-nerwilis', nama_tim: 'Tim Nerwilis', penanggung_jawab: 'NURLATIFAH KHOIRUN NISSA, S.Tr.Stat.', nip_pj: '' },
  { id: 'tim-pek-ktip', nama_tim: 'Tim PEK dan KTIP', penanggung_jawab: 'JOSEPA SITANGGANG, S.Stat.', nip_pj: '' },
];

// ==========================================
// Transaksi Masuk (Updated)
// ==========================================

export type SumberBarangMasuk = 'Pembelian' | 'Transfer Masuk';

export interface TransaksiMasukItem {
  id_barang: number;
  jumlah: number;
  harga_satuan: number | null;
  keterangan: string | null;
  barang?: Barang;
}

export interface TransaksiMasuk {
  id: number;
  no_dokumen: string;
  tanggal: string;
  sumber: SumberBarangMasuk;
  // Jika Pembelian: No. BAST, jika Transfer Masuk: No. Surat Pengantar
  no_referensi: string | null;
  items: TransaksiMasukItem[];
  keterangan: string | null;
  created_by: string;
  created_at: string;
  user?: User;
}

// ==========================================
// Transaksi Keluar / Pemakaian Barang (Updated)
// No approval mechanism — admin langsung catat
// ==========================================

export interface TransaksiKeluarItem {
  id_barang: number;
  jumlah: number;
  keterangan: string | null;
  barang?: Barang;
}

export interface TransaksiKeluar {
  id: number;
  no_dokumen: string;
  tanggal: string;
  tim_pemohon: string;       // ID dari TIM_PEMOHON_LIST
  nama_tim: string;          // Nama Tim
  penanggung_jawab: string;  // Nama PJ
  nip_pj: string;            // NIP PJ
  items: TransaksiKeluarItem[];
  keterangan: string | null;
  created_by: string;
  created_at: string;
  user?: User;
}

// ==========================================
// Kartu Kendali Persediaan
// ==========================================

export interface KartuKendaliEntry {
  id: number;
  tanggal: string;
  no_referensi: string;  // No. Bon/Faktur/BAST
  uraian: string;
  masuk: number;
  keluar: number;
  sisa: number;
}

export interface KartuKendali {
  id_barang: number;
  kode_barang: string | null; // Opsional
  nama_barang: string;
  satuan: string;
  tahun: number;
  entries: KartuKendaliEntry[];
}

// ==========================================
// Laporan Rekapitulasi Persediaan (Updated)
// ==========================================

export interface LaporanBulanan {
  id: number;
  bulan: number;
  tahun: number;
  data_rekapitulasi: RekapitulasiItem[];
  generated_by: string;
  created_at: string;
}

export interface RekapitulasiItem {
  id_barang: number;
  nama_barang: string;
  kode_barang: string;
  satuan: string;
  saldo_awal: number;
  pembelian: number;
  transfer_masuk: number;
  pengeluaran: number;
  total_persediaan: number; // saldo_awal + pembelian + transfer_masuk - pengeluaran
  barang_rusak: number;
  barang_usang: number;
}

// Dashboard stats
export interface DashboardStats {
  totalBarang: number;
  totalStokRendah: number;
  totalTransaksiMasukBulanIni: number;
  totalTransaksiKeluarBulanIni: number;
  totalNilaiPersediaan: number;
  pendingRequests: number;
}

// Chart data
export interface ChartDataPoint {
  bulan: string;
  masuk: number;
  keluar: number;
}

// Navigation
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  adminOnly?: boolean;
  badge?: number;
}
