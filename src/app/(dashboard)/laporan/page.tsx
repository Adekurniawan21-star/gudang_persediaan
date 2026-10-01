'use client';

import { useState } from 'react';
import {
  FileBarChart, Printer, Edit2,
  Package, ArrowDownToLine, ArrowUpFromLine, Wallet, X,
} from 'lucide-react';
import { mockBarang } from '@/lib/mock-data';
import { cn, formatCurrency, formatNumber, getMonthName, formatDate } from '@/lib/utils';

export default function LaporanPage() {
  const currentDate = new Date();
  const [bulan, setBulan] = useState(currentDate.getMonth() + 1);
  const [tahun, setTahun] = useState(currentDate.getFullYear());
  const [showPreview, setShowPreview] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  // Generate report data — format Rekapitulasi Fisik
  const [reportData, setReportData] = useState(() =>
    mockBarang.map(b => {
      const saldoAwal = b.stok + Math.floor(Math.random() * 20);
      const pembelian = Math.floor(Math.random() * 20) + 5;
      const transferMasuk = Math.floor(Math.random() * 10);
      const pengeluaran = Math.floor(Math.random() * 15) + 2;
      const totalPersediaan = saldoAwal + pembelian + transferMasuk - pengeluaran;
      return {
        id_barang: b.id,
        nama_barang: b.nama_barang,
        kode_barang: b.kode_barang,
        satuan: b.satuan?.nama_satuan || '-',
        saldo_awal: saldoAwal,
        pembelian,
        transfer_masuk: transferMasuk,
        pengeluaran,
        total_persediaan: totalPersediaan,
        barang_rusak: Math.floor(Math.random() * 3),
        barang_usang: Math.floor(Math.random() * 2),
      };
    })
  );

  const totalSaldoAwal = reportData.reduce((s, i) => s + i.saldo_awal, 0);
  const totalPembelian = reportData.reduce((s, i) => s + i.pembelian, 0);
  const totalTransferMasuk = reportData.reduce((s, i) => s + i.transfer_masuk, 0);
  const totalPengeluaran = reportData.reduce((s, i) => s + i.pengeluaran, 0);
  const totalPersediaan = reportData.reduce((s, i) => s + i.total_persediaan, 0);
  const totalRusak = reportData.reduce((s, i) => s + i.barang_rusak, 0);
  const totalUsang = reportData.reduce((s, i) => s + i.barang_usang, 0);

  const handleEditRow = (idx: number) => {
    setEditIdx(idx);
  };

  const handleSaveRow = () => {
    setEditIdx(null);
  };

  const handleFieldChange = (idx: number, field: string, value: number) => {
    setReportData(prev => {
      const updated = [...prev];
      (updated[idx] as any)[field] = value;
      // Recalculate total
      updated[idx].total_persediaan =
        updated[idx].saldo_awal + updated[idx].pembelian + updated[idx].transfer_masuk - updated[idx].pengeluaran;
      return updated;
    });
  };

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Laporan Persediaan</h1>
          <p className="text-sm text-dark-400 mt-1">Rekapitulasi fisik persediaan barang bulanan</p>
        </div>
      </div>

      {/* Period selector */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-dark-700 mb-3">Pilih Periode Laporan</h3>
        <div className="flex flex-col sm:flex-row items-end gap-3">
          <div>
            <label className="input-label">Bulan</label>
            <select value={bulan} onChange={(e) => setBulan(Number(e.target.value))} className="input w-48">
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">Tahun</label>
            <select value={tahun} onChange={(e) => setTahun(Number(e.target.value))} className="input w-32">
              {[2024, 2025, 2026].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button onClick={() => setShowPreview(true)} className="btn-primary">
            <FileBarChart className="w-4 h-4" />
            Generate Laporan
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-blue-50 flex items-center justify-center">
            <Package className="w-5 h-5 text-bps-blue" />
          </div>
          <div>
            <p className="text-xl font-bold text-dark-800">{reportData.length}</p>
            <p className="text-xs text-dark-400">Jenis Barang</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-green-50 flex items-center justify-center">
            <ArrowDownToLine className="w-5 h-5 text-bps-green" />
          </div>
          <div>
            <p className="text-xl font-bold text-bps-green">{totalPembelian + totalTransferMasuk}</p>
            <p className="text-xs text-dark-400">Total Masuk</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-orange-50 flex items-center justify-center">
            <ArrowUpFromLine className="w-5 h-5 text-bps-orange" />
          </div>
          <div>
            <p className="text-xl font-bold text-bps-orange">{totalPengeluaran}</p>
            <p className="text-xs text-dark-400">Total Keluar</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-teal-50 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-bps-teal" />
          </div>
          <div>
            <p className="text-lg font-bold text-dark-800">{totalPersediaan}</p>
            <p className="text-xs text-dark-400">Total Persediaan</p>
          </div>
        </div>
      </div>

      {/* Report table — format rekapitulasi fisik */}
      <div className="card">
        <div className="px-5 py-4 border-b border-dark-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-dark-800">
              Rekapitulasi Persediaan — {getMonthName(bulan)} {tahun}
            </h2>
            <p className="text-xs text-dark-400 mt-0.5">Saldo Awal + Pembelian + Transfer Masuk - Pengeluaran = Total</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPreview(true)} className="btn-secondary text-sm">
              <Printer className="w-4 h-4" />
              Cetak
            </button>
          </div>
        </div>
        <div className="table-container border-0">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Uraian Barang</th>
                <th>Satuan</th>
                <th className="text-center">Saldo Awal</th>
                <th className="text-center text-bps-blue-700">Pembelian</th>
                <th className="text-center text-bps-green-700">Transfer Masuk</th>
                <th className="text-center text-bps-orange-700">Pengeluaran</th>
                <th className="text-center">Total Persediaan</th>
                <th className="text-center">Brg Rusak</th>
                <th className="text-center">Brg Usang</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, idx) => (
                <tr key={idx}>
                  <td className="text-dark-400">{idx + 1}</td>
                  <td className="font-medium text-dark-700">{item.nama_barang}</td>
                  <td className="text-dark-500">{item.satuan}</td>
                  <td className="text-center text-dark-600">
                    {editIdx === idx ? (
                      <input type="number" className="input w-16 text-center py-1 text-xs" value={item.saldo_awal}
                        onChange={(e) => handleFieldChange(idx, 'saldo_awal', Number(e.target.value))} />
                    ) : item.saldo_awal}
                  </td>
                  <td className="text-center font-semibold text-bps-blue">
                    {editIdx === idx ? (
                      <input type="number" className="input w-16 text-center py-1 text-xs" value={item.pembelian}
                        onChange={(e) => handleFieldChange(idx, 'pembelian', Number(e.target.value))} />
                    ) : item.pembelian}
                  </td>
                  <td className="text-center font-semibold text-bps-green">
                    {editIdx === idx ? (
                      <input type="number" className="input w-16 text-center py-1 text-xs" value={item.transfer_masuk}
                        onChange={(e) => handleFieldChange(idx, 'transfer_masuk', Number(e.target.value))} />
                    ) : item.transfer_masuk}
                  </td>
                  <td className="text-center font-semibold text-bps-orange">
                    {editIdx === idx ? (
                      <input type="number" className="input w-16 text-center py-1 text-xs" value={item.pengeluaran}
                        onChange={(e) => handleFieldChange(idx, 'pengeluaran', Number(e.target.value))} />
                    ) : item.pengeluaran}
                  </td>
                  <td className="text-center font-bold text-dark-800">{item.total_persediaan}</td>
                  <td className="text-center text-dark-400">
                    {editIdx === idx ? (
                      <input type="number" className="input w-16 text-center py-1 text-xs" value={item.barang_rusak}
                        onChange={(e) => handleFieldChange(idx, 'barang_rusak', Number(e.target.value))} />
                    ) : item.barang_rusak}
                  </td>
                  <td className="text-center text-dark-400">
                    {editIdx === idx ? (
                      <input type="number" className="input w-16 text-center py-1 text-xs" value={item.barang_usang}
                        onChange={(e) => handleFieldChange(idx, 'barang_usang', Number(e.target.value))} />
                    ) : item.barang_usang}
                  </td>
                  <td>
                    {editIdx === idx ? (
                      <button onClick={handleSaveRow} className="btn-success text-xs py-1 px-2">Simpan</button>
                    ) : (
                      <button onClick={() => handleEditRow(idx)} className="p-1.5 rounded-md text-dark-400 hover:bg-bps-blue-50 hover:text-bps-blue transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-dark-50 font-semibold">
                <td colSpan={3} className="text-right text-dark-700 px-4 py-3">TOTAL</td>
                <td className="text-center text-dark-600 px-4 py-3">{totalSaldoAwal}</td>
                <td className="text-center text-bps-blue px-4 py-3">{totalPembelian}</td>
                <td className="text-center text-bps-green px-4 py-3">{totalTransferMasuk}</td>
                <td className="text-center text-bps-orange px-4 py-3">{totalPengeluaran}</td>
                <td className="text-center text-dark-800 px-4 py-3 font-bold">{totalPersediaan}</td>
                <td className="text-center text-dark-400 px-4 py-3">{totalRusak}</td>
                <td className="text-center text-dark-400 px-4 py-3">{totalUsang}</td>
                <td className="px-4 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Print Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-center justify-between p-5 border-b border-dark-100 no-print sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-dark-800">Preview Rekapitulasi Persediaan</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="btn-primary text-sm">
                  <Printer className="w-4 h-4" /> Cetak
                </button>
                <button onClick={() => setShowPreview(false)} className="btn-secondary text-sm">Tutup</button>
              </div>
            </div>
            <div className="p-8">
              {/* KOP SURAT RESMI BPS */}
              <div className="text-center border-b-[3px] border-dark-800 pb-3 mb-4">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <img
                    src="/images/logo-bps.svg"
                    alt="Logo BPS"
                    className="w-14 h-14 object-contain"
                  />
                  <div>
                    <p className="text-xs text-dark-600 tracking-wider font-semibold">BADAN PUSAT STATISTIK</p>
                    <h3 className="text-base font-bold text-dark-800">KABUPATEN OGAN KOMERING ULU SELATAN</h3>
                    <p className="text-[10px] text-dark-400 mt-0.5">Jalan Raya R.A Kartini. 3,5 Kecamatan Buay Rawan</p>
                    <p className="text-[10px] text-dark-400">Homepage: http://okuselatankab.bps.go.id | Email: bps1608@bps.go.id</p>
                  </div>
                </div>
              </div>

              <h4 className="text-center font-bold text-dark-800 mb-1 text-base underline underline-offset-4">
                REKAPITULASI PERSEDIAAN BARANG
              </h4>
              <p className="text-center text-sm text-dark-500 mb-6">Periode: {getMonthName(bulan)} {tahun}</p>

              <table className="w-full border border-dark-300 text-[11px] mb-8">
                <thead>
                  <tr className="bg-dark-100">
                    <th className="border border-dark-300 px-2 py-1.5 text-center">No</th>
                    <th className="border border-dark-300 px-2 py-1.5 text-left">Uraian Barang</th>
                    <th className="border border-dark-300 px-2 py-1.5 text-center">Satuan</th>
                    <th className="border border-dark-300 px-2 py-1.5 text-center">Saldo Awal</th>
                    <th className="border border-dark-300 px-2 py-1.5 text-center">Pembelian</th>
                    <th className="border border-dark-300 px-2 py-1.5 text-center">Transfer Masuk</th>
                    <th className="border border-dark-300 px-2 py-1.5 text-center">Pengeluaran</th>
                    <th className="border border-dark-300 px-2 py-1.5 text-center">Total Persediaan (Fisik)</th>
                    <th className="border border-dark-300 px-2 py-1.5 text-center">Brg Rusak</th>
                    <th className="border border-dark-300 px-2 py-1.5 text-center">Brg Usang</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border border-dark-300 px-2 py-1 text-center">{idx + 1}</td>
                      <td className="border border-dark-300 px-2 py-1">{item.nama_barang}</td>
                      <td className="border border-dark-300 px-2 py-1 text-center">{item.satuan}</td>
                      <td className="border border-dark-300 px-2 py-1 text-center">{item.saldo_awal}</td>
                      <td className="border border-dark-300 px-2 py-1 text-center">{item.pembelian}</td>
                      <td className="border border-dark-300 px-2 py-1 text-center">{item.transfer_masuk}</td>
                      <td className="border border-dark-300 px-2 py-1 text-center">{item.pengeluaran}</td>
                      <td className="border border-dark-300 px-2 py-1 text-center font-semibold">{item.total_persediaan}</td>
                      <td className="border border-dark-300 px-2 py-1 text-center">{item.barang_rusak}</td>
                      <td className="border border-dark-300 px-2 py-1 text-center">{item.barang_usang}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-dark-100 font-bold">
                    <td colSpan={3} className="border border-dark-300 px-2 py-1.5 text-right">TOTAL</td>
                    <td className="border border-dark-300 px-2 py-1.5 text-center">{totalSaldoAwal}</td>
                    <td className="border border-dark-300 px-2 py-1.5 text-center">{totalPembelian}</td>
                    <td className="border border-dark-300 px-2 py-1.5 text-center">{totalTransferMasuk}</td>
                    <td className="border border-dark-300 px-2 py-1.5 text-center">{totalPengeluaran}</td>
                    <td className="border border-dark-300 px-2 py-1.5 text-center">{totalPersediaan}</td>
                    <td className="border border-dark-300 px-2 py-1.5 text-center">{totalRusak}</td>
                    <td className="border border-dark-300 px-2 py-1.5 text-center">{totalUsang}</td>
                  </tr>
                </tfoot>
              </table>

              <div className="grid grid-cols-3 gap-8 mt-12 text-sm text-center">
                <div>
                  <p className="text-dark-500">Dibuat oleh,</p>
                  <p className="text-xs text-dark-400">Admin Persediaan</p>
                  <div className="h-16" />
                  <p className="font-medium text-dark-800 border-b border-dark-300 inline-block px-4">Admin Persediaan</p>
                </div>
                <div>
                  <p className="text-dark-500">Mengetahui,</p>
                  <p className="text-xs text-dark-400">Kasubbag Umum</p>
                  <div className="h-16" />
                  <p className="font-medium text-dark-800 border-b border-dark-300 inline-block px-4">(............................)</p>
                </div>
                <div>
                  <p className="text-dark-500">Menyetujui,</p>
                  <p className="text-xs text-dark-400">Kepala BPS Kab. OKU Selatan</p>
                  <div className="h-16" />
                  <p className="font-medium text-dark-800 border-b border-dark-300 inline-block px-4">RIVAL ABDUL JABAR, S.ST., M.Si.</p>
                  <p className="text-xs text-dark-400 mt-1">NIP. ........................</p>
                </div>
              </div>

              <div className="text-right text-xs text-dark-400 mt-8 pt-4 border-t border-dark-200">
                Dicetak pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
