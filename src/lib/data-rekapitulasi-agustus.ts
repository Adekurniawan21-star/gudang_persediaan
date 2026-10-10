// ============================================================
// DATA RESMI REKAPITULASI & STOCK OPNAME BULAN AGUSTUS 2026
// Sumber: Excel / Berita Acara Rekapitulasi Fisik Mbak Guspita Karleni (BPS OKU Selatan)
// ============================================================

export interface RekapitulasiAgustusItem {
  no: number;
  uraian_barang: string;
  satuan: string;
  saldo_juli: number;        // Saldo per 31 Juli 2026
  pembelian: number;         // Pembelian Agustus
  transfer_masuk: number;    // Transfer Masuk Agustus
  pengeluaran: number;       // Pengeluaran Agustus
  total_persediaan: number;  // Saldo Akhir Fisik (31 Agustus 2026)
  barang_rusak: number;
  barang_usang: number;
  // Rincian Pengeluaran per Tim Kerja BPS (Sakernas & Susenas SE)
  tim?: {
    umum: number;
    sosial: number;
    ipds: number;
    pertanian: number;
    distribusi: number;
    neraca: number;
    pek: number;
    sisa: number;
  };
}

export const DATA_REKAPITULASI_AGUSTUS: RekapitulasiAgustusItem[] = [
  { no: 1, uraian_barang: 'Ballpoint', satuan: 'Buah', saldo_juli: 646, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 646, barang_rusak: 0, barang_usang: 0 },
  { no: 2, uraian_barang: 'Spidol Board Marker', satuan: 'Buah', saldo_juli: 18, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 18, barang_rusak: 0, barang_usang: 0 },
  { no: 3, uraian_barang: 'Spidol Permanen', satuan: 'Buah', saldo_juli: 14, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 14, barang_rusak: 0, barang_usang: 0 },
  { no: 4, uraian_barang: 'Pena Belliner Hitam', satuan: 'Kotak', saldo_juli: 3, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 3, barang_rusak: 0, barang_usang: 0 },
  {
    no: 5, uraian_barang: 'Pensil 2B Faber Castel', satuan: 'Kotak', saldo_juli: 10, pembelian: 0, transfer_masuk: 0, pengeluaran: 3, total_persediaan: 7, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 0, sosial: 3, ipds: 0, pertanian: 0, distribusi: 0, neraca: 0, pek: 0, sisa: 0 },
  },
  { no: 6, uraian_barang: 'Pena Tizo Biru', satuan: 'Kotak', saldo_juli: 1, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 1, barang_rusak: 0, barang_usang: 0 },
  {
    no: 7, uraian_barang: 'Joyko Gel Pen', satuan: 'Kotak', saldo_juli: 5, pembelian: 0, transfer_masuk: 0, pengeluaran: 1, total_persediaan: 4, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 0, sosial: 1, ipds: 0, pertanian: 0, distribusi: 0, neraca: 0, pek: 0, sisa: 0 },
  },
  { no: 8, uraian_barang: 'Pena Beliner Biru', satuan: 'Kotak', saldo_juli: 6, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 6, barang_rusak: 0, barang_usang: 0 },
  {
    no: 9, uraian_barang: 'Pena Tizo Hitam', satuan: 'Kotak', saldo_juli: 2, pembelian: 0, transfer_masuk: 0, pengeluaran: 1, total_persediaan: 1, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 0, sosial: 1, ipds: 0, pertanian: 0, distribusi: 0, neraca: 0, pek: 0, sisa: 0 },
  },
  { no: 10, uraian_barang: 'Tinta Cap Otomatis', satuan: 'Buah', saldo_juli: 8, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 8, barang_rusak: 0, barang_usang: 0 },
  {
    no: 11, uraian_barang: 'Paper Klip', satuan: 'Kotak', saldo_juli: 33, pembelian: 0, transfer_masuk: 0, pengeluaran: 30, total_persediaan: 3, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 20, sosial: 0, ipds: 0, pertanian: 0, distribusi: 10, neraca: 0, pek: 0, sisa: 0 },
  },
  { no: 12, uraian_barang: 'Penjepit Kertas No. 155', satuan: 'Kotak', saldo_juli: 3, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 3, barang_rusak: 0, barang_usang: 0 },
  { no: 13, uraian_barang: 'Penjepit Kertas No. 107', satuan: 'Kotak', saldo_juli: 4, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 4, barang_rusak: 0, barang_usang: 0 },
  { no: 14, uraian_barang: 'Binder Clip No. 111', satuan: 'Kotak', saldo_juli: 4, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 4, barang_rusak: 0, barang_usang: 0 },
  { no: 15, uraian_barang: 'Binder Clip No. 200', satuan: 'Kotak', saldo_juli: 10, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 10, barang_rusak: 0, barang_usang: 0 },
  { no: 16, uraian_barang: 'Binder Clip No.105', satuan: 'Kotak', saldo_juli: 8, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 8, barang_rusak: 0, barang_usang: 0 },
  {
    no: 17, uraian_barang: 'Stabillo', satuan: 'Buah', saldo_juli: 15, pembelian: 0, transfer_masuk: 0, pengeluaran: 3, total_persediaan: 12, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 1, sosial: 1, ipds: 0, pertanian: 0, distribusi: 1, neraca: 0, pek: 0, sisa: 0 },
  },
  { no: 18, uraian_barang: 'Tipe-x', satuan: 'Buah', saldo_juli: 16, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 16, barang_rusak: 0, barang_usang: 0 },
  { no: 19, uraian_barang: 'Penghapus', satuan: 'Buah', saldo_juli: 112, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 112, barang_rusak: 0, barang_usang: 0 },
  {
    no: 20, uraian_barang: 'Map Biola', satuan: 'Buah', saldo_juli: 115, pembelian: 0, transfer_masuk: 0, pengeluaran: 102, total_persediaan: 13, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 7, sosial: 80, ipds: 0, pertanian: 0, distribusi: 15, neraca: 0, pek: 0, sisa: 0 },
  },
  { no: 21, uraian_barang: 'Map Bantex', satuan: 'Buah', saldo_juli: 75, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 75, barang_rusak: 0, barang_usang: 0 },
  {
    no: 22, uraian_barang: 'Map BPS', satuan: 'Buah', saldo_juli: 445, pembelian: 0, transfer_masuk: 0, pengeluaran: 74, total_persediaan: 371, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 7, sosial: 40, ipds: 3, pertanian: 4, distribusi: 10, neraca: 5, pek: 5, sisa: 5 },
  },
  { no: 23, uraian_barang: 'Penggaris', satuan: 'Buah', saldo_juli: 9, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 9, barang_rusak: 0, barang_usang: 0 },
  { no: 24, uraian_barang: 'Gunting', satuan: 'Buah', saldo_juli: 9, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 9, barang_rusak: 0, barang_usang: 0 },
  { no: 25, uraian_barang: 'Pembolong Kertas', satuan: 'Buah', saldo_juli: 4, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 4, barang_rusak: 0, barang_usang: 0 },
  { no: 26, uraian_barang: 'Cutter*', satuan: 'Buah', saldo_juli: 13, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 13, barang_rusak: 0, barang_usang: 0 },
  { no: 27, uraian_barang: 'Pembolong Kertas', satuan: 'Buah', saldo_juli: 1, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 1, barang_rusak: 0, barang_usang: 0 },
  { no: 28, uraian_barang: 'isi cutter', satuan: 'Buah', saldo_juli: 9, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 9, barang_rusak: 0, barang_usang: 0 },
  {
    no: 29, uraian_barang: 'Lakban Hitam', satuan: 'Buah', saldo_juli: 4, pembelian: 0, transfer_masuk: 0, pengeluaran: 3, total_persediaan: 1, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 0, sosial: 1, ipds: 0, pertanian: 1, distribusi: 1, neraca: 0, pek: 0, sisa: 0 },
  },
  {
    no: 30, uraian_barang: 'LEM GLUE STICK', satuan: 'Buah', saldo_juli: 5, pembelian: 0, transfer_masuk: 0, pengeluaran: 2, total_persediaan: 3, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 2, sosial: 0, ipds: 0, pertanian: 0, distribusi: 0, neraca: 0, pek: 0, sisa: 0 },
  },
  { no: 31, uraian_barang: 'Double Tip', satuan: 'Buah', saldo_juli: 2, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 2, barang_rusak: 0, barang_usang: 0 },
  { no: 32, uraian_barang: 'Lem Kertas', satuan: 'Buah', saldo_juli: 5, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 5, barang_rusak: 0, barang_usang: 0 },
  { no: 33, uraian_barang: 'STAPLES KECIL', satuan: 'Buah', saldo_juli: 5, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 5, barang_rusak: 0, barang_usang: 0 },
  {
    no: 34, uraian_barang: 'Staples Besar', satuan: 'Buah', saldo_juli: 3, pembelian: 0, transfer_masuk: 0, pengeluaran: 1, total_persediaan: 2, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 1, sosial: 0, ipds: 0, pertanian: 0, distribusi: 0, neraca: 0, pek: 0, sisa: 0 },
  },
  { no: 35, uraian_barang: 'Staples Tembak Kangaro', satuan: 'Buah', saldo_juli: 2, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 2, barang_rusak: 0, barang_usang: 0 },
  { no: 36, uraian_barang: 'Isi Staples Besar', satuan: 'Kotak', saldo_juli: 12, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 12, barang_rusak: 0, barang_usang: 0 },
  { no: 37, uraian_barang: 'Isi Staples Kecil', satuan: 'Kotak', saldo_juli: 53, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 53, barang_rusak: 0, barang_usang: 0 },
  { no: 38, uraian_barang: 'Bantalan Stempel', satuan: 'Buah', saldo_juli: 5, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 5, barang_rusak: 0, barang_usang: 0 },
  { no: 39, uraian_barang: 'Sticky Note', satuan: 'Buah', saldo_juli: 4, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 4, barang_rusak: 0, barang_usang: 0 },
  { no: 40, uraian_barang: 'Kertas Folio (F4)', satuan: 'Rim', saldo_juli: 15, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 15, barang_rusak: 0, barang_usang: 0 },
  {
    no: 41, uraian_barang: 'KERTAS A4', satuan: 'Rim', saldo_juli: 10, pembelian: 0, transfer_masuk: 0, pengeluaran: 1, total_persediaan: 9, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 1, sosial: 0, ipds: 0, pertanian: 0, distribusi: 0, neraca: 0, pek: 0, sisa: 0 },
  },
  { no: 42, uraian_barang: 'Kertas A3 80 gram', satuan: 'Rim', saldo_juli: 3, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 3, barang_rusak: 0, barang_usang: 0 },
  {
    no: 43, uraian_barang: 'Kertas A4 80 gram', satuan: 'Rim', saldo_juli: 30, pembelian: 0, transfer_masuk: 0, pengeluaran: 20, total_persediaan: 10, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 7, sosial: 10, ipds: 1, pertanian: 1, distribusi: 1, neraca: 0, pek: 0, sisa: 0 },
  },
  { no: 44, uraian_barang: 'Kertas A4 Warna', satuan: 'Rim', saldo_juli: 5, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 5, barang_rusak: 0, barang_usang: 0 },
  { no: 45, uraian_barang: 'V-Linen/Brief Card', satuan: 'Lembar', saldo_juli: 59, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 59, barang_rusak: 0, barang_usang: 0 },
  {
    no: 46, uraian_barang: 'Kertas Stiker A4', satuan: 'Lembar', saldo_juli: 124, pembelian: 0, transfer_masuk: 0, pengeluaran: 111, total_persediaan: 13, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 55, sosial: 30, ipds: 0, pertanian: 0, distribusi: 26, neraca: 0, pek: 0, sisa: 0 },
  },
  { no: 47, uraian_barang: 'Kertas Photo', satuan: 'Pack', saldo_juli: 1, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 1, barang_rusak: 0, barang_usang: 0 },
  { no: 48, uraian_barang: 'Amplop Coklat 310 C', satuan: 'Pcs', saldo_juli: 25, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 25, barang_rusak: 0, barang_usang: 0 },
  {
    no: 49, uraian_barang: 'Amplop 312 C', satuan: 'Pcs', saldo_juli: 140, pembelian: 0, transfer_masuk: 0, pengeluaran: 8, total_persediaan: 132, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 0, sosial: 8, ipds: 0, pertanian: 0, distribusi: 0, neraca: 0, pek: 0, sisa: 0 },
  },
  {
    no: 50, uraian_barang: 'Amplop Coklat Polos', satuan: 'Pcs', saldo_juli: 220, pembelian: 0, transfer_masuk: 0, pengeluaran: 30, total_persediaan: 190, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 5, sosial: 15, ipds: 0, pertanian: 1, distribusi: 8, neraca: 0, pek: 1, sisa: 1 },
  },
  { no: 51, uraian_barang: 'Amplop104', satuan: 'Pcs', saldo_juli: 3, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 3, barang_rusak: 0, barang_usang: 0 },
  {
    no: 52, uraian_barang: 'Amplop Paperline 90', satuan: 'Kotak', saldo_juli: 5, pembelian: 0, transfer_masuk: 0, pengeluaran: 4, total_persediaan: 1, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 1, sosial: 2, ipds: 0, pertanian: 0, distribusi: 1, neraca: 0, pek: 0, sisa: 0 },
  },
  {
    no: 53, uraian_barang: 'Tinta Epson 774', satuan: 'Pcs', saldo_juli: 5, pembelian: 0, transfer_masuk: 0, pengeluaran: 1, total_persediaan: 4, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 1, sosial: 0, ipds: 0, pertanian: 0, distribusi: 0, neraca: 0, pek: 0, sisa: 0 },
  },
  { no: 54, uraian_barang: 'Tinta Epson Magenta 008', satuan: 'Pcs', saldo_juli: 5, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 5, barang_rusak: 0, barang_usang: 0 },
  { no: 55, uraian_barang: 'Toner HP Laserjet 89A Premmium', satuan: 'Pcs', saldo_juli: 2, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 2, barang_rusak: 0, barang_usang: 0 },
  {
    no: 56, uraian_barang: 'Tinta Epson Biru (664)', satuan: 'Pcs', saldo_juli: 11, pembelian: 0, transfer_masuk: 0, pengeluaran: 1, total_persediaan: 10, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 1, sosial: 0, ipds: 0, pertanian: 0, distribusi: 0, neraca: 0, pek: 0, sisa: 0 },
  },
  {
    no: 57, uraian_barang: 'Tinta Epson Kuning (664)', satuan: 'Pcs', saldo_juli: 11, pembelian: 0, transfer_masuk: 0, pengeluaran: 1, total_persediaan: 10, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 1, sosial: 0, ipds: 0, pertanian: 0, distribusi: 0, neraca: 0, pek: 0, sisa: 0 },
  },
  {
    no: 58, uraian_barang: 'Tinta Epson Magenta (664)', satuan: 'Pcs', saldo_juli: 10, pembelian: 0, transfer_masuk: 0, pengeluaran: 1, total_persediaan: 9, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 1, sosial: 0, ipds: 0, pertanian: 0, distribusi: 0, neraca: 0, pek: 0, sisa: 0 },
  },
  { no: 59, uraian_barang: 'Tinta Epson Hitam (003)', satuan: 'Pcs', saldo_juli: 10, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 10, barang_rusak: 0, barang_usang: 0 },
  { no: 60, uraian_barang: 'Tinta Epson Biru (003)', satuan: 'Pcs', saldo_juli: 12, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 12, barang_rusak: 0, barang_usang: 0 },
  {
    no: 61, uraian_barang: 'Tinta Epson Kuning (003)', satuan: 'Pcs', saldo_juli: 12, pembelian: 0, transfer_masuk: 0, pengeluaran: 1, total_persediaan: 11, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 1, sosial: 0, ipds: 0, pertanian: 0, distribusi: 0, neraca: 0, pek: 0, sisa: 0 },
  },
  { no: 62, uraian_barang: 'Tinta Epson Magenta (003)', satuan: 'Pcs', saldo_juli: 12, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 12, barang_rusak: 0, barang_usang: 0 },
  { no: 63, uraian_barang: 'Tinta Epson Black (008)', satuan: 'Pcs', saldo_juli: 6, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 6, barang_rusak: 0, barang_usang: 0 },
  { no: 64, uraian_barang: 'Tinta Epson Cyan (008)', satuan: 'Pcs', saldo_juli: 4, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 4, barang_rusak: 0, barang_usang: 0 },
  { no: 65, uraian_barang: 'Tinta Epson Yellow (008)', satuan: 'Pcs', saldo_juli: 5, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 5, barang_rusak: 0, barang_usang: 0 },
  { no: 66, uraian_barang: 'Tinta Epson Magenta (008)', satuan: 'Pcs', saldo_juli: 1, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 1, barang_rusak: 0, barang_usang: 0 },
  { no: 67, uraian_barang: 'Flash Disk', satuan: 'Pcs', saldo_juli: 9, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 9, barang_rusak: 0, barang_usang: 0 },
  { no: 68, uraian_barang: 'Kartu Memori SDHC Lexar', satuan: 'Pcs', saldo_juli: 2, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 2, barang_rusak: 0, barang_usang: 0 },
  { no: 69, uraian_barang: 'Kabel CCTV', satuan: 'Gulungan', saldo_juli: 1, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 1, barang_rusak: 0, barang_usang: 0 },
  { no: 70, uraian_barang: 'Kabel Praba 2x 2,5 MM', satuan: 'Meter', saldo_juli: 50, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 50, barang_rusak: 0, barang_usang: 0 },
  { no: 71, uraian_barang: 'Lampu Philips 40 Watt', satuan: 'Buah', saldo_juli: 4, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 4, barang_rusak: 0, barang_usang: 0 },
  { no: 72, uraian_barang: 'Lampu Philips 14 Watt', satuan: 'Buah', saldo_juli: 8, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 8, barang_rusak: 0, barang_usang: 0 },
  { no: 73, uraian_barang: 'Baterai 9V*', satuan: 'Buah', saldo_juli: 3, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 3, barang_rusak: 0, barang_usang: 0 },
  {
    no: 74, uraian_barang: 'Baterai AA Alkaline abc', satuan: 'Buah', saldo_juli: 28, pembelian: 0, transfer_masuk: 0, pengeluaran: 10, total_persediaan: 18, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 7, sosial: 0, ipds: 3, pertanian: 0, distribusi: 0, neraca: 0, pek: 0, sisa: 0 },
  },
  {
    no: 75, uraian_barang: 'Baterai AAA Alkaline abc', satuan: 'Buah', saldo_juli: 34, pembelian: 0, transfer_masuk: 0, pengeluaran: 4, total_persediaan: 30, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 4, sosial: 0, ipds: 0, pertanian: 0, distribusi: 0, neraca: 0, pek: 0, sisa: 0 },
  },
  { no: 76, uraian_barang: 'Tinta Bantalan', satuan: 'Buah', saldo_juli: 3, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 3, barang_rusak: 0, barang_usang: 0 },
  {
    no: 77, uraian_barang: 'Plastik Dokumen', satuan: 'Gulungan', saldo_juli: 6, pembelian: 0, transfer_masuk: 0, pengeluaran: 2, total_persediaan: 4, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 0, sosial: 0, ipds: 2, pertanian: 0, distribusi: 0, neraca: 0, pek: 0, sisa: 0 },
  },
  {
    no: 78, uraian_barang: 'Kotak Arsip', satuan: 'Buah', saldo_juli: 27, pembelian: 0, transfer_masuk: 0, pengeluaran: 14, total_persediaan: 13, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 14, sosial: 0, ipds: 0, pertanian: 0, distribusi: 0, neraca: 0, pek: 0, sisa: 0 },
  },
  { no: 79, uraian_barang: 'Maintenance Box Printer Epson L15160', satuan: 'Buah', saldo_juli: 7, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 7, barang_rusak: 0, barang_usang: 0 },
  { no: 80, uraian_barang: 'Maintenance Box Printer Epson L1455', satuan: 'Buah', saldo_juli: 6, pembelian: 0, transfer_masuk: 0, pengeluaran: 0, total_persediaan: 6, barang_rusak: 0, barang_usang: 0 },
  {
    no: 81, uraian_barang: 'Rompi SE2026', satuan: 'Buah', saldo_juli: 23, pembelian: 0, transfer_masuk: 0, pengeluaran: 23, total_persediaan: 0, barang_rusak: 0, barang_usang: 0,
    tim: { umum: 0, sosial: 0, ipds: 0, pertanian: 0, distribusi: 23, neraca: 0, pek: 0, sisa: 0 },
  },
];
