'use client';

import { useState, useEffect } from 'react';
import {
  FileBarChart, Printer, Edit2, Check,
  Package, ArrowDownToLine, ArrowUpFromLine, Wallet, X, Layers, Users, ShieldCheck,
} from 'lucide-react';
import { DATA_REKAPITULASI_AGUSTUS, type RekapitulasiAgustusItem } from '@/lib/data-rekapitulasi-agustus';
import { mockBarang, mockTransaksiMasuk, mockTransaksiKeluar } from '@/lib/mock-data';
import type { Barang, TransaksiMasuk, TransaksiKeluar } from '@/types';
import { cn, formatNumber, getMonthName, getTeksBeritaAcaraOpname, formatTanggalTandaTangan } from '@/lib/utils';
import KopSurat from '@/components/KopSurat';
import {
  fetchAndSyncBarang,
  fetchAndSyncTransaksiKeluar,
  fetchAndSyncTransaksiMasuk,
} from '@/lib/sync-service';

export default function LaporanPage() {
  // Default difokuskan ke Bulan Berjalan (Oktober 2026)
  const [bulan, setBulan] = useState(10);
  const [tahun, setTahun] = useState(2026);
  const [activeTab, setActiveTab] = useState<'opname' | 'tim'>('opname');
  const [showPreview, setShowPreview] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  // Tanggal Cetak Dinamis - default hari ini, bisa disesuaikan
  const [tglCetakDokumen, setTglCetakDokumen] = useState(() => new Date().toISOString().split('T')[0]);

  // Helper untuk menentukan teks kolom Saldo Awal secara dinamis (misal: Saldo 30 September 2026)
  const getSaldoAwalHeader = (b: number, t: number) => {
    const lastDayPrev = new Date(t, b - 1, 0);
    const day = lastDayPrev.getDate();
    const mName = getMonthName(lastDayPrev.getMonth() + 1);
    const yr = lastDayPrev.getFullYear();
    return `Saldo ${day} ${mName} ${yr}`;
  };

  // Dynamic Data Lists dari LocalStorage
  const [barangList, setBarangList] = useState<Barang[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sipersedia_barang_list');
      if (stored !== null) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
      }
    }
    return mockBarang;
  });
  const [transaksiMasukList, setTransaksiMasukList] = useState<TransaksiMasuk[]>([...mockTransaksiMasuk]);
  const [transaksiKeluarList, setTransaksiKeluarList] = useState<TransaksiKeluar[]>([...mockTransaksiKeluar]);

  useEffect(() => {
    const bSaved = localStorage.getItem('sipersedia_barang_list');
    if (bSaved !== null) {
      try {
        const p = JSON.parse(bSaved);
        if (Array.isArray(p)) setBarangList(p);
      } catch (e) {}
    }
    const mSaved = localStorage.getItem('sipersedia_transaksi_masuk');
    if (mSaved) {
      try {
        const p = JSON.parse(mSaved);
        if (Array.isArray(p)) setTransaksiMasukList(p);
      } catch (e) {}
    }
    const kSaved = localStorage.getItem('sipersedia_transaksi_keluar');
    if (kSaved) {
      try {
        const p = JSON.parse(kSaved);
        if (Array.isArray(p)) setTransaksiKeluarList(p);
      } catch (e) {}
    }

    // Sinkronisasi data cloud terbaru
    let curBarang = barangList;
    fetchAndSyncBarang().then((bData) => {
      if (bData && bData.length > 0) {
        curBarang = bData;
        setBarangList(bData);
      }
    });
    fetchAndSyncTransaksiKeluar(curBarang).then((kData) => {
      if (kData) setTransaksiKeluarList(kData);
    });
    fetchAndSyncTransaksiMasuk(curBarang).then((mData) => {
      if (mData) setTransaksiMasukList(mData);
    });
  }, []);

  // Hitung Data Rekapitulasi sesuai bulan dan transaksi aktif
  const getComputedReportData = (targetBulan: number, targetTahun: number): RekapitulasiAgustusItem[] => {
    // Cek jika ada simpanan hasil edit manual dari pengguna di localStorage
    const customKey = `sipersedia_laporan_data_${targetBulan}_${targetTahun}`;
    if (typeof window !== 'undefined') {
      const savedCustom = localStorage.getItem(customKey);
      if (savedCustom) {
        try {
          const parsed = JSON.parse(savedCustom);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed
              .filter((item: RekapitulasiAgustusItem) => (item.total_persediaan || 0) > 0)
              .map((item: RekapitulasiAgustusItem, idx: number) => ({ ...item, no: idx + 1 }));
          }
        } catch (e) {}
      }
    }

    const matchesMonthYear = (tgl: string, m: number, y: number) => {
      if (!tgl) return false;
      const d = new Date(tgl);
      if (isNaN(d.getTime())) return false;
      return d.getMonth() + 1 === m && d.getFullYear() === y;
    };

    const itemsToProcess = barangList.length > 0 ? barangList : mockBarang;

    return itemsToProcess.map((b, i) => {
      const agustusBase = DATA_REKAPITULASI_AGUSTUS.find(
        item => item.uraian_barang.toLowerCase() === b.nama_barang.toLowerCase()
      );

      // Mutasi untuk bulan tertentu
      const getMonthMutasi = (m: number, y: number) => {
        let beli = 0;
        let transfer = 0;
        let keluar = 0;
        let rusak = 0;
        let usang = 0;
        const tim = { umum: 0, sosial: 0, ipds: 0, pertanian: 0, distribusi: 0, neraca: 0, pek: 0 };

        // Data resmi BPS untuk Agustus 2026
        if (m === 8 && y === 2026 && agustusBase) {
          beli += agustusBase.pembelian;
          transfer += agustusBase.transfer_masuk;
          keluar += agustusBase.pengeluaran;
          rusak += agustusBase.barang_rusak || 0;
          usang += agustusBase.barang_usang || 0;
          if (agustusBase.tim) {
            tim.umum += agustusBase.tim.umum;
            tim.sosial += agustusBase.tim.sosial;
            tim.ipds += agustusBase.tim.ipds;
            tim.pertanian += agustusBase.tim.pertanian;
            tim.distribusi += agustusBase.tim.distribusi;
            tim.neraca += agustusBase.tim.neraca;
            tim.pek += agustusBase.tim.pek;
          }
        }

        // Transaksi masuk dari database / form
        transaksiMasukList.forEach(t => {
          if (matchesMonthYear(t.tanggal, m, y)) {
            if (m === 8 && y === 2026 && mockTransaksiMasuk.some(mock => mock.id === t.id)) return;
            const itm = t.items?.find(item => item.id_barang === b.id || item.barang?.nama_barang?.toLowerCase() === b.nama_barang.toLowerCase());
            if (itm) {
              if (t.sumber === 'Pembelian') beli += itm.jumlah;
              else transfer += itm.jumlah;
            }
          }
        });

        // Transaksi keluar dari database / form
        transaksiKeluarList.forEach(t => {
          if (matchesMonthYear(t.tanggal, m, y)) {
            if (m === 8 && y === 2026 && mockTransaksiKeluar.some(mock => mock.id === t.id)) return;
            const itm = t.items?.find(item => item.id_barang === b.id || item.barang?.nama_barang?.toLowerCase() === b.nama_barang.toLowerCase());
            if (itm) {
              keluar += itm.jumlah;
              const jns = itm.jenis_pengeluaran || t.jenis_pengeluaran || 'habis_pakai';
              if (jns === 'rusak') rusak += itm.jumlah;
              else if (jns === 'usang') usang += itm.jumlah;

              const timName = (t.tim_pemohon || t.nama_tim || '').toLowerCase();
              if (timName.includes('umum')) tim.umum += itm.jumlah;
              else if (timName.includes('sosial')) tim.sosial += itm.jumlah;
              else if (timName.includes('ipds')) tim.ipds += itm.jumlah;
              else if (timName.includes('tani') || timName.includes('pertanian')) tim.pertanian += itm.jumlah;
              else if (timName.includes('dist')) tim.distribusi += itm.jumlah;
              else if (timName.includes('neraca') || timName.includes('nerwilis')) tim.neraca += itm.jumlah;
              else if (timName.includes('pek') || timName.includes('ktip')) tim.pek += itm.jumlah;
            }
          }
        });

        return { beli, transfer, keluar, rusak, usang, tim };
      };

      let saldoAwal = 0;
      let pembelian = 0;
      let transferMasuk = 0;
      let pengeluaran = 0;
      let barangRusak = 0;
      let barangUsang = 0;
      let timDist = { umum: 0, sosial: 0, ipds: 0, pertanian: 0, distribusi: 0, neraca: 0, pek: 0 };

      if (targetTahun === 2026 && targetBulan >= 8) {
        let runningStock = agustusBase ? agustusBase.saldo_juli : b.stok;

        // Roll-forward bulan demi bulan hingga bulan target
        for (let m = 8; m < targetBulan; m++) {
          const mutasi = getMonthMutasi(m, targetTahun);
          runningStock = Math.max(0, runningStock + mutasi.beli + mutasi.transfer - mutasi.keluar);
        }

        saldoAwal = runningStock;

        const curMutasi = getMonthMutasi(targetBulan, targetTahun);
        pembelian = curMutasi.beli;
        transferMasuk = curMutasi.transfer;
        pengeluaran = curMutasi.keluar;
        barangRusak = curMutasi.rusak;
        barangUsang = curMutasi.usang;
        timDist = curMutasi.tim;
      } else {
        const curMutasi = getMonthMutasi(targetBulan, targetTahun);
        saldoAwal = Math.max(0, b.stok - curMutasi.beli - curMutasi.transfer + curMutasi.keluar);
        pembelian = curMutasi.beli;
        transferMasuk = curMutasi.transfer;
        pengeluaran = curMutasi.keluar;
        barangRusak = curMutasi.rusak;
        barangUsang = curMutasi.usang;
        timDist = curMutasi.tim;
      }

      const total = Math.max(0, saldoAwal + pembelian + transferMasuk - pengeluaran);

      return {
        no: i + 1,
        uraian_barang: b.nama_barang,
        satuan: b.satuan?.nama_satuan || 'Buah',
        saldo_juli: saldoAwal, // Menyimpan nilai saldo awal periode
        pembelian,
        transfer_masuk: transferMasuk,
        pengeluaran,
        total_persediaan: total,
        barang_rusak: barangRusak,
        barang_usang: barangUsang,
        tim: {
          ...timDist,
          sisa: total,
        },
      };
    })
    .filter(item => item.total_persediaan > 0)
    .map((item, idx) => ({
      ...item,
      no: idx + 1,
    }));
  };

  // Data Rekapitulasi State
  const [reportData, setReportData] = useState<RekapitulasiAgustusItem[]>([]);

  useEffect(() => {
    setReportData(getComputedReportData(bulan, tahun));
  }, [bulan, tahun, barangList, transaksiMasukList, transaksiKeluarList]);

  // Handler jika ganti bulan
  const handleBulanChange = (newBulan: number) => {
    setBulan(newBulan);
    setEditIdx(null);
    const lastDay = new Date(tahun, newBulan, 0).getDate();
    setTglCetakDokumen(`${tahun}-${String(newBulan).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`);
  };

  // Handler jika ganti tahun
  const handleTahunChange = (newTahun: number) => {
    setTahun(newTahun);
    setEditIdx(null);
    const lastDay = new Date(newTahun, bulan, 0).getDate();
    setTglCetakDokumen(`${newTahun}-${String(bulan).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`);
  };

  // STRICT FILTER: Barang yang total persediaannya 0 (habis) dihilangkan dari laporan & nomor urut berurutan runtut
  const activeReportData = reportData
    .filter((item) => Number(item.total_persediaan || 0) > 0)
    .map((item, idx) => ({ ...item, no: idx + 1 }));

  // Ringkasan Total bersumber dari activeReportData
  const totalSaldoAwal = activeReportData.reduce((s, i) => s + (i.saldo_juli || 0), 0);
  const totalPembelian = activeReportData.reduce((s, i) => s + (i.pembelian || 0), 0);
  const totalTransferMasuk = activeReportData.reduce((s, i) => s + (i.transfer_masuk || 0), 0);
  const totalPengeluaran = activeReportData.reduce((s, i) => s + (i.pengeluaran || 0), 0);
  const totalPersediaan = activeReportData.reduce((s, i) => s + (i.total_persediaan || 0), 0);
  const totalRusak = activeReportData.reduce((s, i) => s + (i.barang_rusak || 0), 0);
  const totalUsang = activeReportData.reduce((s, i) => s + (i.barang_usang || 0), 0);

  // Edit Baris & Mode Edit Global
  const handleEditRow = (idx: number) => {
    setEditIdx(idx);
  };

  const handleSaveRow = () => {
    setEditIdx(null);
    const cleaned = reportData
      .filter((i) => Number(i.total_persediaan || 0) > 0)
      .map((item, idx) => ({ ...item, no: idx + 1 }));
    setReportData(cleaned);
    localStorage.setItem(`sipersedia_laporan_data_${bulan}_${tahun}`, JSON.stringify(cleaned));
    setToastNotification('Perubahan baris berhasil disimpan!');
    setTimeout(() => setToastNotification(null), 3000);
  };

  const handleToggleEditMode = () => {
    if (isEditMode) {
      setEditIdx(null);
      const cleaned = reportData
        .filter((i) => Number(i.total_persediaan || 0) > 0)
        .map((item, idx) => ({ ...item, no: idx + 1 }));
      setReportData(cleaned);
      localStorage.setItem(`sipersedia_laporan_data_${bulan}_${tahun}`, JSON.stringify(cleaned));
      setToastNotification('✅ Perubahan data laporan berhasil disimpan ke sistem!');
      setTimeout(() => setToastNotification(null), 3500);
    }
    setIsEditMode(!isEditMode);
  };

  const handleResetDefault = () => {
    localStorage.removeItem(`sipersedia_laporan_data_${bulan}_${tahun}`);
    setReportData(getComputedReportData(bulan, tahun));
    setIsEditMode(false);
    setEditIdx(null);
    setToastNotification('Data laporan dikembalikan ke nilai awal BPS.');
    setTimeout(() => setToastNotification(null), 3500);
  };

  const handleFieldChange = (idx: number, field: keyof RekapitulasiAgustusItem, value: number) => {
    setReportData(prev => {
      const updated = [...prev];
      const item = { ...updated[idx] };
      (item as any)[field] = value;
      // Rumus otomatis: Saldo Awal + Pembelian + Transfer Masuk - Pengeluaran
      item.total_persediaan = (item.saldo_juli || 0) + (item.pembelian || 0) + (item.transfer_masuk || 0) - (item.pengeluaran || 0);
      updated[idx] = item;
      return updated;
    });
  };

  // Pengaturan Responsif Cetak agar 1 Halaman Full A4 Menyesuaikan Jumlah Baris
  const rowCount = activeReportData.length;
  const printCellPadding =
    rowCount <= 6
      ? 'print:py-3.5'
      : rowCount <= 10
      ? 'print:py-2.5'
      : rowCount <= 16
      ? 'print:py-1.5'
      : 'print:py-1';

  const printTableFontSize =
    rowCount <= 10 ? 'print:text-[10pt]' : rowCount <= 16 ? 'print:text-[9.5pt]' : 'print:text-[8.5pt]';

  const printSigMargin = 'print:mt-auto';

  const printSigSpace =
    rowCount <= 6 ? 'print:h-24' : rowCount <= 10 ? 'print:h-20' : rowCount <= 16 ? 'print:h-16' : 'print:h-12';

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = ' ';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="page-enter space-y-6">
      {/* Konten Dashboard (Disembunyikan saat mencetak dokumen) */}
      <div className="print:hidden space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Laporan Persediaan &amp; Stock Opname</h1>
          <p className="text-sm text-dark-400 mt-1">
            Rekapitulasi fisik persediaan barang bulanan — Berita Acara &amp; Rincian per Tim Kerja
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Tombol Edit di Sebelah Cetak (Poin 7 Revisi Mentor) */}
          <button
            onClick={handleToggleEditMode}
            className={cn(
              "btn-secondary flex items-center gap-1.5 transition-all text-xs font-bold py-2.5 px-3.5",
              isEditMode
                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm"
                : "hover:bg-dark-50 text-dark-700"
            )}
            title="Edit angka fisik laporan persediaan"
          >
            {isEditMode ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4 text-bps-blue" />}
            <span>{isEditMode ? 'Simpan & Selesai Edit' : 'Edit Laporan'}</span>
          </button>
          <button onClick={() => setShowPreview(true)} className="btn-primary">
            <Printer className="w-4 h-4" />
            Cetak {activeTab === 'opname' ? 'Berita Acara Opname' : 'Rekapitulasi Tim'}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-slide-in-up">
          <Check className="w-4 h-4" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Filter Periode & Mode Tab */}
      <div className="card p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="input-label">Periode Rekapitulasi (Bulan)</label>
              <select
                value={bulan}
                onChange={(e) => handleBulanChange(Number(e.target.value))}
                className="input w-52 font-semibold text-bps-blue"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {getMonthName(i + 1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">Tahun</label>
              <select value={tahun} onChange={(e) => handleTahunChange(Number(e.target.value))} className="input w-32 font-semibold">
                {[2025, 2026, 2027].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowPreview(true)}
              className="btn-secondary"
            >
              <FileBarChart className="w-4 h-4" />
              Preview Cetak
            </button>
          </div>

          {/* Toggle Tab Tampilan Laporan */}
          <div className="flex items-center bg-dark-100 p-1 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab('opname')}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all',
                activeTab === 'opname'
                  ? 'bg-white text-bps-blue shadow-sm'
                  : 'text-dark-500 hover:text-dark-800'
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              Berita Acara Opname Fisik
            </button>
            <button
              onClick={() => setActiveTab('tim')}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all',
                activeTab === 'tim'
                  ? 'bg-white text-bps-blue shadow-sm'
                  : 'text-dark-500 hover:text-dark-800'
              )}
            >
              <Users className="w-3.5 h-3.5" />
              Rekapitulasi per Tim (Sakernas/Susenas)
            </button>
          </div>
        </div>

        <div className="bg-bps-blue-50 border border-bps-blue-200 rounded-lg p-3 text-xs text-bps-blue-800 flex items-center justify-between">
          <span>
            ℹ️ Menampilkan <strong>{activeReportData.length} item barang</strong> resmi dari Rekapitulasi Persediaan BPS Kabupaten OKU Selatan — Periode <strong>{getMonthName(bulan)} {tahun}</strong>.
          </span>
          <span className="font-semibold text-bps-blue">Status: Sinkron &amp; Terverifikasi</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-blue-50 flex items-center justify-center">
            <Package className="w-5 h-5 text-bps-blue" />
          </div>
          <div>
            <p className="text-xl font-bold text-dark-800">{reportData.length}</p>
            <p className="text-xs text-dark-400">Total Jenis Barang</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-green-50 flex items-center justify-center">
            <ArrowDownToLine className="w-5 h-5 text-bps-green" />
          </div>
          <div>
            <p className="text-xl font-bold text-bps-green">{totalPembelian + totalTransferMasuk}</p>
            <p className="text-xs text-dark-400">Total Masuk ({getMonthName(bulan)})</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-orange-50 flex items-center justify-center">
            <ArrowUpFromLine className="w-5 h-5 text-bps-orange" />
          </div>
          <div>
            <p className="text-xl font-bold text-bps-orange">{totalPengeluaran}</p>
            <p className="text-xs text-dark-400">Total Pengeluaran</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-teal-50 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-bps-teal" />
          </div>
          <div>
            <p className="text-xl font-bold text-dark-800">{formatNumber(totalPersediaan)}</p>
            <p className="text-xs text-dark-400">Sisa Persediaan Fisik</p>
          </div>
        </div>
      </div>

      {/* TAB 1: Berita Acara Hasil Opname Phisik (Stock Opname) */}
      {activeTab === 'opname' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-100 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-dark-800">
                Berita Acara Hasil Opname Phisik Persediaan — {getMonthName(bulan)} {tahun}
              </h2>
              <p className="text-xs text-dark-400 mt-0.5">
                Formula: {getSaldoAwalHeader(bulan, tahun)} + Pembelian + Transfer Masuk - Pengeluaran = Total Persediaan
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleEditMode}
                className={cn(
                  "btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1.5 font-bold transition-all",
                  isEditMode
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm"
                    : "text-dark-700 hover:bg-dark-50"
                )}
                title="Edit data fisik laporan"
              >
                {isEditMode ? <Check className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5 text-bps-blue" />}
                <span>{isEditMode ? 'Simpan & Selesai' : 'Edit Laporan'}</span>
              </button>
              <button onClick={() => setShowPreview(true)} className="btn-primary text-xs py-1.5 px-3">
                <Printer className="w-3.5 h-3.5" />
                Cetak Berita Acara
              </button>
            </div>
          </div>

          {/* Banner Informasi Mode Edit */}
          {isEditMode && (
            <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-3 text-xs text-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>
                  <strong>Mode Edit Laporan Aktif:</strong> Anda dapat langsung mengedit angka saldo, masuk, dan keluar pada tabel. Kolom <strong>Total Persediaan</strong> otomatis terkalkulasi. Klik <strong>Simpan &amp; Selesai</strong> di sebelah tombol Cetak jika telah selesai.
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="text-xs text-rose-600 hover:text-rose-800 hover:underline font-semibold"
                >
                  Reset ke Data Semula
                </button>
                <button
                  type="button"
                  onClick={handleToggleEditMode}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-xs shadow-xs"
                >
                  Simpan Semua
                </button>
              </div>
            </div>
          )}

          <div className="table-container border-0 max-h-[600px] overflow-y-auto">
            <table>
              <thead className="sticky top-0 bg-dark-50 z-10 shadow-sm">
                <tr>
                  <th className="w-12 text-center">No</th>
                  <th>Uraian Barang</th>
                  <th className="text-center w-24">Satuan</th>
                  <th className="text-center w-28">{getSaldoAwalHeader(bulan, tahun)}</th>
                  <th className="text-center w-24 text-bps-blue-700">Pembelian</th>
                  <th className="text-center w-24 text-bps-green-700">Transfer Masuk</th>
                  <th className="text-center w-24 text-bps-orange-700">Pengeluaran</th>
                  <th className="text-center w-28 font-bold">Total Persediaan</th>
                  <th className="text-center w-20">Rusak</th>
                  <th className="text-center w-20">Usang</th>
                  <th className="w-20 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {(isEditMode ? reportData : activeReportData).map((item, idx) => (
                  <tr key={idx} className={item.pengeluaran > 0 ? 'bg-bps-orange-50/20' : ''}>
                    <td className="text-center text-dark-400 text-xs font-semibold">{item.no}</td>
                    <td className="font-medium text-dark-800 text-xs">{item.uraian_barang}</td>
                    <td className="text-center text-dark-600 text-xs">{item.satuan}</td>

                    {/* Saldo Juli */}
                    <td className="text-center text-xs">
                      {isEditMode || editIdx === idx ? (
                        <input
                          type="number"
                          className="input w-16 text-center py-0.5 px-1 text-xs"
                          value={item.saldo_juli}
                          onChange={(e) => handleFieldChange(idx, 'saldo_juli', Number(e.target.value))}
                        />
                      ) : (
                        item.saldo_juli || '-'
                      )}
                    </td>

                    {/* Pembelian */}
                    <td className="text-center text-xs text-bps-blue font-semibold">
                      {isEditMode || editIdx === idx ? (
                        <input
                          type="number"
                          className="input w-16 text-center py-0.5 px-1 text-xs"
                          value={item.pembelian}
                          onChange={(e) => handleFieldChange(idx, 'pembelian', Number(e.target.value))}
                        />
                      ) : (
                        item.pembelian || '-'
                      )}
                    </td>

                    {/* Transfer Masuk */}
                    <td className="text-center text-xs text-bps-green font-semibold">
                      {isEditMode || editIdx === idx ? (
                        <input
                          type="number"
                          className="input w-16 text-center py-0.5 px-1 text-xs"
                          value={item.transfer_masuk}
                          onChange={(e) => handleFieldChange(idx, 'transfer_masuk', Number(e.target.value))}
                        />
                      ) : (
                        item.transfer_masuk || '-'
                      )}
                    </td>

                    {/* Pengeluaran */}
                    <td className="text-center text-xs text-bps-orange font-bold">
                      {isEditMode || editIdx === idx ? (
                        <input
                          type="number"
                          className="input w-16 text-center py-0.5 px-1 text-xs"
                          value={item.pengeluaran}
                          onChange={(e) => handleFieldChange(idx, 'pengeluaran', Number(e.target.value))}
                        />
                      ) : (
                        item.pengeluaran || '-'
                      )}
                    </td>

                    {/* Total Persediaan */}
                    <td className="text-center text-xs font-bold text-dark-900 bg-dark-50/50">
                      {item.total_persediaan}
                    </td>

                    {/* Rusak */}
                    <td className="text-center text-xs text-dark-400">
                      {isEditMode || editIdx === idx ? (
                        <input
                          type="number"
                          className="input w-14 text-center py-0.5 px-1 text-xs"
                          value={item.barang_rusak}
                          onChange={(e) => handleFieldChange(idx, 'barang_rusak', Number(e.target.value))}
                        />
                      ) : (
                        item.barang_rusak || '-'
                      )}
                    </td>

                    {/* Usang */}
                    <td className="text-center text-xs text-dark-400">
                      {isEditMode || editIdx === idx ? (
                        <input
                          type="number"
                          className="input w-14 text-center py-0.5 px-1 text-xs"
                          value={item.barang_usang}
                          onChange={(e) => handleFieldChange(idx, 'barang_usang', Number(e.target.value))}
                        />
                      ) : (
                        item.barang_usang || '-'
                      )}
                    </td>

                    {/* Tombol Edit di sebelah cetak (Poin 7 Revisi) */}
                    <td className="text-center">
                      {editIdx === idx ? (
                        <button
                          onClick={handleSaveRow}
                          className="inline-flex items-center gap-1 bg-bps-green text-white text-[11px] font-bold py-1 px-2 rounded hover:bg-bps-green-600 transition-colors shadow-sm"
                          title="Simpan perubahan baris ini"
                        >
                          <Check className="w-3 h-3" /> Simpan
                        </button>
                      ) : isEditMode ? (
                        <button
                          onClick={handleSaveRow}
                          className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-semibold py-1 px-1.5 rounded hover:bg-emerald-700 transition-colors"
                          title="Simpan baris"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditRow(idx)}
                          className="p-1 rounded text-dark-400 hover:bg-bps-blue-50 hover:text-bps-blue transition-colors"
                          title="Edit baris ini"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="sticky bottom-0 bg-dark-100 font-bold text-xs shadow-md">
                <tr>
                  <td colSpan={3} className="text-right px-4 py-2 text-dark-700">TOTAL</td>
                  <td className="text-center px-2 py-2">{formatNumber(totalSaldoAwal)}</td>
                  <td className="text-center px-2 py-2 text-bps-blue">{formatNumber(totalPembelian)}</td>
                  <td className="text-center px-2 py-2 text-bps-green">{formatNumber(totalTransferMasuk)}</td>
                  <td className="text-center px-2 py-2 text-bps-orange">{formatNumber(totalPengeluaran)}</td>
                  <td className="text-center px-2 py-2 text-dark-900 font-extrabold">{formatNumber(totalPersediaan)}</td>
                  <td className="text-center px-2 py-2 text-dark-500">{totalRusak}</td>
                  <td className="text-center px-2 py-2 text-dark-500">{totalUsang}</td>
                  <td className="text-center"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Rincian Pengeluaran per Tim Kerja (Format Excel Mbak Guspita Sakernas/Susenas SE) */}
      {activeTab === 'tim' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-100 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-dark-800">
                Rekapitulasi Pengeluaran Barang per Tim — {getMonthName(bulan)} {tahun}
              </h2>
              <p className="text-xs text-dark-400 mt-0.5">
                Distribusi pemakaian barang untuk kegiatan Sakernas, Susenas, SE, dan Operasional Rutin
              </p>
            </div>
            <button onClick={() => setShowPreview(true)} className="btn-primary text-xs py-1.5 px-3">
              <Printer className="w-3.5 h-3.5" />
              Cetak Rekapitulasi Tim
            </button>
          </div>

          <div className="table-container border-0 max-h-[600px] overflow-y-auto">
            <table>
              <thead className="sticky top-0 bg-dark-50 z-10 shadow-sm text-[11px]">
                <tr>
                  <th rowSpan={2} className="w-10 text-center">No</th>
                  <th rowSpan={2}>Uraian Barang</th>
                  <th rowSpan={2} className="text-center text-bps-orange-700 bg-bps-orange-50/50">Total Keluar</th>
                  <th colSpan={7} className="text-center bg-bps-blue-50/50 text-bps-blue-800">
                    Rincian Alokasi per Tim Kerja
                  </th>
                  <th rowSpan={2} className="text-center w-20">Satuan</th>
                  <th rowSpan={2} className="text-center w-16">Sisa</th>
                </tr>
                <tr>
                  <th className="text-center text-dark-700">Subbag Umum</th>
                  <th className="text-center text-dark-700">Sosial</th>
                  <th className="text-center text-dark-700">IPDS</th>
                  <th className="text-center text-dark-700">Pertanian</th>
                  <th className="text-center text-dark-700">Distribusi</th>
                  <th className="text-center text-dark-700">Neraca</th>
                  <th className="text-center text-dark-700">PEK/KTIP</th>
                </tr>
              </thead>
              <tbody>
                {activeReportData.map((item, idx) => (
                  <tr key={idx} className={item.pengeluaran > 0 ? 'bg-bps-blue-50/10' : ''}>
                    <td className="text-center text-dark-400 text-xs">{item.no}</td>
                    <td className="font-medium text-dark-800 text-xs">{item.uraian_barang}</td>
                    <td className="text-center font-bold text-bps-orange text-xs bg-bps-orange-50/30">
                      {item.pengeluaran > 0 ? item.pengeluaran : '-'}
                    </td>
                    <td className="text-center text-xs text-dark-600">{item.tim?.umum || '-'}</td>
                    <td className="text-center text-xs text-dark-600">{item.tim?.sosial || '-'}</td>
                    <td className="text-center text-xs text-dark-600">{item.tim?.ipds || '-'}</td>
                    <td className="text-center text-xs text-dark-600">{item.tim?.pertanian || '-'}</td>
                    <td className="text-center text-xs text-dark-600">{item.tim?.distribusi || '-'}</td>
                    <td className="text-center text-xs text-dark-600">{item.tim?.neraca || '-'}</td>
                    <td className="text-center text-xs text-dark-600">{item.tim?.pek || '-'}</td>
                    <td className="text-center text-xs text-dark-500">{item.satuan}</td>
                    <td className="text-center text-xs font-semibold text-dark-700">{item.tim?.sisa || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>

      {/* Modal Preview Cetak — Sesuai Format File 1 Gambar Dokumen Mbak Guspita */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-center justify-between p-4 border-b border-dark-100 no-print sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <FileBarChart className="w-5 h-5 text-bps-blue" />
                <h2 className="text-base font-bold text-dark-800">
                  {activeTab === 'opname'
                    ? 'Preview Cetak: Berita Acara Hasil Opname Phisik Persediaan'
                    : 'Preview Cetak: Rekapitulasi Pengeluaran per Tim Kerja'}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-dark-50 border border-dark-200 rounded-lg px-2.5 py-1">
                  <span className="text-xs font-medium text-dark-600">Tanggal Dokumen:</span>
                  <input
                    type="date"
                    value={tglCetakDokumen}
                    onChange={(e) => setTglCetakDokumen(e.target.value)}
                    className="text-xs bg-white border border-dark-300 rounded px-1.5 py-0.5 text-dark-800 focus:outline-none focus:ring-1 focus:ring-bps-blue"
                    title="Pilih tanggal cetak (hari dan tanggal pada dokumen akan menyesuaikan otomatis)"
                  />
                </div>
                <button onClick={handlePrint} className="btn-primary text-xs py-2 px-3">
                  <Printer className="w-4 h-4" /> Cetak Dokumen
                </button>
                <button onClick={() => setShowPreview(false)} className="p-1.5 rounded-lg text-dark-400 hover:bg-dark-50">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
              @page {
                size: A4 portrait;
                margin: 0;
              }
              @media print {
                @page {
                  size: A4 portrait;
                  margin: 0;
                }
                html, body {
                  margin: 0 !important;
                  padding: 0 !important;
                  background: #ffffff !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                .avoid-break {
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                }
                #print-area {
                  padding: 10mm 12mm 10mm 12mm !important;
                  width: 100% !important;
                  height: 295mm !important;
                  min-height: 295mm !important;
                  max-height: 295mm !important;
                  display: flex !important;
                  flex-direction: column !important;
                  justify-content: space-between !important;
                  box-sizing: border-box !important;
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                }
                table {
                  page-break-inside: auto !important;
                }
                tr {
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                }
              }
            `}} />

            <div className="p-8 print:p-0 text-black bg-white" id="print-area">
              {/* Kop Surat hanya muncul untuk Rekapitulasi Tim, TIDAK untuk Berita Acara Opname */}
              {activeTab === 'tim' && <KopSurat />}

              {/* Judul & Pengantar Resmi Berita Acara - Diberikan jarak / spasi jelas dan proporsional */}
              <div className="text-center mb-4 print:mb-2">
                <h3 className="font-extrabold text-sm md:text-base tracking-wide text-black uppercase mb-2 print:mb-1.5">
                  BERITA ACARA HASIL OPNAME PHISIK (STOCK OPNAME) PERSEDIAAN
                </h3>
                <p
                  style={{ textIndent: '2.5rem' }}
                  className="text-xs print:text-[9.5pt] text-black mb-3 print:mb-2 leading-relaxed text-justify max-w-4xl mx-auto"
                >
                  {getTeksBeritaAcaraOpname(tglCetakDokumen)}
                </p>
              </div>

              {/* TAMPILAN CETAK TABEL 1: BERITA ACARA OPNAME PHISIK (Menyesuaikan Jumlah Baris) */}
              {activeTab === 'opname' && (
                <table className={cn("w-full border-collapse border border-black text-[9.5px] mb-4 print:mb-3", printTableFontSize)}>
                  <thead>
                    <tr className="bg-gray-100 text-black font-bold text-center">
                      <th className="border border-black px-1.5 py-1.5 print:py-2.5 w-8 print:w-7">No.</th>
                      <th className="border border-black px-2 py-1.5 print:py-2.5 text-center">Uraian Barang</th>
                      <th className="border border-black px-1.5 py-1.5 print:py-2.5 text-center w-14 print:w-13">Satuan</th>
                      <th className="border border-black px-1.5 py-1.5 print:py-2.5 text-center w-16 print:w-16">{getSaldoAwalHeader(bulan, tahun)}</th>
                      <th className="border border-black px-1.5 py-1.5 print:py-2.5 text-center w-14 print:w-14">Pembelian</th>
                      <th className="border border-black px-1.5 py-1.5 print:py-2.5 text-center w-16 print:w-16">Transfer Masuk {getMonthName(bulan)}</th>
                      <th className="border border-black px-1.5 py-1.5 print:py-2.5 text-center w-16 print:w-16">Pengeluaran {getMonthName(bulan)}</th>
                      <th className="border border-black px-1.5 py-1.5 print:py-2.5 text-center w-16 print:w-16">Total Persediaan</th>
                      <th className="border border-black px-1.5 py-1.5 print:py-2.5 text-center w-12 print:w-11">Barang Rusak</th>
                      <th className="border border-black px-1.5 py-1.5 print:py-2.5 text-center w-12 print:w-11">Barang Usang</th>
                    </tr>
                    {/* Baris penomoran (1)-(10): Ramping */}
                    <tr className="bg-gray-50 text-[7.5px] print:text-[8pt] text-gray-700 font-semibold text-center h-4 leading-none">
                      <th className="border border-black py-0.5 px-0.5 leading-none">(1)</th>
                      <th className="border border-black py-0.5 px-0.5 leading-none">(2)</th>
                      <th className="border border-black py-0.5 px-0.5 leading-none">(3)</th>
                      <th className="border border-black py-0.5 px-0.5 leading-none">(4)</th>
                      <th className="border border-black py-0.5 px-0.5 leading-none">(5)</th>
                      <th className="border border-black py-0.5 px-0.5 leading-none">(6)</th>
                      <th className="border border-black py-0.5 px-0.5 leading-none">(7)</th>
                      <th className="border border-black py-0.5 px-0.5 whitespace-nowrap text-[6.5px] print:text-[7pt] tracking-tighter leading-none">(8)=(4)+(5)+(6)-(7)</th>
                      <th className="border border-black py-0.5 px-0.5 leading-none">(9)</th>
                      <th className="border border-black py-0.5 px-0.5 leading-none">(10)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeReportData.map((item) => (
                      <tr key={item.no} className="text-black leading-normal">
                        <td className={cn("border border-black px-1.5 py-1.5 text-center", printCellPadding)}>{item.no}</td>
                        <td className={cn("border border-black px-2 py-1.5 font-medium", printCellPadding)}>{item.uraian_barang}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center", printCellPadding)}>{item.satuan}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center", printCellPadding)}>{item.saldo_juli || '-'}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center", printCellPadding)}>{item.pembelian || '-'}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center", printCellPadding)}>{item.transfer_masuk || '-'}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center font-semibold", printCellPadding)}>{item.pengeluaran || '-'}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center font-bold", printCellPadding)}>{item.total_persediaan}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center", printCellPadding)}>{item.barang_rusak || ''}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center", printCellPadding)}>{item.barang_usang || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* TAMPILAN CETAK TABEL 2: RINCIAN PER TIM KERJA */}
              {activeTab === 'tim' && (
                <table className={cn("w-full border-collapse border border-black text-[9.5px] mb-4 print:mb-3", printTableFontSize)}>
                  <thead>
                    <tr className="bg-gray-100 text-black font-bold text-center">
                      <th rowSpan={2} className="border border-black px-1 py-1.5 w-7">No.</th>
                      <th rowSpan={2} className="border border-black px-1.5 py-1.5 text-center">Uraian Barang</th>
                      <th rowSpan={2} className="border border-black px-1.5 py-1.5 text-center w-14">Pengeluaran</th>
                      <th colSpan={7} className="border border-black px-1.5 py-1.5 text-center">Rincian Tim Kerja</th>
                      <th rowSpan={2} className="border border-black px-1 py-1.5 text-center w-12">Satuan</th>
                      <th rowSpan={2} className="border border-black px-1.5 py-1.5 text-center w-10">Sisa</th>
                    </tr>
                    <tr className="bg-gray-50 text-[7.5px] print:text-[8pt] text-gray-700 font-bold text-center h-3">
                      <th className="border border-black px-1 py-0.5">Subbag Umum</th>
                      <th className="border border-black px-1 py-0.5">Tim Sosial</th>
                      <th className="border border-black px-1 py-0.5">IPDS</th>
                      <th className="border border-black px-1 py-0.5">Pertanian</th>
                      <th className="border border-black px-1 py-0.5">Distribusi</th>
                      <th className="border border-black px-1 py-0.5">Neraca</th>
                      <th className="border border-black px-1 py-0.5">Tim PEK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeReportData.map((item) => (
                      <tr key={item.no} className="text-black leading-normal">
                        <td className={cn("border border-black px-1.5 py-1.5 text-center", printCellPadding)}>{item.no}</td>
                        <td className={cn("border border-black px-2 py-1.5 font-medium", printCellPadding)}>{item.uraian_barang}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center font-bold", printCellPadding)}>{item.pengeluaran || '-'}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center", printCellPadding)}>{item.tim?.umum || '-'}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center", printCellPadding)}>{item.tim?.sosial || '-'}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center", printCellPadding)}>{item.tim?.ipds || '-'}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center", printCellPadding)}>{item.tim?.pertanian || '-'}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center", printCellPadding)}>{item.tim?.distribusi || '-'}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center", printCellPadding)}>{item.tim?.neraca || '-'}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center", printCellPadding)}>{item.tim?.pek || '-'}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center", printCellPadding)}>{item.satuan}</td>
                        <td className={cn("border border-black px-1.5 py-1.5 text-center font-medium", printCellPadding)}>{item.tim?.sisa || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Tanda Tangan Resmi Sesuai Format BPS - Jarak Proporsional Mengisi Halaman A4 Sampai Bawah */}
              <div className={cn("w-full flex items-start justify-between text-xs print:text-[10.5pt] text-black pt-2 avoid-break", printSigMargin)}>
                {/* Kolom Kiri: Mengetahui KPB */}
                <div className="w-72 text-center flex flex-col items-center">
                  <p className="font-semibold text-black leading-tight">Mengetahui,</p>
                  <p className="font-medium text-black leading-tight">Kuasa Pengguna Barang</p>
                  <p className="font-medium text-black leading-tight">Kepala BPS Kabupaten OKU Selatan</p>
                  <div className={cn("h-16", printSigSpace)} />
                  <p className="text-center">
                    <span className="font-bold border-b border-black text-black pb-0.5 inline-block">
                      Rival Abdul Jabar, S.ST., M.Si.
                    </span>
                  </p>
                  <p className="text-[10.5px] print:text-[9.5pt] mt-0.5 font-medium text-black text-center">NIP. 19831122 200701 1003</p>
                </div>

                {/* Kolom Kanan: Petugas Pengelola Persediaan */}
                <div className="w-72 text-center flex flex-col items-center">
                  <p className="font-medium text-black leading-tight">{formatTanggalTandaTangan(tglCetakDokumen)}</p>
                  <p className="font-semibold text-black leading-tight">Petugas Pengelola Persediaan</p>
                  <p className="text-transparent select-none font-medium leading-tight">-</p>
                  <div className={cn("h-16", printSigSpace)} />
                  <p className="text-center">
                    <span className="font-bold border-b border-black text-black pb-0.5 inline-block">
                      Guspita Karleni, S.Si
                    </span>
                  </p>
                  <p className="text-[10.5px] print:text-[9.5pt] mt-0.5 font-medium text-black text-center">NIP. 19970806 202521 2039</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
