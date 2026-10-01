'use client';

import { useState } from 'react';
import {
  ArrowDownToLine, Plus, Search, Printer, Edit2, Trash2,
  FileText, Calendar, X,
} from 'lucide-react';
import { mockTransaksiMasuk, mockBarang } from '@/lib/mock-data';
import type { TransaksiMasuk, SumberBarangMasuk } from '@/types';
import { cn, formatCurrency, formatDateShort, formatDate } from '@/lib/utils';

export default function TransaksiMasukPage() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrintPreview, setShowPrintPreview] = useState<TransaksiMasuk | null>(null);
  const [editItem, setEditItem] = useState<TransaksiMasuk | null>(null);
  const [formSumber, setFormSumber] = useState<SumberBarangMasuk>('Pembelian');

  const filtered = mockTransaksiMasuk.filter(t =>
    t.no_dokumen.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.no_referensi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.items.some(item => item.barang?.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalItemsBulanIni = filtered.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.jumlah, 0), 0);
  const totalNilaiBulanIni = filtered.reduce((sum, t) =>
    sum + t.items.reduce((s, i) => s + (i.harga_satuan || 0) * i.jumlah, 0), 0);

  const handleEdit = (trx: TransaksiMasuk) => {
    setEditItem(trx);
    setFormSumber(trx.sumber);
    setShowModal(true);
  };

  const handleDelete = (trx: TransaksiMasuk) => {
    if (confirm(`Hapus transaksi ${trx.no_dokumen}?`)) {
      alert('Demo: Transaksi akan dihapus dari database');
    }
  };

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Transaksi Masuk</h1>
          <p className="text-sm text-dark-400 mt-1">Catat barang masuk dari pembelian atau transfer dari provinsi</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setEditItem(null); setFormSumber('Pembelian'); setShowModal(true); }} className="btn-primary">
            <Plus className="w-4 h-4" />
            Tambah Transaksi
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-green-50 flex items-center justify-center">
            <ArrowDownToLine className="w-5 h-5 text-bps-green" />
          </div>
          <div>
            <p className="text-xl font-bold text-dark-800">{filtered.length}</p>
            <p className="text-xs text-dark-400">Transaksi Bulan Ini</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-blue-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-bps-blue" />
          </div>
          <div>
            <p className="text-xl font-bold text-dark-800">{totalItemsBulanIni}</p>
            <p className="text-xs text-dark-400">Total Item Masuk</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-teal-50 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-bps-teal" />
          </div>
          <div>
            <p className="text-xl font-bold text-dark-800">{formatCurrency(totalNilaiBulanIni)}</p>
            <p className="text-xs text-dark-400">Nilai Bulan Ini</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
            placeholder="Cari no dokumen, no BAST, atau nama barang..."
          />
        </div>
      </div>

      {/* Table — per No Dokumen (Master-Detail) */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No. Dokumen</th>
                <th>Tanggal</th>
                <th>Sumber</th>
                <th>No. Referensi</th>
                <th>Barang</th>
                <th>Keterangan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((trx) => (
                <tr key={trx.id}>
                  <td>
                    <span className="font-mono text-xs font-medium text-bps-blue bg-bps-blue-50 px-2 py-1 rounded">
                      {trx.no_dokumen}
                    </span>
                  </td>
                  <td className="text-sm text-dark-500">{formatDateShort(trx.tanggal)}</td>
                  <td>
                    <span className={cn(
                      'badge',
                      trx.sumber === 'Pembelian' && 'bg-bps-blue-50 text-bps-blue-700',
                      trx.sumber === 'Transfer Masuk' && 'bg-bps-green-50 text-bps-green-700',
                    )}>
                      {trx.sumber}
                    </span>
                  </td>
                  <td>
                    <div>
                      <p className="text-xs text-dark-400">
                        {trx.sumber === 'Pembelian' ? 'No. BAST' : 'No. Surat Pengantar'}
                      </p>
                      <p className="text-sm font-medium text-dark-700">{trx.no_referensi || '-'}</p>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      {trx.items.map((item, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="font-medium text-dark-700">{item.barang?.nama_barang}</span>
                          <span className="text-dark-400 ml-1">
                            ({item.jumlah} {item.barang?.satuan?.nama_satuan})
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="text-xs text-dark-500 max-w-[150px] truncate">{trx.keterangan || '-'}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setShowPrintPreview(trx)}
                        className="p-1.5 rounded-md text-dark-400 hover:bg-bps-green-50 hover:text-bps-green transition-colors"
                        title="Cetak"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(trx)}
                        className="p-1.5 rounded-md text-dark-400 hover:bg-bps-blue-50 hover:text-bps-blue transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(trx)}
                        className="p-1.5 rounded-md text-dark-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-center justify-between p-5 border-b border-dark-100">
              <h2 className="text-lg font-semibold text-dark-800">
                {editItem ? 'Edit Transaksi Masuk' : 'Tambah Transaksi Masuk'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-dark-400 hover:bg-dark-50">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Sumber</label>
                  <select
                    className="input"
                    value={formSumber}
                    onChange={(e) => setFormSumber(e.target.value as SumberBarangMasuk)}
                  >
                    <option value="Pembelian">Pembelian</option>
                    <option value="Transfer Masuk">Transfer Masuk (dari Provinsi)</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Tanggal</label>
                  <input type="date" className="input" defaultValue={editItem?.tanggal || new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div>
                <label className="input-label">
                  {formSumber === 'Pembelian' ? 'Nomor BAST' : 'Nomor Surat Pengantar'}
                </label>
                <input
                  className="input"
                  placeholder={formSumber === 'Pembelian' ? 'BAST/001/IX/2026' : 'SP/BPS-SUMSEL/128/VIII/2026'}
                  defaultValue={editItem?.no_referensi || ''}
                />
              </div>
              <div>
                <label className="input-label">Barang</label>
                <select className="input">
                  <option value="">Pilih barang</option>
                  {mockBarang.map(b => <option key={b.id} value={b.id}>{b.kode_barang} — {b.nama_barang}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Jumlah</label>
                  <input type="number" className="input" placeholder="0" min="1" />
                </div>
                <div>
                  <label className="input-label">Harga Satuan (Rp)</label>
                  <input type="number" className="input" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="input-label">Keterangan (opsional)</label>
                <textarea className="input min-h-[80px] resize-none" placeholder="Catatan tambahan..." defaultValue={editItem?.keterangan || ''} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-dark-100 bg-dark-50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Batal</button>
              <button className="btn-success">
                <ArrowDownToLine className="w-4 h-4" />
                {editItem ? 'Simpan Perubahan' : 'Simpan Transaksi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Preview Modal — per No Surat (Master-Detail) */}
      {showPrintPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-center justify-between p-5 border-b border-dark-100 no-print">
              <h2 className="text-lg font-semibold text-dark-800">Preview Cetak — Bukti Penerimaan Barang</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="btn-primary text-sm">
                  <Printer className="w-4 h-4" />
                  Cetak
                </button>
                <button onClick={() => setShowPrintPreview(null)} className="p-1.5 rounded-lg text-dark-400 hover:bg-dark-50">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-8" id="print-area">
              {/* KOP SURAT RESMI BPS */}
              <div className="text-center border-b-[3px] border-dark-800 pb-3 mb-6">
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

              <h4 className="text-center font-bold text-dark-800 mb-6 text-base underline underline-offset-4">
                BUKTI PENERIMAAN BARANG
              </h4>

              <div className="grid grid-cols-2 gap-y-2 text-sm mb-6">
                <div className="flex gap-2">
                  <span className="text-dark-400 w-36">No. Dokumen</span>
                  <span className="font-medium">: {showPrintPreview.no_dokumen}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-dark-400 w-36">Tanggal</span>
                  <span className="font-medium">: {formatDate(showPrintPreview.tanggal)}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-dark-400 w-36">Sumber</span>
                  <span className="font-medium">: {showPrintPreview.sumber}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-dark-400 w-36">
                    {showPrintPreview.sumber === 'Pembelian' ? 'No. BAST' : 'No. Surat Pengantar'}
                  </span>
                  <span className="font-medium">: {showPrintPreview.no_referensi || '-'}</span>
                </div>
              </div>

              {/* Tabel barang — semua item dalam satu dokumen */}
              <table className="w-full border border-dark-300 text-sm mb-6">
                <thead>
                  <tr className="bg-dark-100">
                    <th className="border border-dark-300 px-3 py-2 text-center w-10">No</th>
                    <th className="border border-dark-300 px-3 py-2 text-left">Nama Barang</th>
                    <th className="border border-dark-300 px-3 py-2 text-center">Satuan</th>
                    <th className="border border-dark-300 px-3 py-2 text-center">Jumlah</th>
                    <th className="border border-dark-300 px-3 py-2 text-left">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {showPrintPreview.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border border-dark-300 px-3 py-2 text-center">{idx + 1}</td>
                      <td className="border border-dark-300 px-3 py-2">{item.barang?.nama_barang}</td>
                      <td className="border border-dark-300 px-3 py-2 text-center">{item.barang?.satuan?.nama_satuan}</td>
                      <td className="border border-dark-300 px-3 py-2 text-center">{item.jumlah}</td>
                      <td className="border border-dark-300 px-3 py-2">{item.keterangan || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {showPrintPreview.keterangan && (
                <p className="text-sm text-dark-500 mb-6">Keterangan: {showPrintPreview.keterangan}</p>
              )}

              {/* Signature area */}
              <div className="grid grid-cols-2 gap-8 mt-12 text-sm text-center">
                <div>
                  <p className="text-dark-500">Yang Menyerahkan,</p>
                  <div className="h-20" />
                  <p className="font-medium text-dark-800 border-b border-dark-300 inline-block px-4">(............................)</p>
                </div>
                <div>
                  <p className="text-dark-500">Yang Menerima,</p>
                  <p className="text-xs text-dark-400">Admin Persediaan</p>
                  <div className="h-16" />
                  <p className="font-medium text-dark-800 border-b border-dark-300 inline-block px-4">Admin Persediaan</p>
                  <p className="text-xs text-dark-400 mt-1">NIP. ........................</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
