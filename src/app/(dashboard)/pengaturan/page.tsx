'use client';

import { useState } from 'react';
import { BarChart3, Shield, Database, Globe, Info, User, Lock, Camera } from 'lucide-react';

export default function PengaturanPage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className="page-enter space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-800">Pengaturan</h1>
        <p className="text-sm text-dark-400 mt-1">Konfigurasi sistem dan informasi aplikasi</p>
      </div>

      {/* Profil Saya */}
      <div className="card p-6">
        <h3 className="text-base font-semibold text-dark-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-bps-blue" />
          Profil Saya
        </h3>
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-bps-blue to-bps-teal flex items-center justify-center text-white text-2xl font-bold">
                AP
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-bps-blue text-white flex items-center justify-center shadow-lg hover:bg-bps-blue-600 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <button className="text-xs text-bps-blue hover:underline">Ganti Foto</button>
          </div>
          {/* Info */}
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="input-label">Nama Lengkap</label>
                <input className="input" defaultValue="Admin Persediaan" />
              </div>
              <div>
                <label className="input-label">NIP</label>
                <input className="input" defaultValue="199003142010011001" />
              </div>
            </div>
            <div>
              <label className="input-label">Email</label>
              <input className="input" defaultValue="admin@bps-okus.go.id" />
            </div>
            <div className="flex items-center gap-3">
              <button className="btn-primary text-sm">Simpan Profil</button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="btn-secondary text-sm"
              >
                <Lock className="w-4 h-4" />
                Ganti Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* App Info Card */}
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bps-blue to-bps-teal flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark-800">SIPERSEDIA</h2>
            <p className="text-sm text-dark-400">Sistem Informasi Persediaan Barang</p>
            <p className="text-xs text-dark-300 mt-0.5">BPS Kabupaten Ogan Komering Ulu Selatan</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-dark-50">
            <div className="flex items-center gap-2 text-sm text-dark-500 mb-2">
              <Info className="w-4 h-4" /> Versi Aplikasi
            </div>
            <p className="text-lg font-bold text-dark-800">v1.0.0</p>
          </div>
          <div className="p-4 rounded-xl bg-dark-50">
            <div className="flex items-center gap-2 text-sm text-dark-500 mb-2">
              <Database className="w-4 h-4" /> Database
            </div>
            <p className="text-lg font-bold text-dark-800">Supabase (PostgreSQL)</p>
          </div>
          <div className="p-4 rounded-xl bg-dark-50">
            <div className="flex items-center gap-2 text-sm text-dark-500 mb-2">
              <Globe className="w-4 h-4" /> Platform
            </div>
            <p className="text-lg font-bold text-dark-800">Next.js + Vercel</p>
          </div>
          <div className="p-4 rounded-xl bg-dark-50">
            <div className="flex items-center gap-2 text-sm text-dark-500 mb-2">
              <Shield className="w-4 h-4" /> Keamanan
            </div>
            <p className="text-lg font-bold text-dark-800">Row Level Security</p>
          </div>
        </div>
      </div>

      {/* Instansi info */}
      <div className="card p-6">
        <h3 className="text-base font-semibold text-dark-800 mb-4">Informasi Instansi</h3>
        <div className="space-y-3">
          <div><label className="input-label">Nama Instansi</label><input className="input" defaultValue="BPS Kabupaten Ogan Komering Ulu Selatan" /></div>
          <div><label className="input-label">Alamat</label><input className="input" defaultValue="Jalan Raya R.A Kartini. 3,5 Kecamatan Buay Rawan" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="input-label">Homepage</label><input className="input" defaultValue="http://okuselatankab.bps.go.id" /></div>
            <div><label className="input-label">Email</label><input className="input" defaultValue="bps1608@bps.go.id" /></div>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button className="btn-primary">Simpan Perubahan</button>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in-up">
            <div className="flex items-center justify-between p-5 border-b border-dark-100">
              <h2 className="text-lg font-semibold text-dark-800">Ganti Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="p-1.5 rounded-lg text-dark-400 hover:bg-dark-50">
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="input-label">Password Lama</label>
                <input type="password" className="input" placeholder="Masukkan password lama" />
              </div>
              <div>
                <label className="input-label">Password Baru</label>
                <input type="password" className="input" placeholder="Masukkan password baru" />
              </div>
              <div>
                <label className="input-label">Konfirmasi Password Baru</label>
                <input type="password" className="input" placeholder="Ulangi password baru" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-dark-100 bg-dark-50 rounded-b-2xl">
              <button onClick={() => setShowPasswordModal(false)} className="btn-secondary">Batal</button>
              <button className="btn-primary">Simpan Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
