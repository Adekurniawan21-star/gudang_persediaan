'use client';

import { useState } from 'react';
import { Tags, Plus, Edit2, Trash2, X } from 'lucide-react';

const initialKategori = [
  { id: 1, nama: 'Alat Tulis Kantor', deskripsi: 'Perlengkapan tulis menulis dan perkantoran', jumlah_barang: 3 },
  { id: 2, nama: 'Peralatan Komputer', deskripsi: 'Perangkat keras dan aksesoris komputer', jumlah_barang: 2 },
  { id: 3, nama: 'Perlengkapan Rumah Tangga', deskripsi: 'Kebutuhan rumah tangga kantor', jumlah_barang: 1 },
  { id: 4, nama: 'Alat Kebersihan', deskripsi: 'Peralatan untuk kebersihan kantor', jumlah_barang: 1 },
  { id: 5, nama: 'Perlengkapan Cetakan', deskripsi: 'Formulir, buku, dan cetakan', jumlah_barang: 1 },
  { id: 6, nama: 'Peralatan Elektronik', deskripsi: 'Perangkat elektronik kantor', jumlah_barang: 0 },
];

export default function KategoriPage() {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  return (
    <div className="page-enter space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Kategori Barang</h1>
          <p className="text-sm text-dark-400 mt-1">Kelola kategori klasifikasi barang</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="btn-primary">
          <Plus className="w-4 h-4" /> Tambah Kategori
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {initialKategori.map((kat) => (
          <div key={kat.id} className="card p-5 hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-bps-blue-50 flex items-center justify-center">
                <Tags className="w-5 h-5 text-bps-blue" />
              </div>
              <span className="badge bg-dark-50 text-dark-500">{kat.jumlah_barang} barang</span>
            </div>
            <h3 className="font-semibold text-dark-800 mb-1">{kat.nama}</h3>
            <p className="text-xs text-dark-400 mb-4">{kat.deskripsi}</p>
            <div className="flex items-center gap-2 pt-3 border-t border-dark-100">
              <button onClick={() => { setEditItem(kat); setShowModal(true); }}
                className="flex-1 btn-secondary text-xs py-2">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button className="p-2 rounded-lg text-dark-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in-up">
            <div className="flex items-center justify-between p-5 border-b border-dark-100">
              <h2 className="text-lg font-semibold text-dark-800">{editItem ? 'Edit' : 'Tambah'} Kategori</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-dark-400 hover:bg-dark-50"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="input-label">Nama Kategori</label><input className="input" placeholder="Nama kategori" defaultValue={editItem?.nama || ''} /></div>
              <div><label className="input-label">Deskripsi</label><textarea className="input min-h-[80px] resize-none" placeholder="Deskripsi kategori..." defaultValue={editItem?.deskripsi || ''} /></div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-dark-100 bg-dark-50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Batal</button>
              <button className="btn-primary">{editItem ? 'Simpan' : 'Tambah'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
