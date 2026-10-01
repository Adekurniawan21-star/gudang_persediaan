'use client';

import { useState } from 'react';
import { Ruler, Plus, Edit2, Trash2, X } from 'lucide-react';

const initialSatuan = [
  { id: 1, nama: 'Buah' }, { id: 2, nama: 'Rim' }, { id: 3, nama: 'Lusin' },
  { id: 4, nama: 'Pak' }, { id: 5, nama: 'Dus' }, { id: 6, nama: 'Set' },
  { id: 7, nama: 'Unit' }, { id: 8, nama: 'Lembar' }, { id: 9, nama: 'Roll' },
  { id: 10, nama: 'Botol' }, { id: 11, nama: 'Kotak' }, { id: 12, nama: 'Batang' },
];

export default function SatuanPage() {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  return (
    <div className="page-enter space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Satuan Barang</h1>
          <p className="text-sm text-dark-400 mt-1">Kelola satuan ukuran barang</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="btn-primary">
          <Plus className="w-4 h-4" /> Tambah Satuan
        </button>
      </div>

      <div className="card">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 p-5">
          {initialSatuan.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-50 hover:bg-bps-blue-50 group transition-all">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-dark-300 group-hover:text-bps-blue transition-colors" />
                <span className="text-sm font-medium text-dark-700">{s.nama}</span>
              </div>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditItem(s); setShowModal(true); }}
                  className="p-1 rounded text-dark-400 hover:text-bps-blue"><Edit2 className="w-3.5 h-3.5" /></button>
                <button className="p-1 rounded text-dark-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-slide-in-up">
            <div className="flex items-center justify-between p-5 border-b border-dark-100">
              <h2 className="text-lg font-semibold text-dark-800">{editItem ? 'Edit' : 'Tambah'} Satuan</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-dark-400 hover:bg-dark-50"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5">
              <label className="input-label">Nama Satuan</label>
              <input className="input" placeholder="Contoh: Buah, Rim, Lusin" defaultValue={editItem?.nama || ''} />
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
