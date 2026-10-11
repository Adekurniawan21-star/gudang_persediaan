// ==========================================
// SIPERSEDIA - Data Management & Reset Store
// Memastikan data aplikasi selalu siap untuk uji coba fitur per fitur
// ==========================================

import { ALL_81_BARANG_BPS, SAMPLE_TRANSAKSI_MASUK, SAMPLE_TRANSAKSI_KELUAR } from './mock-data';

export const DATA_STORE_VERSION = 'v20261011_clean_v2';

/**
 * Inisialisasi otomatis pada awal aplikasi dimuat.
 * Jika versi data belum sesuai, otomatis reset ke mode uji coba bersih (81 master barang siap, 0 transaksi).
 */
export function initOrMigrateStore(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const currentVersion = localStorage.getItem('sipersedia_data_version');
    if (currentVersion !== DATA_STORE_VERSION) {
      console.log('[SIPERSEDIA] Migrasi versi data ke:', DATA_STORE_VERSION);
      // Bersihkan transaksi lama agar user dapat menguji fitur per fitur dari nol
      localStorage.setItem('sipersedia_transaksi_masuk', JSON.stringify([]));
      localStorage.setItem('sipersedia_transaksi_keluar', JSON.stringify([]));
      
      // Setel 81 barang master resmi BPS dengan stok baseline
      localStorage.setItem('sipersedia_barang_list', JSON.stringify(ALL_81_BARANG_BPS));

      // Hapus data rekapitulasi custom/cache
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sipersedia_laporan_data_')) {
          localStorage.removeItem(key);
        }
      });

      localStorage.setItem('sipersedia_data_version', DATA_STORE_VERSION);
      return true;
    }
  } catch (e) {
    console.error('[SIPERSEDIA] Gagal inisialisasi data store:', e);
  }
  return false;
}

/**
 * Reset ke mode Uji Coba Bersih:
 * - 81 Barang BPS siap digunakan (stok baseline awal)
 * - 0 Transaksi Masuk
 * - 0 Transaksi Keluar
 * - Mutasi kartu kendali bersih siap menerima input baru
 */
export function resetToTestingMode(): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem('sipersedia_barang_list', JSON.stringify(ALL_81_BARANG_BPS));
  localStorage.setItem('sipersedia_transaksi_masuk', JSON.stringify([]));
  localStorage.setItem('sipersedia_transaksi_keluar', JSON.stringify([]));
  localStorage.setItem('sipersedia_data_version', DATA_STORE_VERSION);

  // Bersihkan cache laporan kustom
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('sipersedia_laporan_data_')) {
      localStorage.removeItem(key);
    }
  });

  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('dataStoreReset', { detail: { mode: 'testing' } }));
}

/**
 * Muat data simulasi lengkap (81 barang + transaksi contoh).
 */
export function loadSimulationData(): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem('sipersedia_barang_list', JSON.stringify(ALL_81_BARANG_BPS));
  localStorage.setItem('sipersedia_transaksi_masuk', JSON.stringify(SAMPLE_TRANSAKSI_MASUK));
  localStorage.setItem('sipersedia_transaksi_keluar', JSON.stringify(SAMPLE_TRANSAKSI_KELUAR));
  localStorage.setItem('sipersedia_data_version', DATA_STORE_VERSION);

  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('dataStoreReset', { detail: { mode: 'simulation' } }));
}

/**
 * Kosongkan seluruh data (0 barang & 0 transaksi) untuk menguji formulir master dari nol.
 */
export function wipeAllData(): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem('sipersedia_barang_list', JSON.stringify([]));
  localStorage.setItem('sipersedia_transaksi_masuk', JSON.stringify([]));
  localStorage.setItem('sipersedia_transaksi_keluar', JSON.stringify([]));
  localStorage.setItem('sipersedia_data_version', DATA_STORE_VERSION);

  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('sipersedia_laporan_data_')) {
      localStorage.removeItem(key);
    }
  });

  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('dataStoreReset', { detail: { mode: 'wipe' } }));
}
