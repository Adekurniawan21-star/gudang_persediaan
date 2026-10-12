'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ClipboardList, Search, Printer, Calendar, FileText, ArrowRight,
  Layers, CheckCircle2, ChevronRight, Eye, ArrowDownToLine, ArrowUpFromLine,
  HelpCircle, ShieldCheck, Plus, X, AlertTriangle, Package
} from 'lucide-react';
import { mockKartuKendali, mockBarang, mockTransaksiKeluar, mockTransaksiMasuk } from '@/lib/mock-data';
import { DATA_DAFTAR_PERSEDIAAN_PDF1, type DaftarPersediaanPDFItem } from '@/lib/data-daftar-persediaan-pdf1';
import { TIM_PEMOHON_LIST } from '@/types';
import type { KartuKendali, Barang, TransaksiKeluar, TransaksiMasuk } from '@/types';
import { cn, formatDateShort, formatNumber, formatTanggalTandaTangan } from '@/lib/utils';
import KopSurat from '@/components/KopSurat';

const BULAN_NAMES = [
  'Januari', 'Feb', 'Maret', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'Sept', 'Okt', 'Nov', 'Des'
];

export default function KartuKendaliPage() {
  const [activeTab, setActiveTab] = useState<'kartu' | 'daftar'>('kartu');
  const [selectedBarangId, setSelectedBarangId] = useState<number>(17); // Default Stabillo (ID 17) sesuai PDF 1 Hal 3
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'kartu' | 'daftar'>('kartu');
  const [tglCetakDokumen, setTglCetakDokumen] = useState(() => new Date().toISOString().split('T')[0]);
  const [tampilkanTandaTanganKartu, setTampilkanTandaTanganKartu] = useState(false);

  // === State Form Input Mutasi Langsung ===
  const [showInputModal, setShowInputModal] = useState(false);
  const [inputJenis, setInputJenis] = useState<'masuk' | 'keluar'>('masuk');
  const [inputTanggal, setInputTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [inputNoReferensi, setInputNoReferensi] = useState<string>('');
  const [inputJumlah, setInputJumlah] = useState<number>(1);
  const [inputUraian, setInputUraian] = useState<string>('');
  const [inputHargaSatuan, setInputHargaSatuan] = useState<number>(0);
  const [inputTimPemohon, setInputTimPemohon] = useState<string>('tim-sosial');
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Dynamic Data Lists dari LocalStorage
  const [barangList, setBarangList] = useState<Barang[]>([...mockBarang]);
  const [transaksiKeluarList, setTransaksiKeluarList] = useState<TransaksiKeluar[]>([...mockTransaksiKeluar]);
  const [transaksiMasukList, setTransaksiMasukList] = useState<TransaksiMasuk[]>([...mockTransaksiMasuk]);

  useEffect(() => {
    const bSaved = localStorage.getItem('sipersedia_barang_list');
    if (bSaved) {
      try {
        const parsed = JSON.parse(bSaved);
        if (Array.isArray(parsed) && parsed.length > 0) setBarangList(parsed);
      } catch (e) {}
    }
    const kSaved = localStorage.getItem('sipersedia_transaksi_keluar');
    if (kSaved) {
      try {
        const parsed = JSON.parse(kSaved);
        if (Array.isArray(parsed)) setTransaksiKeluarList(parsed);
      } catch (e) {}
    }
    const mSaved = localStorage.getItem('sipersedia_transaksi_masuk');
    if (mSaved) {
      try {
        const parsed = JSON.parse(mSaved);
        if (Array.isArray(parsed)) setTransaksiMasukList(parsed);
      } catch (e) {}
    }
  }, [refreshKey]);

  const activeBarang = barangList.find(b => b.id === selectedBarangId) || barangList[0];

  // Cari di daftar persediaan PDF1 untuk saldo 1 januari resmi BPS
  const itemPdf = DATA_DAFTAR_PERSEDIAAN_PDF1.find(
    p => p.kode === activeBarang?.kode_barang || p.uraian.toLowerCase() === activeBarang?.nama_barang.toLowerCase()
  );

  // Cari template kartu bawaan jika ada
  const templateCard = mockKartuKendali.find(
    k => k.id_barang === selectedBarangId && k.tahun === selectedYear
  ) || mockKartuKendali.find(k => k.id_barang === selectedBarangId);

  // Penentuan Stock Awal Tahun: utamakan dokumen resmi PDF1, lalu template, lalu master barang
  const stockAwal = itemPdf?.saldo_1_januari ?? templateCard?.stock_awal_tahun ?? (activeBarang?.stok || 0);

  // Kumpulkan mutasi dari template (filter keluar baris saldo awal jika ada agar tidak muncul di tabel 2)
  const baseEntries = (templateCard?.entries || []).filter(e => !e.uraian.toLowerCase().includes('saldo'));
  const existingRefs = new Set(baseEntries.map(e => e.no_referensi));

  // Kumpulkan mutasi tambahan dari Transaksi Masuk
  const additionalMasuk = transaksiMasukList
    .filter(t => {
      const year = new Date(t.tanggal).getFullYear();
      return (year === selectedYear || isNaN(year)) &&
        t.items.some(i => i.id_barang === selectedBarangId) &&
        !existingRefs.has(t.no_referensi || t.no_dokumen);
    })
    .map(t => {
      const itm = t.items.find(i => i.id_barang === selectedBarangId);
      return {
        id: t.id,
        tanggal: t.tanggal,
        no_referensi: t.no_referensi || t.no_dokumen,
        uraian: t.keterangan || `Penerimaan ${t.sumber}`,
        masuk: itm?.jumlah || 0,
        keluar: 0,
        sisa: 0,
      };
    });

  // Kumpulkan mutasi tambahan dari Transaksi Keluar (SPB)
  const additionalKeluar = transaksiKeluarList
    .filter(t => {
      const year = new Date(t.tanggal).getFullYear();
      return (year === selectedYear || isNaN(year)) &&
        t.items.some(i => i.id_barang === selectedBarangId) &&
        !existingRefs.has(t.no_dokumen);
    })
    .map(t => {
      const itm = t.items.find(i => i.id_barang === selectedBarangId);
      return {
        id: t.id,
        tanggal: t.tanggal,
        no_referensi: t.no_dokumen,
        uraian: itm?.keterangan || t.keterangan || `Permintaan ${t.nama_tim}`,
        masuk: 0,
        keluar: itm?.jumlah || 0,
        sisa: 0,
      };
    });

  // Gabungkan seluruh baris mutasi riil (kronologis)
  const rawEntries = [...baseEntries, ...additionalMasuk, ...additionalKeluar];
  const sortedEntries = [...rawEntries].sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  // Hitung ulang saldo berjalan secara matematis (Running Balance dari stockAwal)
  let running = stockAwal;
  const entries = sortedEntries.map((e) => {
    running = running + (e.masuk || 0) - (e.keluar || 0);
    return { ...e, sisa: Math.max(0, running) };
  });

  // Perhitungan Akuntansi Kartu Kendali
  const totalMasuk = entries.reduce((s, e) => s + (e.masuk || 0), 0);
  const totalKeluar = entries.reduce((s, e) => s + (e.keluar || 0), 0);
  const sisaAkhir = entries.length > 0 ? entries[entries.length - 1].sisa : stockAwal;

  const getMonthlyOut = (m: number) => {
    return entries
      .filter((e) => {
        const entryMonth = new Date(e.tanggal).getMonth() + 1;
        return entryMonth === m;
      })
      .reduce((s, e) => s + (e.keluar || 0), 0);
  };

  const totalPengeluaranTahunan = Array.from({ length: 12 }, (_, i) => getMonthlyOut(i + 1)).reduce((a, b) => a + b, 0);

  // Objek Kartu Kendali Aktif Lengkap
  const currentCard = {
    id: activeBarang?.id || selectedBarangId,
    id_barang: activeBarang?.id || selectedBarangId,
    nama_barang: activeBarang?.nama_barang || 'Barang',
    kode_barang: activeBarang?.kode_barang || '000000',
    satuan: activeBarang?.satuan?.nama_satuan || 'Buah',
    proyek_rutin: templateCard?.proyek_rutin || 'Rutin',
    tahun: selectedYear,
    halaman: templateCard?.halaman || 1,
    stock_awal_tahun: stockAwal,
    entries: entries,
    pengeluaran_bulanan: Array.from({ length: 12 }, (_, i) => getMonthlyOut(i + 1)),
    total_pengeluaran: totalPengeluaranTahunan,
    stock_akhir_tahun: sisaAkhir,
  };

  // Pembagian baris mutasi untuk format ganda (Dual-Pane) persis Halaman 3 PDF & Formulir Fisik BPS:
  // - Sisi kiri memuat transaksi mutasi 1 s.d. 12 (atau batas kapasitas)
  // - Sisi kanan baris pertama adalah "Pindahan", dan transaksi mutasi berikutnya berlanjut di baris ke-2 dengan nomor 13, 14, dst.
  // - Total baris cetak: 25 baris penuh untuk memenuhi satu halaman A4 Landscape rapi
  const LEFT_CAPACITY = 12;
  const leftEntries = entries.slice(0, LEFT_CAPACITY);
  const rightEntries = entries.slice(LEFT_CAPACITY);
  // Baris dinamis: hanya menampilkan baris yang terisi (1 item = 1 baris, 2 item = 2 baris, dst.)
  const activeRowCount = Math.max(1, Math.max(leftEntries.length, rightEntries.length > 0 ? rightEntries.length + 1 : 0));

  const leftTotalMasuk = leftEntries.reduce((s, e) => s + e.masuk, 0);
  const leftTotalKeluar = leftEntries.reduce((s, e) => s + e.keluar, 0);
  const leftLastSisa = leftEntries.length > 0 ? leftEntries[leftEntries.length - 1].sisa : stockAwal;

  const rightTotalMasuk = rightEntries.reduce((s, e) => s + e.masuk, 0);
  const rightTotalKeluar = rightEntries.reduce((s, e) => s + e.keluar, 0);

  // Handler cetak dokumen bersih (tanpa tulisan SIPERSEDIA di header browser)
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = ' ';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const filteredBarang = barangList.filter(b =>
    b.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.kode_barang && b.kode_barang.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredDaftarPersediaan = DATA_DAFTAR_PERSEDIAAN_PDF1.filter(item =>
    item.uraian.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigasi ke Kartu Barang tertentu dari Daftar Persediaan
  const handleSelectFromDaftar = (kode: string, uraian: string) => {
    const matched = barangList.find(b => b.kode_barang === kode || b.nama_barang.toLowerCase() === uraian.toLowerCase());
    if (matched) {
      setSelectedBarangId(matched.id);
    }
    setActiveTab('kartu');
  };

  // ========================================
  // HANDLER BUKA MODAL INPUT MUTASI LANGSUNG
  // ========================================
  const handleOpenInputModal = (jenis: 'masuk' | 'keluar') => {
    setInputJenis(jenis);
    setInputTanggal(new Date().toISOString().split('T')[0]);
    setInputNoReferensi('');
    setInputJumlah(1);
    setInputUraian('');
    setInputHargaSatuan(0);
    setInputTimPemohon('tim-sosial');
    setShowInputModal(true);
  };

  // ========================================
  // HANDLER SIMPAN MUTASI → SEKALIGUS TULIS
  // KE TRANSAKSI MASUK/KELUAR DI LOCALSTORAGE
  // ========================================
  const handleSaveInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputJumlah <= 0) {
      setNotification({ type: 'error', message: 'Jumlah harus lebih dari 0!' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    if (!activeBarang) return;

    if (inputJenis === 'masuk') {
      // === Buat record Transaksi Masuk baru ===
      const existingMasuk = [...transaksiMasukList];
      const docNo = `BM-${new Date(inputTanggal).getFullYear()}/${String(new Date(inputTanggal).getMonth() + 1).padStart(2, '0')}/${String(existingMasuk.length + 1).padStart(3, '0')}`;
      const newTrx: TransaksiMasuk = {
        id: Date.now(),
        no_dokumen: docNo,
        tanggal: inputTanggal,
        sumber: 'Pembelian',
        no_referensi: inputNoReferensi.trim() || docNo,
        items: [{
          id_barang: activeBarang.id,
          jumlah: Number(inputJumlah),
          harga_satuan: Number(inputHargaSatuan) || null,
          keterangan: inputUraian.trim() || null,
          barang: activeBarang,
        }],
        keterangan: inputUraian.trim() || `Penerimaan ${activeBarang.nama_barang}`,
        created_by: 'admin-001',
        created_at: new Date().toISOString(),
      };
      const updatedMasuk = [newTrx, ...existingMasuk];
      setTransaksiMasukList(updatedMasuk);
      localStorage.setItem('sipersedia_transaksi_masuk', JSON.stringify(updatedMasuk));

      // Update stok barang di master
      const nextBarang = barangList.map(b => {
        if (b.id === activeBarang.id) return { ...b, stok: b.stok + Number(inputJumlah) };
        return b;
      });
      setBarangList(nextBarang);
      localStorage.setItem('sipersedia_barang_list', JSON.stringify(nextBarang));

      setNotification({ type: 'success', message: `✅ Barang masuk +${inputJumlah} ${activeBarang.satuan?.nama_satuan || 'Buah'} "${activeBarang.nama_barang}" berhasil dicatat! Otomatis sinkron ke Transaksi Masuk & Laporan.` });
    } else {
      // === Buat record Transaksi Keluar baru ===
      const existingKeluar = [...transaksiKeluarList];
      const timObj = TIM_PEMOHON_LIST.find(t => t.id === inputTimPemohon) || TIM_PEMOHON_LIST[1];
      const docNo = `BK-${new Date(inputTanggal).getFullYear()}/${String(new Date(inputTanggal).getMonth() + 1).padStart(2, '0')}/${String(existingKeluar.length + 1).padStart(3, '0')}`;
      const newTrx: TransaksiKeluar = {
        id: Date.now(),
        no_dokumen: docNo,
        tanggal: inputTanggal,
        tim_pemohon: timObj.id,
        nama_tim: timObj.nama_tim,
        penanggung_jawab: timObj.penanggung_jawab,
        nip_pj: timObj.nip_pj,
        items: [{
          id_barang: activeBarang.id,
          jumlah: Number(inputJumlah),
          keterangan: inputUraian.trim() || null,
          barang: activeBarang,
        }],
        keterangan: inputUraian.trim() || `Permintaan ${timObj.nama_tim}`,
        created_by: 'admin-001',
        created_at: new Date().toISOString(),
      };
      const updatedKeluar = [newTrx, ...existingKeluar];
      setTransaksiKeluarList(updatedKeluar);
      localStorage.setItem('sipersedia_transaksi_keluar', JSON.stringify(updatedKeluar));

      // Update stok barang di master
      const nextBarang = barangList.map(b => {
        if (b.id === activeBarang.id) return { ...b, stok: Math.max(0, b.stok - Number(inputJumlah)) };
        return b;
      });
      setBarangList(nextBarang);
      localStorage.setItem('sipersedia_barang_list', JSON.stringify(nextBarang));

      setNotification({ type: 'success', message: `✅ Barang keluar -${inputJumlah} ${activeBarang.satuan?.nama_satuan || 'Buah'} "${activeBarang.nama_barang}" berhasil dicatat! Otomatis sinkron ke Transaksi Keluar & Laporan.` });
    }

    setShowInputModal(false);
    setRefreshKey(prev => prev + 1);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="page-enter space-y-6">
      {/* NOTIFIKASI TOAST */}
      {notification && (
        <div className={cn(
          'fixed top-6 right-6 z-[60] max-w-md px-5 py-3 rounded-xl shadow-2xl border text-sm font-semibold animate-slide-in-up',
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
          notification.type === 'error' ? 'bg-rose-50 border-rose-300 text-rose-800' :
          'bg-blue-50 border-blue-300 text-blue-800'
        )}>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 opacity-60 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header Utama */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-dark-800">Kartu Kendali Persediaan</h1>
            <span className="text-xs bg-bps-blue-50 text-bps-blue font-bold px-2.5 py-0.5 rounded-full border border-bps-blue-200">
              Dokumen Resmi BPS OKU Selatan
            </span>
          </div>
          <p className="text-sm text-dark-400 mt-1">
            Buku besar pembantu mutasi persediaan barang — Otomatis terhubung dengan Transaksi Masuk, Transaksi Keluar (SPB), dan Laporan Persediaan
          </p>
        </div>

        {/* Tab & Aksi Cetak */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-dark-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('kartu')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                activeTab === 'kartu' ? 'bg-white text-bps-blue shadow-xs' : 'text-dark-500 hover:text-dark-800'
              )}
            >
              <FileText className="w-3.5 h-3.5" />
              Kartu Persediaan (ATK/ARK)
            </button>
            <button
              onClick={() => setActiveTab('daftar')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                activeTab === 'daftar' ? 'bg-white text-bps-blue shadow-xs' : 'text-dark-500 hover:text-dark-800'
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              Daftar Rekapitulasi Persediaan
            </button>
          </div>

          <button
            onClick={() => {
              setPreviewMode(activeTab);
              setShowPrintPreview(true);
            }}
            className="btn-primary text-xs"
          >
            <Printer className="w-4 h-4" />
            {activeTab === 'kartu' ? 'Cetak Kartu Persediaan' : 'Cetak Daftar Persediaan'}
          </button>
        </div>
      </div>

      {/* FILTER & PERIODE */}
      <div className="card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-dark-50 border border-dark-200 rounded-lg p-1">
            <Calendar className="w-4 h-4 text-dark-400 ml-2" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-xs font-bold text-dark-700 bg-transparent py-1 pr-3 focus:outline-none cursor-pointer"
            >
              <option value={2025}>Tahun Anggaran 2025 (PDF 1)</option>
              <option value={2026}>Tahun Anggaran 2026 (PDF 2)</option>
            </select>
          </div>

          <div className="text-xs text-dark-500 hidden sm:block">
            {activeTab === 'kartu' ? (
              <span>Barang aktif: <strong>{currentCard?.nama_barang}</strong> ({currentCard?.kode_barang})</span>
            ) : (
              <span>Menampilkan <strong>{DATA_DAFTAR_PERSEDIAAN_PDF1.length} item</strong> persediaan barang</span>
            )}
          </div>
        </div>

        {/* Input Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9 py-1.5 text-xs w-full"
            placeholder="Cari kode atau nama barang..."
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAMPILAN 1: KARTU PERSEDIAAN BARANG PAKAI HABIS (ATK/ARK) */}
      {/* PERSIS FORMAT HALAMAN 3 PDF                              */}
      {/* ======================================================== */}
      {activeTab === 'kartu' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Pilih Barang */}
          <div className="lg:col-span-1">
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-dark-100">
                <h3 className="text-xs font-bold text-dark-700 uppercase tracking-wider">Pilih Barang</h3>
                <span className="text-[10px] bg-dark-100 text-dark-600 px-2 py-0.5 rounded-full font-semibold">
                  {filteredBarang.length} barang
                </span>
              </div>

              {/* Daftar Tombol Barang — Scroll Vertikal Rapi */}
              <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
                {filteredBarang.length === 0 && (
                  <div className="text-center py-8 text-dark-400 text-xs px-2">
                    <Package className="w-8 h-8 text-dark-200 mx-auto mb-2" />
                    <p className="font-semibold text-dark-700">Belum ada barang persediaan</p>
                    <p className="text-[11px] mt-1 mb-3 text-dark-400">Tambahkan barang terlebih dahulu untuk mengaktifkan kartu kendali.</p>
                    <Link href="/barang" className="btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Tambah Barang
                    </Link>
                  </div>
                )}
                {filteredBarang.map(b => {
                  const isSelected = selectedBarangId === b.id;
                  const hasCard = mockKartuKendali.some(k => k.id_barang === b.id);
                  return (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBarangId(b.id)}
                      className={cn(
                        'w-full text-left p-2.5 rounded-lg transition-all duration-150 text-xs border',
                        isSelected
                          ? 'bg-bps-blue text-white shadow-sm font-semibold border-bps-blue-600'
                          : 'hover:bg-dark-50 text-dark-700 border-dark-100/70 bg-white'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{b.nama_barang}</span>
                        <span className={cn(
                          'font-mono text-[10px] px-1 rounded',
                          isSelected ? 'bg-bps-blue-700 text-white' : 'text-dark-500 bg-dark-100'
                        )}>
                          {b.kode_barang || '-'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[10px]">
                        <span className={isSelected ? 'text-bps-blue-100' : 'text-dark-400'}>
                          Satuan: {b.satuan?.nama_satuan || 'Buah'}
                        </span>
                        {hasCard && (
                          <span className={cn(
                            'px-1.5 py-0.2 rounded font-medium text-[9px]',
                            isSelected ? 'bg-bps-blue-600 text-white' : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                          )}>
                            Ada Mutasi
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Konten Kartu Kendali Sesuai Halaman 3 PDF */}
          <div className="lg:col-span-3">
            {currentCard ? (
              <div className="card p-6 bg-white overflow-x-auto shadow-sm border border-dark-200">
                {/* Header Kartu Sesuai Format Resmi PDF Halaman 3 */}
                <div className="text-center mb-5 pb-3 border-b border-dark-200">
                  <h2 className="text-base font-extrabold text-black uppercase tracking-wider">
                    KARTU PERSEDIAAN BARANG PAKAI HABIS (ATK/ARK)
                  </h2>
                </div>

                {/* Identitas Barang & Satuan Kerja Sesuai Format Gambar Excel */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4 text-xs text-black items-start">
                  <div className="md:col-span-4 flex flex-col items-start justify-start pt-0">
                    <div className="flex flex-col items-center text-center">
                      <img src="/images/logo-bps.svg" alt="Logo BPS" className="h-14 w-auto object-contain mb-1" />
                      <div
                        style={{
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '9pt',
                          lineHeight: 1.25,
                        }}
                        className="font-bold italic text-black text-center"
                      >
                        <p>Badan Pusat Statistik</p>
                        <p>Kabupaten Ogan Komering Ulu Selatan</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 space-y-1 font-medium items-start pt-0" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <div className="flex items-center">
                      <span className="w-28 text-black">Nama Barang</span>
                      <span className="w-3 text-center">:</span>
                      <span className="font-bold text-black uppercase">{currentCard.nama_barang}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-28 text-black">Kode Barang</span>
                      <span className="w-3 text-center">:</span>
                      <span className="font-mono font-bold text-black">{currentCard.kode_barang || '-'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-28 text-black">Satuan Barang</span>
                      <span className="w-3 text-center">:</span>
                      <span className="text-black">{currentCard.satuan}</span>
                    </div>
                  </div>

                  <div className="md:col-span-3 space-y-1 font-medium items-start pt-0" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <div className="flex items-center">
                      <span className="w-24 text-black">Halaman</span>
                      <span className="w-3 text-center">:</span>
                      <span className="text-black font-semibold">{currentCard.halaman || 1}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-black">Proyek/Rutin</span>
                      <span className="w-3 text-center">:</span>
                      <span className="text-black">{currentCard.proyek_rutin || ''}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-black">Tahun</span>
                      <span className="w-3 text-center">:</span>
                      <span className="font-bold text-black">{currentCard.tahun}</span>
                    </div>
                  </div>
                </div>

                {/* TABEL 1: Banyaknya Pengeluaran Tiap-Tiap Bulan (15 Kolom Horizontal) */}
                <div className="mb-6 overflow-x-auto">
                  <table className="w-full border-collapse border border-black text-center text-xs">
                    <thead>
                      <tr className="bg-gray-100 font-bold text-black">
                        <th colSpan={12} className="border border-black py-1.5 uppercase text-[11px] tracking-wider">
                          Banyaknya Pengeluaran Tiap-Tiap Bulan
                        </th>
                        <th rowSpan={2} className="border border-black px-2 py-1.5 text-[10px] leading-tight w-20">
                          Jumlah Pengeluaran
                        </th>
                        <th rowSpan={2} className="border border-black px-2 py-1.5 text-[10px] leading-tight w-20">
                          Stock Awal tahun
                        </th>
                        <th rowSpan={2} className="border border-black px-2 py-1.5 text-[10px] leading-tight w-20 bg-gray-50">
                          Stock Akhir tahun
                        </th>
                      </tr>
                      <tr className="bg-gray-50 font-semibold text-black text-[10px]">
                        {BULAN_NAMES.map((bln, idx) => (
                          <th key={idx} className="border border-black px-1 py-1 w-11">
                            {bln}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-black font-semibold text-xs h-7">
                        {BULAN_NAMES.map((_, idx) => {
                          const m = idx <= 2 ? idx + 1 : idx;
                          const out = getMonthlyOut(m);
                          const val = idx === 0 ? (out > 0 ? out : '0') : (out > 0 ? out : '');
                          return (
                            <td key={idx} className="border border-black py-1.5">
                              {val}
                            </td>
                          );
                        })}
                        <td className="border border-black py-1.5 font-bold text-black bg-gray-50">
                          {totalPengeluaranTahunan > 0 ? totalPengeluaranTahunan : ''}
                        </td>
                        <td className="border border-black py-1.5 font-bold text-black">
                          {stockAwal}
                        </td>
                        <td className="border border-black py-1.5 font-extrabold text-blue-900 bg-blue-50/50">
                          {totalPengeluaranTahunan > 0 || totalMasuk > 0 ? sisaAkhir : ''}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* TABEL 2: Rincian Mutasi Barang Dual-Pane (14 Kolom) Sesuai Halaman 3 PDF */}
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse border border-black text-[10px]">
                    <thead>
                      <tr className="bg-gray-100 font-bold text-black text-center">
                        {/* Kolom Sisi Kiri */}
                        <th className="border border-black px-1 py-1 w-8">No.</th>
                        <th className="border border-black px-1.5 py-1 w-20">No. Bon/Faktur</th>
                        <th className="border border-black px-1.5 py-1 w-16">Tgl M/K</th>
                        <th className="border border-black px-2 py-1 text-left">Uraian Pemasukan/Pengeluaran</th>
                        <th className="border border-black px-1 py-1 w-12">Masuk (M)</th>
                        <th className="border border-black px-1 py-1 w-12">Keluar (K)</th>
                        <th className="border border-black px-1.5 py-1 w-14">Sisa Barang</th>

                        {/* Kolom Sisi Kanan */}
                        <th className="border border-black px-1 py-1 w-8">No.</th>
                        <th className="border border-black px-1.5 py-1 w-20">No. Bon/Faktur</th>
                        <th className="border border-black px-1.5 py-1 w-16">Tgl M/K</th>
                        <th className="border border-black px-2 py-1 text-left">Uraian Pemasukan/Pengeluaran</th>
                        <th className="border border-black px-1 py-1 w-12">Masuk (M)</th>
                        <th className="border border-black px-1 py-1 w-12">Keluar (K)</th>
                        <th className="border border-black px-1.5 py-1 w-14">Sisa Barang</th>
                      </tr>
                      <tr className="bg-gray-50 text-[9px] text-gray-600 font-bold text-center">
                        <th className="border border-black py-0.5">(1)</th>
                        <th className="border border-black py-0.5">(2)</th>
                        <th className="border border-black py-0.5">(3)</th>
                        <th className="border border-black py-0.5">(4)</th>
                        <th className="border border-black py-0.5">(5)</th>
                        <th className="border border-black py-0.5">(6)</th>
                        <th className="border border-black py-0.5">(7)</th>
                        <th className="border border-black py-0.5">(8)</th>
                        <th className="border border-black py-0.5">(9)</th>
                        <th className="border border-black py-0.5">(10)</th>
                        <th className="border border-black py-0.5">(11)</th>
                        <th className="border border-black py-0.5">(12)</th>
                        <th className="border border-black py-0.5">(13)</th>
                        <th className="border border-black py-0.5">(14)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: activeRowCount }).map((_, rIdx) => {
                          const left = leftEntries[rIdx];
                          const isPindahanRow = rIdx === 0 && rightEntries.length > 0;
                          const right = rIdx > 0 ? rightEntries[rIdx - 1] : null;

                          return (
                            <tr key={rIdx} className="text-black hover:bg-gray-50/50 h-[20px]">
                              {/* Sisi Kiri */}
                              <td className="border border-black px-1 py-0.5 text-center font-medium">
                                {left ? rIdx + 1 : ''}
                              </td>
                              <td className="border border-black px-1.5 py-0.5 font-mono text-[9px]">
                                {left?.no_referensi || ''}
                              </td>
                              <td className="border border-black px-1 py-0.5 text-center">
                                {left ? formatDateShort(left.tanggal) : ''}
                              </td>
                              <td className="border border-black px-2 py-0.5 font-medium">
                                {left?.uraian || ''}
                              </td>
                              <td className="border border-black px-1 py-0.5 text-center font-bold text-emerald-800">
                                {left && left.masuk > 0 ? left.masuk : (left ? '-' : '')}
                              </td>
                              <td className="border border-black px-1 py-0.5 text-center font-bold text-rose-800">
                                {left && left.keluar > 0 ? left.keluar : (left ? '-' : '')}
                              </td>
                              <td className="border border-black px-1.5 py-0.5 text-center font-bold">
                                {left ? left.sisa : ''}
                              </td>

                              {/* Sisi Kanan */}
                              {isPindahanRow ? (
                                <>
                                  <td colSpan={4} className="border border-black px-2 py-0.5 font-medium">
                                    Pindahan
                                  </td>
                                  <td className="border border-black px-1 py-0.5 text-center font-bold text-emerald-800"></td>
                                  <td className="border border-black px-1 py-0.5 text-center font-bold text-rose-800"></td>
                                  <td className="border border-black px-1.5 py-0.5 text-center font-bold">
                                    {leftEntries.length > 0 ? leftLastSisa : ''}
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="border border-black px-1 py-0.5 text-center font-medium">
                                    {right ? leftEntries.length + rIdx : ''}
                                  </td>
                                  <td className="border border-black px-1.5 py-0.5 font-mono text-[9px]">
                                    {right?.no_referensi || ''}
                                  </td>
                                  <td className="border border-black px-1 py-0.5 text-center">
                                    {right ? formatDateShort(right.tanggal) : ''}
                                  </td>
                                  <td className="border border-black px-2 py-0.5 font-medium">
                                    {right?.uraian || ''}
                                  </td>
                                  <td className="border border-black px-1 py-0.5 text-center font-bold text-emerald-800">
                                    {right && right.masuk > 0 ? right.masuk : (right ? '-' : '')}
                                  </td>
                                  <td className="border border-black px-1 py-0.5 text-center font-bold text-rose-800">
                                    {right && right.keluar > 0 ? right.keluar : (right ? '-' : '')}
                                  </td>
                                  <td className="border border-black px-1.5 py-0.5 text-center font-bold">
                                    {right ? right.sisa : ''}
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100 font-bold text-black">
                        <td colSpan={4} className="border border-black px-2 py-1 text-center uppercase tracking-wider text-[10px]">
                          JUMLAH (dipindahkan)
                        </td>
                        <td className="border border-black px-1 py-1 text-center font-bold">
                          {leftTotalMasuk > 0 ? leftTotalMasuk : ''}
                        </td>
                        <td className="border border-black px-1 py-1 text-center font-bold">
                          {leftTotalKeluar > 0 ? leftTotalKeluar : ''}
                        </td>
                        <td className="border border-black px-1.5 py-1 text-center font-extrabold bg-gray-200">
                          {leftEntries.length > 0 ? leftLastSisa : ''}
                        </td>

                        <td colSpan={4} className="border border-black px-2 py-1 text-center uppercase tracking-wider text-[10px]">
                          JUMLAH (dipindahkan)
                        </td>
                        <td className="border border-black px-1 py-1 text-center font-bold">
                          {rightEntries.length > 0 && rightTotalMasuk > 0 ? rightTotalMasuk : ''}
                        </td>
                        <td className="border border-black px-1 py-1 text-center font-bold">
                          {rightEntries.length > 0 && rightTotalKeluar > 0 ? rightTotalKeluar : ''}
                        </td>
                        <td className="border border-black px-1.5 py-1 text-center font-extrabold bg-gray-200">
                          {rightEntries.length > 0 ? sisaAkhir : ''}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Tanda Tangan Resmi Sesuai Format BPS - Garis Mengikuti Panjang Nama */}
                <div className="w-full flex items-start justify-between text-xs text-black mt-8 pt-4 border-t border-dashed border-dark-200">
                  <div className="w-72 text-center flex flex-col items-center">
                    <p className="font-semibold text-black">Mengetahui,</p>
                    <p className="font-medium text-black">Kuasa Pengguna Barang</p>
                    <p className="font-medium text-black">Kepala BPS Kabupaten OKU Selatan</p>
                    <div className="h-16" />
                    <p className="text-center">
                      <span className="font-bold border-b border-black text-black pb-0.5 inline-block">
                        Rival Abdul Jabar, S.ST., M.Si.
                      </span>
                    </p>
                    <p className="text-[11px] mt-1 font-medium text-black text-center">NIP. 19831122 200701 1003</p>
                  </div>
                  <div className="w-72 text-center flex flex-col items-center">
                    <p className="font-medium text-black">
                      Muaradua, {currentCard.tahun === 2025 ? '31 Desember 2025' : '31 Agustus 2026'}
                    </p>
                    <p className="font-semibold text-black">Petugas Pengelola Persediaan</p>
                    <p className="text-transparent select-none font-medium">-</p>
                    <div className="h-16" />
                    <p className="text-center">
                      <span className="font-bold border-b border-black text-black pb-0.5 inline-block">
                        Guspita Karleni, S.Si
                      </span>
                    </p>
                    <p className="text-[11px] mt-1 font-medium text-black text-center">NIP. 19970806 202521 2039</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <ClipboardList className="w-16 h-16 text-dark-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-dark-500">Pilih Barang</h3>
                <p className="text-sm text-dark-400 mt-1">Pilih barang dari daftar di sebelah kiri untuk melihat kartu kendali</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAMPILAN 2: DAFTAR REKAPITULASI PERSEDIAAN BARANG         */}
      {/* PERSIS FORMAT HALAMAN 1 & 2 PDF                          */}
      {/* ======================================================== */}
      {activeTab === 'daftar' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-100 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-dark-800">
                Daftar Persediaan Barang — Saldo Awal, Masuk, dan Keluar
              </h2>
              <p className="text-xs text-dark-400 mt-0.5">
                Format resmi sesuai Dokumen PDF Halaman 1 &amp; 2 (Tahun {selectedYear})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-dark-500 font-medium">
                Klik ikon <Eye className="w-3.5 h-3.5 inline text-bps-blue" /> untuk buka Kartu Kendali per barang
              </span>
            </div>
          </div>

          <div className="table-container border-0 max-h-[620px] overflow-y-auto">
            <table>
              <thead className="sticky top-0 bg-dark-50 z-10 shadow-xs text-xs">
                <tr>
                  <th className="w-14 text-center">Nomor</th>
                  <th className="w-24 text-center font-mono">KODE</th>
                  <th>U R A I A N</th>
                  <th className="text-center w-36">JUMLAH Saldo 1 Januari</th>
                  <th className="text-center w-24 text-emerald-800 bg-emerald-50/50">MASUK</th>
                  <th className="text-center w-24 text-rose-800 bg-rose-50/50">KELUAR</th>
                  <th className="text-center w-24">Satuan</th>
                  <th className="text-center w-28 font-bold bg-blue-50/50">Sisa Akhir</th>
                  <th className="text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredDaftarPersediaan.map((item) => {
                  const sisa = (item.saldo_1_januari || 0) + (item.masuk || 0) - (item.keluar || 0);
                  return (
                    <tr key={item.nomor} className="hover:bg-dark-50/50 text-xs">
                      <td className="text-center text-dark-400 font-medium">{item.nomor}</td>
                      <td className="text-center font-mono font-bold text-bps-blue text-[11px]">{item.kode}</td>
                      <td className="font-semibold text-dark-800">{item.uraian}</td>
                      <td className="text-center font-bold text-dark-700">{formatNumber(item.saldo_1_januari)}</td>
                      <td className="text-center font-bold text-emerald-700 bg-emerald-50/30">
                        {item.masuk > 0 ? formatNumber(item.masuk) : '-'}
                      </td>
                      <td className="text-center font-bold text-rose-700 bg-rose-50/30">
                        {item.keluar > 0 ? formatNumber(item.keluar) : '0'}
                      </td>
                      <td className="text-center text-dark-500 font-medium">{item.satuan}</td>
                      <td className="text-center font-extrabold text-blue-900 bg-blue-50/20">
                        {formatNumber(sisa)}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => handleSelectFromDaftar(item.kode, item.uraian)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold text-bps-blue hover:bg-bps-blue-50 transition-colors"
                          title="Buka Kartu Kendali Barang Ini"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Kartu</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL PRINT PREVIEW RESMI (KOP SURAT TAHOMA 14 & ARIAL 8) */}
      {/* ======================================================== */}
      {showPrintPreview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-center justify-between p-4 border-b border-dark-100 no-print sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-bps-blue" />
                <h2 className="text-base font-bold text-dark-800">
                  {previewMode === 'kartu'
                    ? `Preview Cetak: Kartu Persediaan Barang — ${currentCard?.nama_barang} (${currentCard?.tahun})`
                    : `Preview Cetak: Daftar Rekapitulasi Persediaan Barang (Tahun ${selectedYear})`}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {previewMode === 'kartu' && (
                  <label className="flex items-center gap-1.5 text-xs text-dark-700 cursor-pointer select-none no-print bg-dark-50 border border-dark-200 rounded-lg px-2.5 py-1">
                    <input
                      type="checkbox"
                      checked={tampilkanTandaTanganKartu}
                      onChange={(e) => setTampilkanTandaTanganKartu(e.target.checked)}
                      className="rounded border-dark-300 text-bps-blue focus:ring-bps-blue"
                    />
                    <span className="font-medium text-dark-700">Tanda Tangan (Opsional)</span>
                  </label>
                )}
                <div className="flex items-center gap-1.5 bg-dark-50 border border-dark-200 rounded-lg px-2.5 py-1">
                  <span className="text-xs font-medium text-dark-600">Tanggal Dokumen:</span>
                  <input
                    type="date"
                    value={tglCetakDokumen}
                    onChange={(e) => setTglCetakDokumen(e.target.value)}
                    className="text-xs bg-white border border-dark-300 rounded px-1.5 py-0.5 text-dark-800 focus:outline-none focus:ring-1 focus:ring-bps-blue"
                    title="Pilih tanggal cetak dokumen (tanggal tanda tangan otomatis menyesuaikan)"
                  />
                </div>
                <button onClick={handlePrint} className="btn-primary text-xs py-2 px-3">
                  <Printer className="w-4 h-4" /> Cetak Dokumen
                </button>
                <button onClick={() => setShowPrintPreview(false)} className="btn-secondary text-xs py-2 px-3">
                  Tutup
                </button>
              </div>
            </div>

            {/* Injeksi Style Cetak: Kartu Kendali Harus A4 LANDSCAPE Penuh 1 Halaman Bersih */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                @page {
                  size: A4 landscape !important;
                  margin: 5mm 6mm 5mm 6mm !important;
                }
                html, body {
                  width: 100% !important;
                  height: auto !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: #ffffff !important;
                  color: #000000 !important;
                  overflow: visible !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                header, aside, nav, .no-print {
                  display: none !important;
                }
                .fixed.inset-0 {
                  position: static !important;
                  background: transparent !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  display: block !important;
                  width: 100% !important;
                  height: auto !important;
                  overflow: visible !important;
                }
                .max-w-5xl, .max-h-\\[92vh\\] {
                  max-width: 100% !important;
                  max-height: none !important;
                  width: 100% !important;
                  height: auto !important;
                  overflow: visible !important;
                  box-shadow: none !important;
                  border-radius: 0 !important;
                  border: none !important;
                  padding: 0 !important;
                  margin: 0 !important;
                }
                #print-area {
                  padding: 0 !important;
                  margin: 0 !important;
                  width: 100% !important;
                  max-width: 100% !important;
                  background: #ffffff !important;
                  box-shadow: none !important;
                  border: none !important;
                  overflow: visible !important;
                  page-break-after: avoid !important;
                  break-after: avoid !important;
                }
                table {
                  width: 100% !important;
                  table-layout: fixed !important;
                  border-collapse: collapse !important;
                }
                th, td {
                  border: 1px solid #000000 !important;
                }
                tr {
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                }
              }
            `}} />

            <div className="p-6 print:p-0 text-black bg-white" id="print-area">
              {/* Kop Surat hanya muncul untuk Daftar Rekapitulasi Persediaan, TIDAK untuk Kartu Kendali */}
              {previewMode === 'daftar' && <KopSurat />}

              {/* JIKA PREVIEW KARTU PERSEDIAAN (PERSIS HALAMAN 3 PDF & EXCEL) */}
              {previewMode === 'kartu' && currentCard && (
                <>
                  <h3 className="text-center font-extrabold text-black mb-3 text-sm uppercase tracking-wider">
                    KARTU PERSEDIAAN BARANG PAKAI HABIS (ATK/ARK)
                  </h3>

                  {/* Identitas Barang & Logo Sesuai Format Gambar Excel */}
                  <div className="grid grid-cols-12 gap-3 mb-3 text-xs text-black items-start">
                    <div className="col-span-4 flex flex-col items-start justify-start pt-0">
                      <div className="flex flex-col items-center text-center">
                        <img src="/images/logo-bps.svg" alt="Logo BPS" className="h-14 w-auto object-contain mb-1" />
                        <div
                          style={{
                            fontFamily: 'Arial, sans-serif',
                            fontSize: '9pt',
                            lineHeight: 1.25,
                          }}
                          className="font-bold italic text-black text-center"
                        >
                          <p>Badan Pusat Statistik</p>
                          <p>Kabupaten Ogan Komering Ulu Selatan</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-5 space-y-0.5 text-[11px] items-start pt-0" style={{ fontFamily: 'Arial, sans-serif' }}>
                      <div className="flex items-center">
                        <span className="w-24 text-black">Nama Barang</span>
                        <span className="w-3 text-center">:</span>
                        <span className="font-bold text-black uppercase">{currentCard.nama_barang}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-24 text-black">Kode Barang</span>
                        <span className="w-3 text-center">:</span>
                        <span className="font-mono text-black">{currentCard.kode_barang || '-'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-24 text-black">Satuan Barang</span>
                        <span className="w-3 text-center">:</span>
                        <span className="text-black">{currentCard.satuan}</span>
                      </div>
                    </div>
                    <div className="col-span-3 space-y-0.5 text-[11px] text-left items-start pt-0" style={{ fontFamily: 'Arial, sans-serif' }}>
                      <div className="flex items-center text-left">
                        <span className="w-20 text-black text-left">Halaman</span>
                        <span className="w-3 text-center">:</span>
                        <span className="text-black text-left">{currentCard.halaman || 1}</span>
                      </div>
                      <div className="flex items-center text-left">
                        <span className="w-20 text-black text-left">Proyek/Rutin</span>
                        <span className="w-3 text-center">:</span>
                        <span className="text-black text-left">{currentCard.proyek_rutin || ''}</span>
                      </div>
                      <div className="flex items-center text-left">
                        <span className="w-20 text-black text-left">Tahun</span>
                        <span className="w-3 text-center">:</span>
                        <span className="font-bold text-black text-left">{currentCard.tahun}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tabel 1: Horizontal 15 Kolom Pengeluaran Tiap Bulan */}
                  <div className="mb-4">
                    <table className="w-full border-collapse border border-black text-center text-[10px]">
                      <thead>
                        <tr className="bg-gray-100 font-bold text-black">
                          <th colSpan={13} className="border border-black py-1 uppercase text-[10px]">
                            Banyaknya Pengeluaran Tiap-Tiap Bulan
                          </th>
                          <th rowSpan={2} className="border border-black px-1.5 py-1 text-[9px] leading-tight w-16">
                            Jumlah Pengeluaran
                          </th>
                          <th rowSpan={2} className="border border-black px-1.5 py-1 text-[9px] leading-tight w-16">
                            Stock Awal tahun
                          </th>
                          <th rowSpan={2} className="border border-black px-1.5 py-1 text-[9px] leading-tight w-16">
                            Stock Akhir tahun
                          </th>
                        </tr>
                        <tr className="bg-gray-50 font-semibold text-black text-[9px]">
                          {BULAN_NAMES.map((bln, idx) => (
                            <th key={idx} className="border border-black px-0.5 py-0.5">
                              {bln}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-black font-semibold text-[10px] h-6">
                          {BULAN_NAMES.map((_, idx) => {
                            const m = idx <= 2 ? idx + 1 : idx;
                            const out = getMonthlyOut(m);
                            const val = idx === 0 ? (out > 0 ? out : '0') : (out > 0 ? out : '');
                            return (
                              <td key={idx} className="border border-black py-1">
                                {val}
                              </td>
                            );
                          })}
                          <td className="border border-black py-1 font-bold">
                            {totalPengeluaranTahunan > 0 ? totalPengeluaranTahunan : ''}
                          </td>
                          <td className="border border-black py-1 font-bold">
                            {stockAwal}
                          </td>
                          <td className="border border-black py-1 font-bold">
                            {totalPengeluaranTahunan > 0 || totalMasuk > 0 ? sisaAkhir : ''}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Tabel 2: Dual-Pane 14 Kolom Persis Halaman 3 PDF */}
                  <div className="mb-2">
                    <table className="w-full border-collapse border border-black text-[9px]">
                      <thead>
                        <tr className="bg-gray-100 font-bold text-black text-center">
                          <th className="border border-black px-1 py-1 w-6">No.</th>
                          <th className="border border-black px-1 py-1 w-16">No. Bon/Faktur</th>
                          <th className="border border-black px-1 py-1 w-14">Tgl M/K</th>
                          <th className="border border-black px-2 py-1 text-left">Uraian Pemasukan/Pengeluaran</th>
                          <th className="border border-black px-1 py-1 w-10">Masuk (M)</th>
                          <th className="border border-black px-1 py-1 w-10">Keluar (K)</th>
                          <th className="border border-black px-1 py-1 w-12">Sisa Barang</th>

                          <th className="border border-black px-1 py-1 w-6">No.</th>
                          <th className="border border-black px-1 py-1 w-16">No. Bon/Faktur</th>
                          <th className="border border-black px-1 py-1 w-14">Tgl M/K</th>
                          <th className="border border-black px-2 py-1 text-left">Uraian Pemasukan/Pengeluaran</th>
                          <th className="border border-black px-1 py-1 w-10">Masuk (M)</th>
                          <th className="border border-black px-1 py-1 w-10">Keluar (K)</th>
                          <th className="border border-black px-1 py-1 w-12">Sisa Barang</th>
                        </tr>
                        <tr className="bg-gray-50 text-[8px] text-gray-600 font-bold text-center">
                          <th className="border border-black py-0.5">(1)</th>
                          <th className="border border-black py-0.5">(2)</th>
                          <th className="border border-black py-0.5">(3)</th>
                          <th className="border border-black py-0.5">(4)</th>
                          <th className="border border-black py-0.5">(5)</th>
                          <th className="border border-black py-0.5">(6)</th>
                          <th className="border border-black py-0.5">(7)</th>
                          <th className="border border-black py-0.5">(8)</th>
                          <th className="border border-black py-0.5">(9)</th>
                          <th className="border border-black py-0.5">(10)</th>
                          <th className="border border-black py-0.5">(11)</th>
                          <th className="border border-black py-0.5">(12)</th>
                          <th className="border border-black py-0.5">(13)</th>
                          <th className="border border-black py-0.5">(14)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: activeRowCount }).map((_, rIdx) => {
                            const left = leftEntries[rIdx];
                            const isPindahanRow = rIdx === 0 && rightEntries.length > 0;
                            const right = rIdx > 0 ? rightEntries[rIdx - 1] : null;

                            return (
                              <tr key={rIdx} className="text-black h-[19px] print:h-[18px]">
                                <td className="border border-black px-1 py-0.5 text-center">
                                  {left ? rIdx + 1 : ''}
                                </td>
                                <td className="border border-black px-1 py-0.5 font-mono text-[8px]">
                                  {left?.no_referensi || ''}
                                </td>
                                <td className="border border-black px-1 py-0.5 text-center">
                                  {left ? formatDateShort(left.tanggal) : ''}
                                </td>
                                <td className="border border-black px-1.5 py-0.5">
                                  {left?.uraian || ''}
                                </td>
                                <td className="border border-black px-1 py-0.5 text-center font-bold">
                                  {left && left.masuk > 0 ? left.masuk : (left ? '-' : '')}
                                </td>
                                <td className="border border-black px-1 py-0.5 text-center font-bold">
                                  {left && left.keluar > 0 ? left.keluar : (left ? '-' : '')}
                                </td>
                                <td className="border border-black px-1 py-0.5 text-center font-bold">
                                  {left ? left.sisa : ''}
                                </td>

                                {isPindahanRow ? (
                                  <>
                                    <td colSpan={4} className="border border-black px-2 py-0.5 font-medium">
                                      Pindahan
                                    </td>
                                    <td className="border border-black px-1 py-0.5 text-center font-bold"></td>
                                    <td className="border border-black px-1 py-0.5 text-center font-bold"></td>
                                    <td className="border border-black px-1 py-0.5 text-center font-bold">
                                      {leftEntries.length > 0 ? leftLastSisa : ''}
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td className="border border-black px-1 py-0.5 text-center font-medium">
                                      {right ? leftEntries.length + rIdx : ''}
                                    </td>
                                    <td className="border border-black px-1 py-0.5 font-mono text-[8px]">
                                      {right?.no_referensi || ''}
                                    </td>
                                    <td className="border border-black px-1 py-0.5 text-center">
                                      {right ? formatDateShort(right.tanggal) : ''}
                                    </td>
                                    <td className="border border-black px-1.5 py-0.5">
                                      {right?.uraian || ''}
                                    </td>
                                    <td className="border border-black px-1 py-0.5 text-center font-bold">
                                      {right && right.masuk > 0 ? right.masuk : (right ? '-' : '')}
                                    </td>
                                    <td className="border border-black px-1 py-0.5 text-center font-bold">
                                      {right && right.keluar > 0 ? right.keluar : (right ? '-' : '')}
                                    </td>
                                    <td className="border border-black px-1 py-0.5 text-center font-bold">
                                      {right ? right.sisa : ''}
                                    </td>
                                  </>
                                )}
                              </tr>
                            );
                          })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-100 font-bold text-black">
                          <td colSpan={4} className="border border-black px-1.5 py-1 text-center uppercase text-[9px]">
                            JUMLAH (dipindahkan)
                          </td>
                          <td className="border border-black px-1 py-1 text-center font-bold">
                            {leftTotalMasuk > 0 ? leftTotalMasuk : ''}
                          </td>
                          <td className="border border-black px-1 py-1 text-center font-bold">
                            {leftTotalKeluar > 0 ? leftTotalKeluar : ''}
                          </td>
                          <td className="border border-black px-1 py-1 text-center font-bold">
                            {leftEntries.length > 0 ? leftLastSisa : ''}
                          </td>

                          <td colSpan={4} className="border border-black px-1.5 py-1 text-center uppercase text-[9px]">
                            JUMLAH (dipindahkan)
                          </td>
                          <td className="border border-black px-1 py-1 text-center font-bold">
                            {rightEntries.length > 0 && rightTotalMasuk > 0 ? rightTotalMasuk : ''}
                          </td>
                          <td className="border border-black px-1 py-1 text-center font-bold">
                            {rightEntries.length > 0 && rightTotalKeluar > 0 ? rightTotalKeluar : ''}
                          </td>
                          <td className="border border-black px-1 py-1 text-center font-bold">
                            {rightEntries.length > 0 ? sisaAkhir : ''}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Tanda Tangan Resmi Sesuai Format BPS (Opsional untuk Kartu Kendali) */}
                  {tampilkanTandaTanganKartu && (
                    <div className="w-full flex items-start justify-between text-xs text-black mt-3 pt-1 print:mt-2">
                      <div className="w-72 text-center flex flex-col items-center">
                        <p className="font-semibold text-black">Mengetahui,</p>
                        <p className="font-medium text-black">Kuasa Pengguna Barang</p>
                        <p className="font-medium text-black">Kepala BPS Kabupaten OKU Selatan</p>
                        <div className="h-11 print:h-9" />
                        <p className="text-center">
                          <span className="font-bold border-b border-black text-black pb-0.5 inline-block">
                            Rival Abdul Jabar, S.ST., M.Si.
                          </span>
                        </p>
                        <p className="text-[11px] mt-0.5 font-medium text-black text-center">NIP. 19831122 200701 1003</p>
                      </div>
                      <div className="w-72 text-center flex flex-col items-center">
                        <p className="font-medium text-black">
                          {formatTanggalTandaTangan(tglCetakDokumen)}
                        </p>
                        <p className="font-semibold text-black">Petugas Pengelola Persediaan</p>
                        <p className="text-transparent select-none font-medium">-</p>
                        <div className="h-11 print:h-9" />
                        <p className="text-center">
                          <span className="font-bold border-b border-black text-black pb-0.5 inline-block">
                            Guspita Karleni, S.Si
                          </span>
                        </p>
                        <p className="text-[11px] mt-0.5 font-medium text-black text-center">NIP. 19970806 202521 2039</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* JIKA PREVIEW DAFTAR PERSEDIAAN (PERSIS HALAMAN 1 & 2 PDF) */}
              {previewMode === 'daftar' && (
                <>
                  <div className="text-center mb-5">
                    <h3 className="font-extrabold text-black text-sm uppercase tracking-wide">
                      DAFTAR PERSEDIAAN BARANG PER 1 JANUARI {selectedYear}
                    </h3>
                    <p className="text-xs text-gray-700 mt-1">
                      Badan Pusat Statistik Kabupaten Ogan Komering Ulu Selatan
                    </p>
                  </div>

                  <table className="w-full border-collapse border border-black text-[9px] mb-8">
                    <thead>
                      <tr className="bg-gray-100 font-bold text-black text-center">
                        <th className="border border-black px-1 py-1 w-10">Nomor</th>
                        <th className="border border-black px-1.5 py-1 w-16">KODE</th>
                        <th className="border border-black px-2 py-1 text-left">U R A I A N</th>
                        <th className="border border-black px-2 py-1 text-center w-28">JUMLAH Saldo 1 Januari</th>
                        <th className="border border-black px-1.5 py-1 text-center w-16">MASUK</th>
                        <th className="border border-black px-1.5 py-1 text-center w-16">KELUAR</th>
                        <th className="border border-black px-1.5 py-1 text-center w-16">Satuan</th>
                        <th className="border border-black px-2 py-1 text-center w-20">Sisa Akhir</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DATA_DAFTAR_PERSEDIAAN_PDF1.map((item) => {
                        const sisa = item.saldo_1_januari + item.masuk - item.keluar;
                        return (
                          <tr key={item.nomor} className="text-black">
                            <td className="border border-black px-1 py-0.5 text-center">{item.nomor}</td>
                            <td className="border border-black px-1.5 py-0.5 text-center font-mono">{item.kode}</td>
                            <td className="border border-black px-2 py-0.5">{item.uraian}</td>
                            <td className="border border-black px-2 py-0.5 text-center font-semibold">
                              {formatNumber(item.saldo_1_januari)}
                            </td>
                            <td className="border border-black px-1.5 py-0.5 text-center">
                              {item.masuk > 0 ? formatNumber(item.masuk) : '-'}
                            </td>
                            <td className="border border-black px-1.5 py-0.5 text-center font-semibold">
                              {item.keluar > 0 ? formatNumber(item.keluar) : '0'}
                            </td>
                            <td className="border border-black px-1.5 py-0.5 text-center">{item.satuan}</td>
                            <td className="border border-black px-2 py-0.5 text-center font-bold">
                              {formatNumber(sisa)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Tanda Tangan Resmi Sesuai Format BPS - Garis Mengikuti Panjang Nama */}
                  <div className="w-full flex items-start justify-between text-xs text-black mt-8 pt-2">
                    <div className="w-72 text-center flex flex-col items-center">
                      <p className="font-semibold text-black">Mengetahui,</p>
                      <p className="font-medium text-black">Kuasa Pengguna Barang</p>
                      <p className="font-medium text-black">Kepala BPS Kabupaten OKU Selatan</p>
                      <div className="h-16" />
                      <p className="text-center">
                        <span className="font-bold border-b border-black text-black pb-0.5 inline-block">
                          Rival Abdul Jabar, S.ST., M.Si.
                        </span>
                      </p>
                      <p className="text-[11px] mt-1 font-medium text-black text-center">NIP. 19831122 200701 1003</p>
                    </div>
                    <div className="w-72 text-center flex flex-col items-center">
                      <p className="font-medium text-black">{formatTanggalTandaTangan(tglCetakDokumen)}</p>
                      <p className="font-semibold text-black">Petugas Pengelola Persediaan</p>
                      <p className="text-transparent select-none font-medium">-</p>
                      <div className="h-16" />
                      <p className="text-center">
                        <span className="font-bold border-b border-black text-black pb-0.5 inline-block">
                          Guspita Karleni, S.Si
                        </span>
                      </p>
                      <p className="text-[11px] mt-1 font-medium text-black text-center">NIP. 19970806 202521 2039</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL INPUT MUTASI LANGSUNG (MASUK / KELUAR)              */}
      {/* Data otomatis ditulis ke transaksi_masuk / transaksi_keluar */}
      {/* ======================================================== */}
      {showInputModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-in-up overflow-hidden">
            {/* Header Modal */}
            <div className={cn(
              'px-6 py-4 flex items-center justify-between',
              inputJenis === 'masuk'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white'
                : 'bg-gradient-to-r from-bps-blue to-blue-500 text-white'
            )}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  {inputJenis === 'masuk'
                    ? <ArrowDownToLine className="w-5 h-5" />
                    : <ArrowUpFromLine className="w-5 h-5" />
                  }
                </div>
                <div>
                  <h2 className="text-base font-bold">
                    {inputJenis === 'masuk' ? 'Input Barang Masuk' : 'Input Barang Keluar'}
                  </h2>
                  <p className="text-xs opacity-80">
                    Barang: <strong>{activeBarang?.nama_barang}</strong> ({activeBarang?.kode_barang})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInputModal(false)}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveInput} className="p-6 space-y-4">
              {/* Toggle Jenis */}
              <div>
                <label className="block text-xs font-bold text-dark-700 mb-1.5">Jenis Mutasi</label>
                <div className="flex items-center bg-dark-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setInputJenis('masuk')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all',
                      inputJenis === 'masuk' ? 'bg-emerald-600 text-white shadow-sm' : 'text-dark-500 hover:text-dark-800'
                    )}
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    Barang Masuk
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputJenis('keluar')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all',
                      inputJenis === 'keluar' ? 'bg-bps-blue text-white shadow-sm' : 'text-dark-500 hover:text-dark-800'
                    )}
                  >
                    <ArrowUpFromLine className="w-3.5 h-3.5" />
                    Barang Keluar
                  </button>
                </div>
              </div>

              {/* Tanggal & No Referensi */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-dark-700 mb-1.5">Tanggal</label>
                  <input
                    type="date"
                    value={inputTanggal}
                    onChange={e => setInputTanggal(e.target.value)}
                    className="input py-2 text-xs w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark-700 mb-1.5">
                    {inputJenis === 'masuk' ? 'No. Bon/Faktur' : 'No. SPB'}
                  </label>
                  <input
                    type="text"
                    value={inputNoReferensi}
                    onChange={e => setInputNoReferensi(e.target.value)}
                    className="input py-2 text-xs w-full"
                    placeholder={inputJenis === 'masuk' ? 'BAST/001/X/2026' : 'SPB/001/X/2026'}
                  />
                </div>
              </div>

              {/* Jumlah */}
              <div>
                <label className="block text-xs font-bold text-dark-700 mb-1.5">
                  Jumlah ({activeBarang?.satuan?.nama_satuan || 'Buah'})
                </label>
                <input
                  type="number"
                  min="1"
                  value={inputJumlah}
                  onChange={e => setInputJumlah(Number(e.target.value))}
                  className="input py-2 text-xs w-full font-bold text-lg"
                  required
                />
              </div>

              {/* Harga Satuan (hanya untuk masuk) */}
              {inputJenis === 'masuk' && (
                <div>
                  <label className="block text-xs font-bold text-dark-700 mb-1.5">Harga Satuan (Rp) — Opsional</label>
                  <input
                    type="number"
                    min="0"
                    value={inputHargaSatuan}
                    onChange={e => setInputHargaSatuan(Number(e.target.value))}
                    className="input py-2 text-xs w-full"
                    placeholder="0"
                  />
                </div>
              )}

              {/* Tim Pemohon (hanya untuk keluar) */}
              {inputJenis === 'keluar' && (
                <div>
                  <label className="block text-xs font-bold text-dark-700 mb-1.5">Tim Pemohon</label>
                  <select
                    value={inputTimPemohon}
                    onChange={e => setInputTimPemohon(e.target.value)}
                    className="input py-2 text-xs w-full"
                  >
                    {TIM_PEMOHON_LIST.map(tim => (
                      <option key={tim.id} value={tim.id}>{tim.nama_tim} — {tim.penanggung_jawab}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Uraian / Keterangan */}
              <div>
                <label className="block text-xs font-bold text-dark-700 mb-1.5">Uraian / Keterangan</label>
                <textarea
                  value={inputUraian}
                  onChange={e => setInputUraian(e.target.value)}
                  className="input py-2 text-xs w-full h-16 resize-none"
                  placeholder={inputJenis === 'masuk' ? 'Contoh: Penerimaan pembelian Q4' : 'Contoh: Keperluan operasional tim'}
                />
              </div>

              {/* Preview Efek */}
              <div className={cn(
                'rounded-xl p-3 text-xs border',
                inputJenis === 'masuk'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              )}>
                <strong>Preview:</strong> Sisa saat ini = <strong>{formatNumber(sisaAkhir)}</strong>
                {inputJenis === 'masuk'
                  ? <> + {inputJumlah} = <strong className="text-emerald-700">{formatNumber(sisaAkhir + inputJumlah)}</strong></>
                  : <> − {inputJumlah} = <strong className="text-amber-700">{formatNumber(Math.max(0, sisaAkhir - inputJumlah))}</strong></>
                }
                {' '}{activeBarang?.satuan?.nama_satuan || 'Buah'}
              </div>

              {/* Peringatan jika keluar melebihi stok */}
              {inputJenis === 'keluar' && inputJumlah > sisaAkhir && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Jumlah keluar (<strong>{inputJumlah}</strong>) melebihi sisa barang (<strong>{sisaAkhir}</strong>). Stok akan menjadi 0.</span>
                </div>
              )}

              {/* Tombol Simpan */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className={cn(
                    'flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg transition-all duration-200',
                    inputJenis === 'masuk'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-bps-blue hover:bg-bps-blue-700'
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {inputJenis === 'masuk' ? 'Simpan & Catat Masuk' : 'Simpan & Catat Keluar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowInputModal(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-dark-600 bg-dark-100 hover:bg-dark-200 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
