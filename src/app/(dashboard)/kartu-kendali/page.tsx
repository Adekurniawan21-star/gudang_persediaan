'use client';

import { useState } from 'react';
import {
  ClipboardList, Search, Printer, X, ArrowDownToLine, ArrowUpFromLine,
} from 'lucide-react';
import { mockKartuKendali, mockBarang } from '@/lib/mock-data';
import type { KartuKendali } from '@/types';
import { cn, formatDateShort, formatDate, formatNumber } from '@/lib/utils';

export default function KartuKendaliPage() {
  const [selectedBarang, setSelectedBarang] = useState<number | null>(mockKartuKendali[0]?.id_barang || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const currentCard = mockKartuKendali.find(k => k.id_barang === selectedBarang);

  const filteredBarang = mockBarang.filter(b =>
    b.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.kode_barang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate summary
  const totalMasuk = currentCard?.entries.reduce((s, e) => s + e.masuk, 0) || 0;
  const totalKeluar = currentCard?.entries.reduce((s, e) => s + e.keluar, 0) || 0;
  const sisaAkhir = currentCard?.entries[currentCard.entries.length - 1]?.sisa || 0;

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Kartu Kendali Persediaan</h1>
          <p className="text-sm text-dark-400 mt-1">Kartu kendali per barang — terintegrasi dengan transaksi masuk &amp; pemakaian</p>
        </div>
        {currentCard && (
          <button onClick={() => setShowPrintPreview(true)} className="btn-secondary">
            <Printer className="w-4 h-4" />
            Cetak Kartu Kendali
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar — daftar barang */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 text-sm"
                placeholder="Cari barang..."
              />
            </div>
            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {filteredBarang.map(b => {
                const hasCard = mockKartuKendali.some(k => k.id_barang === b.id);
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBarang(b.id)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg transition-all duration-200 text-sm',
                      selectedBarang === b.id
                        ? 'bg-bps-blue-50 border border-bps-blue-200'
                        : 'hover:bg-dark-50 border border-transparent',
                    )}
                  >
                    <p className={cn('font-medium', selectedBarang === b.id ? 'text-bps-blue' : 'text-dark-700')}>
                      {b.nama_barang}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-dark-400">{b.kode_barang}</span>
                      {hasCard && (
                        <span className="text-[10px] bg-bps-green-50 text-bps-green-700 px-1.5 py-0.5 rounded">
                          Ada Data
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main content — kartu kendali */}
        <div className="lg:col-span-3">
          {currentCard ? (
            <div className="space-y-4">
              {/* Card info */}
              <div className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-dark-800">{currentCard.nama_barang}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      {currentCard.kode_barang && (
                        <span className="font-mono text-xs text-bps-blue bg-bps-blue-50 px-2 py-0.5 rounded">
                          {currentCard.kode_barang}
                        </span>
                      )}
                      <span className="text-sm text-dark-400">Satuan: {currentCard.satuan}</span>
                      <span className="text-sm text-dark-400">Tahun: {currentCard.tahun}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-dark-400">Total Masuk</p>
                      <p className="text-lg font-bold text-bps-green">{totalMasuk}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-dark-400">Total Keluar</p>
                      <p className="text-lg font-bold text-bps-orange">{totalKeluar}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-dark-400">Sisa</p>
                      <p className="text-lg font-bold text-dark-800">{sisaAkhir}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction log table */}
              <div className="card">
                <div className="px-5 py-4 border-b border-dark-100">
                  <h3 className="text-sm font-semibold text-dark-700">Riwayat Mutasi Barang</h3>
                </div>
                <div className="table-container border-0">
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Tanggal</th>
                        <th>No. Bon/Faktur/BAST</th>
                        <th>Uraian</th>
                        <th className="text-center">Masuk (M)</th>
                        <th className="text-center">Keluar (K)</th>
                        <th className="text-center">Sisa Barang</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCard.entries.map((entry, idx) => (
                        <tr key={entry.id}>
                          <td className="text-dark-400">{idx + 1}</td>
                          <td className="text-sm text-dark-500">{formatDateShort(entry.tanggal)}</td>
                          <td>
                            <span className="font-mono text-xs text-dark-600">{entry.no_referensi}</span>
                          </td>
                          <td className="text-sm text-dark-700">{entry.uraian}</td>
                          <td className="text-center">
                            {entry.masuk > 0 ? (
                              <span className="inline-flex items-center gap-1 text-bps-green font-semibold">
                                <ArrowDownToLine className="w-3 h-3" />
                                +{entry.masuk}
                              </span>
                            ) : (
                              <span className="text-dark-200">-</span>
                            )}
                          </td>
                          <td className="text-center">
                            {entry.keluar > 0 ? (
                              <span className="inline-flex items-center gap-1 text-bps-orange font-semibold">
                                <ArrowUpFromLine className="w-3 h-3" />
                                -{entry.keluar}
                              </span>
                            ) : (
                              <span className="text-dark-200">-</span>
                            )}
                          </td>
                          <td className="text-center font-bold text-dark-800">{entry.sisa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

      {/* Print Preview */}
      {showPrintPreview && currentCard && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-center justify-between p-5 border-b border-dark-100 no-print sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-dark-800">Preview Kartu Kendali — {currentCard.nama_barang}</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="btn-primary text-sm">
                  <Printer className="w-4 h-4" /> Cetak
                </button>
                <button onClick={() => setShowPrintPreview(false)} className="btn-secondary text-sm">Tutup</button>
              </div>
            </div>
            <div className="p-8">
              {/* KOP SURAT */}
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

              <h4 className="text-center font-bold text-dark-800 mb-4 text-base underline underline-offset-4">
                KARTU KENDALI PERSEDIAAN BARANG
              </h4>

              <div className="grid grid-cols-2 gap-y-2 text-sm mb-6">
                <div className="flex gap-2">
                  <span className="text-dark-400 w-28">Nama Barang</span>
                  <span className="font-medium">: {currentCard.nama_barang}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-dark-400 w-28">Satuan</span>
                  <span className="font-medium">: {currentCard.satuan}</span>
                </div>
                {currentCard.kode_barang && (
                  <div className="flex gap-2">
                    <span className="text-dark-400 w-28">Kode Barang</span>
                    <span className="font-medium">: {currentCard.kode_barang}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <span className="text-dark-400 w-28">Tahun</span>
                  <span className="font-medium">: {currentCard.tahun}</span>
                </div>
              </div>

              <table className="w-full border border-dark-300 text-[11px] mb-8">
                <thead>
                  <tr className="bg-dark-100">
                    <th className="border border-dark-300 px-2 py-1.5 text-center">No</th>
                    <th className="border border-dark-300 px-2 py-1.5 text-center">Tanggal M/K</th>
                    <th className="border border-dark-300 px-2 py-1.5">No. Bon/Faktur/BAST</th>
                    <th className="border border-dark-300 px-2 py-1.5">Uraian</th>
                    <th className="border border-dark-300 px-2 py-1.5 text-center">Masuk (M)</th>
                    <th className="border border-dark-300 px-2 py-1.5 text-center">Keluar (K)</th>
                    <th className="border border-dark-300 px-2 py-1.5 text-center">Sisa Barang</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCard.entries.map((entry, idx) => (
                    <tr key={entry.id}>
                      <td className="border border-dark-300 px-2 py-1 text-center">{idx + 1}</td>
                      <td className="border border-dark-300 px-2 py-1 text-center">{formatDateShort(entry.tanggal)}</td>
                      <td className="border border-dark-300 px-2 py-1">{entry.no_referensi}</td>
                      <td className="border border-dark-300 px-2 py-1">{entry.uraian}</td>
                      <td className="border border-dark-300 px-2 py-1 text-center">{entry.masuk > 0 ? entry.masuk : '-'}</td>
                      <td className="border border-dark-300 px-2 py-1 text-center">{entry.keluar > 0 ? entry.keluar : '-'}</td>
                      <td className="border border-dark-300 px-2 py-1 text-center font-semibold">{entry.sisa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="grid grid-cols-2 gap-8 mt-12 text-sm text-center">
                <div />
                <div>
                  <p className="text-dark-500">Muaradua, .....................</p>
                  <p className="text-dark-500">Admin Persediaan</p>
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
