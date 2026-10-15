'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
  FileText,
  Boxes,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import StatsCard from '@/components/StatsCard';
import { mockDashboardStats, mockChartData, mockBarang, mockTransaksiKeluar } from '@/lib/mock-data';
import type { Barang, TransaksiMasuk, TransaksiKeluar } from '@/types';
import { formatCurrency, formatNumber, formatDateShort, getStokStatus, cn } from '@/lib/utils';
import {
  fetchAndSyncBarang,
  fetchAndSyncTransaksiKeluar,
  fetchAndSyncTransaksiMasuk,
} from '@/lib/sync-service';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    role: 'admin' | 'user';
    bidang: string;
  } | null>(null);

  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [transaksiMasukList, setTransaksiMasukList] = useState<TransaksiMasuk[]>([]);
  const [transaksiKeluarList, setTransaksiKeluarList] = useState<TransaksiKeluar[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('sipersedia_user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }

    const b = localStorage.getItem('sipersedia_barang_list');
    if (b !== null) {
      try {
        const parsed = JSON.parse(b);
        if (Array.isArray(parsed)) {
          setBarangList(parsed);
        }
      } catch (e) {
        setBarangList([]);
      }
    } else {
      setBarangList(mockBarang);
    }

    const m = localStorage.getItem('sipersedia_transaksi_masuk');
    if (m) {
      try {
        const parsed = JSON.parse(m);
        if (Array.isArray(parsed)) setTransaksiMasukList(parsed);
      } catch (e) {}
    }

    const k = localStorage.getItem('sipersedia_transaksi_keluar');
    if (k) {
      try {
        const parsed = JSON.parse(k);
        if (Array.isArray(parsed)) setTransaksiKeluarList(parsed);
      } catch (e) {}
    }

    // Sinkronisasi otomatis data terbaru dari cloud
    let curBarang = mockBarang;
    fetchAndSyncBarang().then((bData) => {
      if (bData && bData.length > 0) {
        curBarang = bData;
        setBarangList(bData);
      }
    });
    fetchAndSyncTransaksiMasuk(curBarang).then((mData) => {
      if (mData) setTransaksiMasukList(mData);
    });
    fetchAndSyncTransaksiKeluar(curBarang).then((kData) => {
      if (kData) setTransaksiKeluarList(kData);
    });

    // Polling setiap 7 detik
    const syncInterval = setInterval(() => {
      fetchAndSyncBarang().then((bData) => {
        if (bData && bData.length > 0) setBarangList(bData);
      });
      fetchAndSyncTransaksiMasuk(curBarang).then((mData) => {
        if (mData) setTransaksiMasukList(mData);
      });
      fetchAndSyncTransaksiKeluar(curBarang).then((kData) => {
        if (kData) setTransaksiKeluarList(kData);
      });
    }, 7000);

    return () => clearInterval(syncInterval);
  }, []);

  const totalBarang = barangList.length;
  const lowStockItems = barangList.filter(b => b.stok <= b.stok_minimum);
  const totalStokRendah = lowStockItems.length;
  const totalTransaksiMasuk = transaksiMasukList.length;
  const totalTransaksiKeluar = transaksiKeluarList.length;
  const totalNilaiPersediaan = barangList.reduce((acc, b) => acc + (b.stok * 25000), 0);
  const chartData = mockChartData;

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="page-enter space-y-6">
      {/* Institutional BPS Welcome Banner dengan Harmonisasi Biru, Orange, dan Hijau */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-bps-blue-700/30 bg-gradient-to-r from-[#005AA9] via-[#004887] to-[#E65100] text-white">
        {/* Glowing Orbs Aksen BPS (Orange & Hijau) */}
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-bps-orange/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-1/4 w-72 h-72 rounded-full bg-bps-green/25 blur-3xl pointer-events-none" />

        {/* Pita Aksen Tricolor Resmi BPS di Bagian Paling Atas */}
        <div className="h-1.5 w-full bg-gradient-to-r from-bps-blue via-bps-orange to-bps-green" />

        <div className="p-6 sm:p-7 relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            {/* Logo BPS dengan Bingkai Putih Bersih */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2.5 flex items-center justify-center shadow-xl ring-4 ring-bps-orange/30 flex-shrink-0">
              <img
                src="/images/logo-bps.svg"
                alt="Logo Badan Pusat Statistik"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/25 backdrop-blur-md">
                  BADAN PUSAT STATISTIK
                </span>
                <span className="text-[10px] font-extrabold text-amber-300 px-2.5 py-0.5 rounded-full bg-black/25 border border-amber-300/30">
                  KABUPATEN OKU SELATAN
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                SIMPAN OKUS · GUDANG PERSEDIAAN BPS
              </h1>
              <p className="text-[11px] font-bold text-amber-200 tracking-wide uppercase">
                SISTEM INFORMASI MANAJEMEN PERSEDIAAN
              </p>

              <p className="text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed pt-0.5">
                {isAdmin ? (
                  <>
                    Selamat datang, <span className="font-bold text-white">{currentUser?.name || 'Administrator'}</span>! Anda berada di mode <span className="font-bold text-amber-300">Admin Persediaan</span> untuk mengelola stok persediaan, input barang masuk, dan persetujuan.
                  </>
                ) : (
                  <>
                    Selamat datang, <span className="font-bold text-white">{currentUser?.name || 'Pegawai BPS'}</span>! Anda berada di mode <span className="font-bold text-bps-green-200">Pegawai</span> untuk melihat katalog stok persediaan dan mengajukan permintaan pemakaian.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons sesuai Role (Admin vs User) */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {isAdmin ? (
              <>
                <Link
                  href="/transaksi-masuk"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-bps-green to-bps-green-600 text-white shadow-md hover:brightness-105 transition-all active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Catat Barang Masuk</span>
                </Link>
                <Link
                  href="/barang"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/15 text-white hover:bg-white/25 border border-white/20 backdrop-blur-sm transition-all active:scale-95"
                >
                  <Boxes className="w-4 h-4" />
                  <span>Master Barang</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/transaksi-keluar"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-bps-orange to-bps-orange-600 text-white shadow-md hover:brightness-105 transition-all active:scale-95"
                >
                  <ArrowUpFromLine className="w-4 h-4" />
                  <span>Ajukan Pemakaian</span>
                </Link>
                <Link
                  href="/barang"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/15 text-white hover:bg-white/25 border border-white/20 backdrop-blur-sm transition-all active:scale-95"
                >
                  <Package className="w-4 h-4" />
                  <span>Lihat Stok ATK</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-black/25 px-6 py-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-bps-green" />
            <span>Koneksi Sistem Aktif · Database Supabase BPS OKU Selatan</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/70">
              Mode Uji Coba: <strong className="text-white font-bold">{totalBarang} Master Barang Siap</strong> · <strong className="text-white font-bold">{totalTransaksiMasuk} Transaksi Masuk</strong> · <strong className="text-white font-bold">{totalTransaksiKeluar} Permintaan</strong>
            </span>
            <Link
              href="/pengaturan?tab=sistem"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold transition-all border border-white/20 active:scale-95"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data Uji Coba</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats cards dengan Nuansa Warna BPS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div>
          <StatsCard
            title="Total Barang"
            value={formatNumber(totalBarang)}
            subtitle="item terdaftar"
            icon={<Package className="w-5 h-5 text-white" />}
            variant="blue"
            delay={0}
          />
        </div>
        <div>
          <StatsCard
            title="Stok Rendah"
            value={formatNumber(totalStokRendah)}
            subtitle="perlu restock"
            icon={<AlertTriangle className="w-5 h-5 text-white" />}
            variant="orange"
            trend={totalStokRendah > 0 ? { value: totalStokRendah, direction: 'up' } : undefined}
            delay={100}
          />
        </div>
        <div>
          <StatsCard
            title="Transaksi Masuk"
            value={formatNumber(totalTransaksiMasuk)}
            subtitle="surat penerimaan"
            icon={<ArrowDownToLine className="w-5 h-5 text-white" />}
            variant="green"
            delay={200}
          />
        </div>
        <div>
          <StatsCard
            title="Transaksi Keluar"
            value={formatNumber(totalTransaksiKeluar)}
            subtitle="surat permintaan (SPB)"
            icon={<ArrowUpFromLine className="w-5 h-5 text-white" />}
            variant="orange"
            delay={300}
          />
        </div>
        <div>
          <StatsCard
            title="Nilai Persediaan"
            value={totalNilaiPersediaan > 0 ? `${(totalNilaiPersediaan / 1000000).toFixed(1)}jt` : 'Rp 0'}
            subtitle={formatCurrency(totalNilaiPersediaan)}
            icon={<Wallet className="w-5 h-5 text-white" />}
            variant="blue"
            delay={400}
          />
        </div>
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-dark-800">Trend Barang Masuk & Keluar</h2>
              <p className="text-xs text-dark-400 mt-0.5">Statistik arus persediaan 6 bulan terakhir</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-bps-blue shadow-xs" />
                <span className="text-dark-600">Barang Masuk (Biru)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-bps-orange shadow-xs" />
                <span className="text-dark-600">Barang Keluar (Orange)</span>
              </div>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                <defs>
                  <linearGradient id="gradMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#005AA9" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#005AA9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradKeluar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5821F" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F5821F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="masuk" stroke="#005AA9" strokeWidth={2.5} fill="url(#gradMasuk)" name="Barang Masuk" />
                <Area type="monotone" dataKey="keluar" stroke="#F5821F" strokeWidth={2.5} fill="url(#gradKeluar)" name="Barang Keluar" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low stock alert */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-dark-800">⚠️ Peringatan Stok Rendah</h2>
              <p className="text-xs text-dark-400 mt-0.5">Barang mencapai batas minimum</p>
            </div>
            <span className="badge bg-bps-orange-50 text-bps-orange-700 font-bold border border-bps-orange-200">
              {lowStockItems.length} item
            </span>
          </div>
          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <div className="text-center py-6 text-dark-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5 opacity-60" />
                <p className="font-semibold text-dark-600">Stok persediaan aman</p>
                <p className="text-[11px] mt-0.5">Tidak ada barang yang berada di bawah batas minimum</p>
              </div>
            ) : (
              lowStockItems.map((item) => {
                const status = getStokStatus(item.stok, item.stok_minimum);
                return (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-50 hover:bg-dark-100/70 transition-colors border border-dark-100/50">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      status === 'habis' ? 'bg-red-100' : 'bg-bps-orange-100'
                    )}>
                      <Package className={cn(
                        'w-5 h-5',
                        status === 'habis' ? 'text-red-600' : 'text-bps-orange'
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-dark-800 truncate">{item.nama_barang}</p>
                      <p className="text-xs text-dark-400">{item.kode_barang} · {item.kategori?.nama_kategori}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={cn(
                        'text-sm font-extrabold',
                        status === 'habis' ? 'text-red-600' : 'text-bps-orange'
                      )}>
                        {item.stok}
                      </p>
                      <p className="text-[10px] text-dark-400 font-medium">min: {item.stok_minimum}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Pemakaian Barang Terbaru */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-100 flex items-center justify-between bg-dark-50/40">
          <div>
            <h2 className="text-base font-bold text-dark-800">Pemakaian Barang Terbaru</h2>
            <p className="text-xs text-dark-400 mt-0.5">Riwayat pemakaian barang persediaan</p>
          </div>
          <Link
            href="/transaksi-keluar"
            className="text-xs text-bps-blue font-bold hover:text-bps-blue-700 flex items-center gap-1 transition-colors"
          >
            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="table-container border-0">
          <table>
            <thead>
              <tr>
                <th>No. Dokumen</th>
                <th>Tanggal</th>
                <th>Barang</th>
                <th>Tim Pemohon</th>
                <th>Penanggung Jawab</th>
              </tr>
            </thead>
            <tbody>
              {transaksiKeluarList.slice(0, 5).map((trx) => (
                <tr key={trx.id}>
                  <td>
                    <span className="font-mono text-xs text-bps-blue font-bold">{trx.no_dokumen}</span>
                  </td>
                  <td className="text-xs text-dark-500">{formatDateShort(trx.tanggal)}</td>
                  <td>
                    <div className="space-y-0.5">
                      {trx.items.map((item, idx) => (
                        <p key={idx} className="text-xs text-dark-700 font-medium">
                          {item.barang?.nama_barang} ({item.jumlah} {item.barang?.satuan?.nama_satuan})
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="text-sm text-dark-700 font-semibold">{trx.nama_tim}</td>
                  <td className="text-xs text-dark-500">{trx.penanggung_jawab}</td>
                </tr>
              ))}
              {transaksiKeluarList.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <FileText className="w-8 h-8 text-dark-200 mx-auto mb-2" />
                    <p className="text-dark-500 text-xs font-semibold">Belum ada transaksi pengeluaran barang</p>
                    <p className="text-dark-400 text-[11px] mt-0.5">Transaksi permintaan barang persediaan akan tampil di sini</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
