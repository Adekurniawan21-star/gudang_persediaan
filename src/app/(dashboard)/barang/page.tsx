'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package, Plus, Search, Edit2, Trash2, ArrowUpFromLine,
  ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { mockBarang } from '@/lib/mock-data';
import { formatNumber } from '@/lib/utils';

export default function BarangPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
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

  const filtered = mockBarang.filter(b => {
    const matchSearch = b.nama_barang.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = !filterKategori || b.kategori?.nama_kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  const kategoriList = Array.from(new Set(mockBarang.map(b => b.kategori?.nama_kategori).filter(Boolean))) as string[];

  return (
    <div className="page-enter space-y-6">
      {/* Header — Disesuaikan untuk Admin vs User */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">
            {isUser ? 'Katalog Stok Barang' : 'Data Master Barang'}
          </h1>
          <p className="text-sm text-dark-400 mt-1">
            {isUser
              ? 'Pantau ketersediaan stok barang dan ATK sebelum mengajukan permintaan'
              : 'Kelola master data barang persediaan, stok minimum, dan lokasi penyimpanan'}
          </p>
        </div>

        {isUser ? (
          <Link href="/transaksi-keluar" className="btn-primary">
            <ArrowUpFromLine className="w-4 h-4" />
            Ajukan Permintaan ATK
          </Link>
        ) : (
          <button
            onClick={() => { setEditItem(null); setShowModal(true); }}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            Tambah Barang
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
              placeholder="Cari nama barang..."
            />
          </div>
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="input w-full sm:w-48"
          >
            <option value="">Semua Kategori</option>
            {kategoriList.map(k => (
              <option key={k} value={k!}>{k}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th>Satuan</th>
                <th>Lokasi</th>
                <th>Sisa Stok</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-dark-50 flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-dark-300" />
                        </div>
                        <div>
                          <p className="font-semibold text-dark-800">{item.nama_barang}</p>
                          {item.deskripsi && (
                            <p className="text-xs text-dark-400 truncate max-w-[240px]">{item.deskripsi}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-dark-50 text-dark-600 font-medium">{item.kategori?.nama_kategori}</span>
                    </td>
                    <td className="text-sm text-dark-600">{item.satuan?.nama_satuan}</td>
                    <td className="text-sm text-dark-600">{item.lokasi?.nama_lokasi}</td>
                    <td>
                      <div>
                        <span className="font-bold text-dark-800">{formatNumber(item.stok)}</span>
                        <p className="text-[10px] text-dark-400">min: {item.stok_minimum}</p>
                      </div>
                    </td>
                    <td>
                      {isUser ? (
                        <Link
                          href="/transaksi-keluar"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold text-bps-blue bg-bps-blue-50 hover:bg-bps-blue-100 transition-colors"
                        >
                          <ArrowUpFromLine className="w-3 h-3" />
                          <span>Minta</span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setEditItem(item); setShowModal(true); }}
                            className="p-1.5 rounded-md text-dark-400 hover:bg-bps-blue-50 hover:text-bps-blue transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 rounded-md text-dark-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Package className="w-12 h-12 text-dark-200 mx-auto mb-3" />
                    <p className="text-dark-400 text-sm">Tidak ada barang ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-dark-100">
          <p className="text-xs text-dark-400">Menampilkan {filtered.length} dari {mockBarang.length} barang</p>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-md text-dark-400 hover:bg-dark-50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-md bg-bps-blue text-white text-xs font-medium">1</button>
            <button className="w-8 h-8 rounded-md text-dark-500 hover:bg-dark-50 text-xs transition-colors">2</button>
            <button className="p-1.5 rounded-md text-dark-400 hover:bg-dark-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal (Hanya untuk Admin) */}
      {!isUser && showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-center justify-between p-5 border-b border-dark-100">
              <h2 className="text-lg font-semibold text-dark-800">
                {editItem ? 'Edit Barang' : 'Tambah Barang Baru'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-dark-400 hover:bg-dark-50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="input-label">Nama Barang</label>
                <input
                  className="input"
                  placeholder="Contoh: Kertas HVS A4 70gsm"
                  defaultValue={editItem?.nama_barang || ''}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Kategori</label>
                  <select className="input" defaultValue={editItem?.kategori?.nama_kategori || ''}>
                    <option value="">Pilih kategori</option>
                    {kategoriList.map(k => <option key={k} value={k!}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label">Satuan</label>
                  <select className="input" defaultValue={editItem?.satuan?.nama_satuan || ''}>
                    <option value="">Pilih satuan</option>
                    <option>Buah</option><option>Rim</option><option>Lusin</option>
                    <option>Pak</option><option>Dus</option><option>Botol</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Lokasi Penyimpanan</label>
                  <select className="input" defaultValue={editItem?.lokasi?.nama_lokasi || ''}>
                    <option value="">Pilih lokasi</option>
                    <option>Gudang Utama</option><option>Gudang ATK</option>
                    <option>Rak Server</option><option>Ruang Arsip</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Stok Minimum</label>
                  <input type="number" className="input" placeholder="5" defaultValue={editItem?.stok_minimum || 5} />
                </div>
              </div>
              <div>
                <label className="input-label">Foto Barang</label>
                <div className="border-2 border-dashed border-dark-200 rounded-lg p-6 text-center hover:border-bps-blue transition-colors cursor-pointer">
                  <Package className="w-8 h-8 text-dark-300 mx-auto mb-2" />
                  <p className="text-sm text-dark-400">Klik untuk upload foto</p>
                  <p className="text-xs text-dark-300 mt-1">PNG, JPG max 2MB</p>
                </div>
              </div>
              <div>
                <label className="input-label">Deskripsi (opsional)</label>
                <textarea className="input min-h-[80px] resize-none" placeholder="Deskripsi barang..." defaultValue={editItem?.deskripsi || ''} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-dark-100 bg-dark-50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Batal</button>
              <button className="btn-primary">
                {editItem ? 'Simpan Perubahan' : 'Tambah Barang'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
