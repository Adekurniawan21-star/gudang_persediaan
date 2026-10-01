'use client';

import { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, X, Package } from 'lucide-react';

const initialLokasi = [
  { id: 1, nama: 'Gudang Utama', deskripsi: 'Ruang penyimpanan utama lantai 1', jumlah_barang: 2 },
  { id: 2, nama: 'Gudang ATK', deskripsi: 'Ruang penyimpanan khusus alat tulis kantor', jumlah_barang: 3 },
  { id: 3, nama: 'Rak Server', deskripsi: 'Tempat penyimpanan peralatan IT', jumlah_barang: 2 },
  { id: 4, nama: 'Ruang Arsip', deskripsi: 'Ruang penyimpanan dokumen dan cetakan', jumlah_barang: 1 },
];

export default function LokasiPage() {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  return (
    <div className="page-enter space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Lokasi Penyimpanan</h1>
          <p className="text-sm text-dark-400 mt-1">Kelola lokasi penyimpanan barang</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="btn-primary">
          <Plus className="w-4 h-4" /> Tambah Lokasi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {initialLokasi.map((lok) => (
          <div key={lok.id} className="card p-5 hover:shadow-card-hover transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bps-teal-50 to-bps-blue-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-bps-teal" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-dark-800">{lok.nama}</h3>
                    <p className="text-xs text-dark-400 mt-0.5">{lok.deskripsi}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditItem(lok); setShowModal(true); }}
                      className="p-1.5 rounded-md text-dark-400 hover:bg-bps-blue-50 hover:text-bps-blue transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-md text-dark-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-xs text-dark-400">
                  <Package className="w-3.5 h-3.5" />
                  {lok.jumlah_barang} barang tersimpan
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in-up">
            <div className="flex items-center justify-between p-5 border-b border-dark-100">
              <h2 className="text-lg font-semibold text-dark-800">{editItem ? 'Edit' : 'Tambah'} Lokasi</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-dark-400 hover:bg-dark-50"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="input-label">Nama Lokasi</label><input className="input" placeholder="Contoh: Gudang Utama" defaultValue={editItem?.nama || ''} /></div>
              <div><label className="input-label">Deskripsi</label><textarea className="input min-h-[80px] resize-none" placeholder="Deskripsi lokasi..." defaultValue={editItem?.deskripsi || ''} /></div>
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
