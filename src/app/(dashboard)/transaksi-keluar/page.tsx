'use client';

import { useState, useEffect } from 'react';
import {
  ArrowUpFromLine, Plus, Search, Printer, Edit2, Trash2,
  X, FileText, CheckCircle2,
} from 'lucide-react';
import { mockTransaksiKeluar, mockBarang } from '@/lib/mock-data';
import { TIM_PEMOHON_LIST } from '@/types';
import type { TransaksiKeluar } from '@/types';
import { cn, formatDateShort, formatDate } from '@/lib/utils';

export default function TransaksiKeluarPage() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrintPreview, setShowPrintPreview] = useState<TransaksiKeluar | null>(null);
  const [editItem, setEditItem] = useState<TransaksiKeluar | null>(null);
  const [selectedTim, setSelectedTim] = useState('');
  const [userRole, setUserRole] = useState<'admin' | 'user'>('admin');

  useEffect(() => {
    const stored = localStorage.getItem('sipersedia_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUserRole(u.role);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const isUser = userRole === 'user';

  const filtered = mockTransaksiKeluar.filter(t => {
    const matchSearch = t.no_dokumen.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.nama_tim.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.items.some(item => item.barang?.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSearch;
  });

  const selectedTimData = TIM_PEMOHON_LIST.find(t => t.id === selectedTim);

  const handleEdit = (trx: TransaksiKeluar) => {
    setEditItem(trx);
    setSelectedTim(trx.tim_pemohon);
    setShowModal(true);
  };

  return (
    <div className="page-enter space-y-6">
      {/* Header — Dinamis sesuai Role Admin vs User */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">
            {isUser ? 'Permintaan Barang (SPB)' : 'Pengeluaran / Pemakaian Barang'}
          </h1>
          <p className="text-sm text-dark-400 mt-1">
            {isUser
              ? 'Ajukan permohonan ATK/cetakan dan cetak Surat Permintaan Barang untuk pengambilan'
              : 'Verifikasi, persetujuan, dan pencatatan barang keluar dari gudang persediaan'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setEditItem(null); setSelectedTim(''); setShowModal(true); }}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            {isUser ? 'Buat Surat Permintaan' : 'Catat Pengeluaran'}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-orange-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-bps-orange" />
          </div>
          <div>
            <p className="text-xl font-bold text-dark-800">{mockTransaksiKeluar.length}</p>
            <p className="text-xs text-dark-400">
              {isUser ? 'Total Surat Permintaan' : 'Total Dokumen Pengeluaran'}
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-blue-50 flex items-center justify-center">
            <ArrowUpFromLine className="w-5 h-5 text-bps-blue" />
          </div>
          <div>
            <p className="text-xl font-bold text-dark-800">
              {mockTransaksiKeluar.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.jumlah, 0), 0)}
            </p>
            <p className="text-xs text-dark-400">
              {isUser ? 'Total Item Diminta' : 'Total Item Disalurkan'}
            </p>
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
            placeholder="Cari nomor surat, tim pemohon, atau nama barang..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Barang</th>
                <th>Satuan</th>
                <th>Jumlah</th>
                <th>Tim Pemohon</th>
                <th>Keterangan</th>
                <th>Aksi / Dokumen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((trx, trxIdx) => (
                <tr key={trx.id}>
                  <td>
                    <span className="font-mono text-xs text-bps-blue font-bold">
                      {trx.no_dokumen}
                    </span>
                  </td>
                  <td>
                    <div className="space-y-1">
                      {trx.items.map((item, idx) => (
                        <p key={idx} className="font-semibold text-dark-800 text-sm">
                          {item.barang?.nama_barang}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      {trx.items.map((item, idx) => (
                        <p key={idx} className="text-xs text-dark-500">
                          {item.barang?.satuan?.nama_satuan}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      {trx.items.map((item, idx) => (
                        <p key={idx} className="text-xs font-bold text-dark-800">
                          {item.jumlah}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="font-semibold text-dark-700 text-xs">{trx.nama_tim}</p>
                      <p className="text-[10px] text-dark-400">PJ: {trx.penanggung_jawab}</p>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      {trx.items.map((item, idx) => (
                        <p key={idx} className="text-xs text-dark-400">
                          {item.keterangan || '-'}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {/* Tombol Cetak Surat Permintaan Barang */}
                      <button
                        onClick={() => setShowPrintPreview(trx)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-bps-blue text-white hover:bg-bps-blue-600 shadow-sm transition-all"
                        title="Cetak Formulir Permintaan Barang"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak Surat</span>
                      </button>

                      {!isUser && (
                        <button
                          onClick={() => handleEdit(trx)}
                          className="p-1.5 rounded-md text-dark-400 hover:bg-dark-100 hover:text-dark-700 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <FileText className="w-12 h-12 text-dark-200 mx-auto mb-3" />
                    <p className="text-dark-400 text-sm">Belum ada data permintaan barang</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Buat Permintaan / Catat Pengeluaran */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-center justify-between p-5 border-b border-dark-100">
              <div>
                <h2 className="text-lg font-bold text-dark-800">
                  {isUser ? 'Formulir Permintaan Barang (ATK)' : 'Pencatatan Pengeluaran Barang'}
                </h2>
                <p className="text-xs text-dark-400 mt-0.5">
                  {isUser ? 'Isi data barang yang dibutuhkan oleh Tim Kerja BPS' : 'Validasi pengeluaran fisik barang dari gudang'}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-dark-400 hover:bg-dark-50">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="input-label">Tim Pemohon</label>
                <select
                  value={selectedTim}
                  onChange={(e) => setSelectedTim(e.target.value)}
                  className="input"
                >
                  <option value="">Pilih Tim Kerja</option>
                  {TIM_PEMOHON_LIST.map(t => (
                    <option key={t.id} value={t.id}>{t.nama_tim} — {t.penanggung_jawab}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Pilih Barang yang Diminta</label>
                <select className="input">
                  <option value="">Pilih barang dari gudang...</option>
                  {mockBarang.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.nama_barang} (Stok: {b.stok} {b.satuan?.nama_satuan})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Jumlah Diminta</label>
                  <input type="number" min="1" className="input" placeholder="Contoh: 5" defaultValue={1} />
                </div>
                <div>
                  <label className="input-label">Tanggal Permintaan</label>
                  <input type="date" className="input" defaultValue={editItem?.tanggal || new Date().toISOString().split('T')[0]} />
                </div>
              </div>

              <div>
                <label className="input-label">Keterangan / Keperluan Kegiatan</label>
                <textarea
                  className="input min-h-[75px] resize-none"
                  placeholder="Contoh: Untuk keperluan Pelatihan Petugas Survei / Kegiatan Sensus..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-dark-100 bg-dark-50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="btn-secondary">
                Batal
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  if (filtered.length > 0) setShowPrintPreview(filtered[0]);
                }}
                className="btn-primary"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isUser ? 'Simpan & Siapkan Cetak Surat' : 'Simpan Pengeluaran'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Preview — SURAT PERMINTAAN BARANG ATK/CETAKAN/DLL (Persis Format Gambar) */}
      {showPrintPreview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-center justify-between p-4 border-b border-dark-100 no-print sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-bps-blue" />
                <h2 className="text-base font-bold text-dark-800">
                  Surat Permintaan Barang ATK/Cetakan/DLL
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="btn-primary text-xs py-2 px-3">
                  <Printer className="w-4 h-4" /> Cetak Dokumen
                </button>
                <button onClick={() => setShowPrintPreview(null)} className="p-1.5 rounded-lg text-dark-400 hover:bg-dark-50">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 text-black bg-white" id="print-area">
              {/* KOP SURAT RESMI BPS */}
              <div className="border-b-[2px] border-black pb-3 mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src="/images/logo-bps.svg"
                    alt="Logo BPS"
                    className="w-16 h-16 object-contain flex-shrink-0"
                  />
                  <div>
                    <h2 className="text-sm font-bold tracking-wider text-black">BADAN PUSAT STATISTIK</h2>
                    <h3 className="text-base font-black text-black">KABUPATEN OGAN KOMERING ULU SELATAN</h3>
                    <p className="text-[11px] text-gray-700 mt-0.5">Jalan raya R.A Kartini KM. 3,5 Kecamatan Buay Rawan</p>
                    <p className="text-[11px] text-gray-700">Homepage: http://okuselatankab.bps.go.id &nbsp; E-mail: bps1608@bps.go.id</p>
                  </div>
                </div>
              </div>

              {/* No & Tahun (Sesuai Posisi Kanan Atas di Gambar) */}
              <div className="flex justify-end mb-3 text-xs">
                <div className="w-44 text-black">
                  <div className="flex">
                    <span className="w-16 font-semibold">No</span>
                    <span>: {showPrintPreview.no_dokumen}</span>
                  </div>
                  <div className="flex">
                    <span className="w-16 font-semibold">Tahun</span>
                    <span>: {new Date(showPrintPreview.tanggal).getFullYear() || 2026}</span>
                  </div>
                </div>
              </div>

              {/* Judul Formulir (Tengah) */}
              <div className="text-center mb-5">
                <h4 className="font-extrabold text-black text-sm tracking-wide">
                  SURAT PERMINTAAN BARANG
                </h4>
                <h4 className="font-extrabold text-black text-sm tracking-wide">
                  ATK/CETAKAN/DLL
                </h4>
              </div>

              {/* Tim Pemohon */}
              <div className="text-xs mb-3 text-black">
                <p>
                  <span className="font-bold">Tim :</span> {showPrintPreview.nama_tim}
                </p>
              </div>

              {/* Tabel Permintaan Sesuai Format Kolom Gambar User */}
              <table className="w-full border-collapse border border-black text-xs mb-8">
                <thead>
                  <tr className="bg-gray-100 text-black font-bold text-center">
                    <th className="border border-black px-2 py-1.5 w-10">No</th>
                    <th className="border border-black px-3 py-1.5 text-center">Nama Barang</th>
                    <th className="border border-black px-3 py-1.5 text-center w-28">Satuan Barang</th>
                    <th className="border border-black px-3 py-1.5 text-center w-20">Jumlah</th>
                    <th className="border border-black px-3 py-1.5 text-center">Keterangan</th>
                  </tr>
                  <tr className="bg-blue-50 text-[10px] text-gray-700 font-bold text-center">
                    <th className="border border-black py-0.5">1</th>
                    <th className="border border-black py-0.5">2</th>
                    <th className="border border-black py-0.5">3</th>
                    <th className="border border-black py-0.5">4</th>
                    <th className="border border-black py-0.5">5</th>
                  </tr>
                </thead>
                <tbody>
                  {showPrintPreview.items.map((item, idx) => (
                    <tr key={idx} className="text-black">
                      <td className="border border-black px-2 py-1.5 text-center font-medium">{idx + 1}</td>
                      <td className="border border-black px-3 py-1.5 font-medium">{item.barang?.nama_barang}</td>
                      <td className="border border-black px-3 py-1.5 text-center">{item.barang?.satuan?.nama_satuan}</td>
                      <td className="border border-black px-3 py-1.5 text-center font-bold">{item.jumlah}</td>
                      <td className="border border-black px-3 py-1.5">{item.keterangan || '-'}</td>
                    </tr>
                  ))}
                  {/* Baris kosong pelengkap agar menyerupai blangko kertas dinas di gambar */}
                  {Array.from({ length: Math.max(0, 10 - showPrintPreview.items.length) }).map((_, i) => (
                    <tr key={`empty-${i}`}>
                      <td className="border border-black px-2 py-2 text-center text-transparent">-</td>
                      <td className="border border-black px-3 py-2">&nbsp;</td>
                      <td className="border border-black px-3 py-2">&nbsp;</td>
                      <td className="border border-black px-3 py-2">&nbsp;</td>
                      <td className="border border-black px-3 py-2">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tanda Tangan Sesuai Gambar Format Resmi BPS */}
              <div className="grid grid-cols-2 gap-8 text-xs text-black">
                <div>
                  <p className="font-semibold">Administrator Gudang</p>
                  <p>Kuasa Pengguna Barang</p>
                  <div className="h-20" />
                  <p className="border-b border-black inline-block min-w-[180px] pb-0.5 font-medium">
                    ............................................................
                  </p>
                  <p className="mt-1">Nip.</p>
                </div>
                <div className="text-left pl-6">
                  <p>Muaradua, {formatDate(showPrintPreview.tanggal)}</p>
                  <p className="font-semibold">Penanggung Jawab</p>
                  <div className="h-20" />
                  <p className="border-b border-black inline-block min-w-[180px] pb-0.5 font-semibold">
                    {showPrintPreview.penanggung_jawab || '............................................................'}
                  </p>
                  <p className="mt-1">Nip. {showPrintPreview.nip_pj || '....................................'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
