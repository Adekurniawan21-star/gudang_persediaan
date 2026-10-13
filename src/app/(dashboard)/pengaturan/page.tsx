'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BarChart3, Shield, Database, Globe, Info, User, Lock,
  Camera, CheckCircle2, Save, X, Building, KeyRound, Sparkles,
  Users, Copy, Check, CheckCircle, ExternalLink, Trash2, Image as ImageIcon,
  RotateCcw, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIM_PEMOHON_LIST, PEJABAT_KPB, PENGELOLA_PERSEDIAAN } from '@/types';
import { resetToTestingMode, loadSimulationData, wipeAllData } from '@/lib/data-management';

interface UserProfile {
  id: string;
  name: string;
  nip?: string;
  email: string;
  role: 'admin' | 'user';
  bidang: string;
  avatar_url?: string | null;
}

function PengaturanContent() {
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'profil' | 'tim' | 'sistem' | 'instansi'>('profil');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'admin-001',
    name: 'Admin Persediaan BPS',
    nip: '199003142010011001',
    email: 'admin@bps-okus.go.id',
    role: 'admin',
    bidang: 'Subbagian Umum',
    avatar_url: null,
  });

  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    email: '',
    bidang: '',
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [copiedNip, setCopiedNip] = useState<string | null>(null);

  // Sync tab with URL search parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'sistem' || tabParam === 'instansi' || tabParam === 'profil') {
      setActiveTab(tabParam as any);
    } else if (tabParam === 'tim' && userProfile.role === 'admin') {
      setActiveTab('tim');
    }
  }, [searchParams]);

  // Load profil aktif dari localStorage
  useEffect(() => {
    const loadStoredUser = () => {
      const stored = localStorage.getItem('sipersedia_user');
      if (stored) {
        try {
          const u = JSON.parse(stored);
          const resolved: UserProfile = {
            id: u.id || 'usr-001',
            name: u.name || (u.role === 'admin' ? 'Admin Persediaan BPS' : 'Ahmad Fauzi'),
            nip: u.nip || (u.role === 'admin' ? '199003142010011001' : '199112052012011002'),
            email: u.email || (u.role === 'admin' ? 'admin@bps-okus.go.id' : 'pegawai@bps-okus.go.id'),
            role: u.role || 'admin',
            bidang: u.bidang || (u.role === 'admin' ? 'Subbagian Umum' : 'Tim Statistik Sosial'),
            avatar_url: u.avatar_url || null,
          };
          setUserProfile(resolved);
          setFormData({
            name: resolved.name,
            nip: resolved.nip || '',
            email: resolved.email,
            bidang: resolved.bidang,
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        setFormData({
          name: userProfile.name,
          nip: userProfile.nip || '',
          email: userProfile.email,
          bidang: userProfile.bidang,
        });
      }
    };

    loadStoredUser();

    window.addEventListener('profileUpdated', loadStoredUser);
    return () => window.removeEventListener('profileUpdated', loadStoredUser);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setNotification({ type: 'error', message: 'Nama lengkap tidak boleh kosong!' });
      return;
    }

    const updated: UserProfile = {
      ...userProfile,
      name: formData.name.trim(),
      nip: formData.nip.trim(),
      email: formData.email.trim(),
      bidang: formData.bidang.trim(),
      avatar_url: userProfile.avatar_url || null,
    };

    setUserProfile(updated);
    localStorage.setItem('sipersedia_user', JSON.stringify(updated));

    // Dispatch update event for layout and header
    window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updated }));
    window.dispatchEvent(new Event('storage'));

    setNotification({
      type: 'success',
      message: 'Profil akun berhasil diperbarui! Perubahan langsung tersimpan.',
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setNotification({ type: 'error', message: 'Ukuran foto maksimal 3MB!' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const updated: UserProfile = { ...userProfile, avatar_url: result };
      setUserProfile(updated);
      localStorage.setItem('sipersedia_user', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updated }));
      window.dispatchEvent(new Event('storage'));
      setNotification({ type: 'success', message: 'Foto profil berhasil diunggah dan disimpan!' });
      setTimeout(() => setNotification(null), 4000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    const updated: UserProfile = { ...userProfile, avatar_url: null };
    setUserProfile(updated);
    localStorage.setItem('sipersedia_user', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updated }));
    window.dispatchEvent(new Event('storage'));
    setNotification({ type: 'success', message: 'Foto profil berhasil dihapus, menggunakan avatar inisial.' });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.oldPassword) {
      setNotification({ type: 'error', message: 'Password lama wajib diisi!' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setNotification({ type: 'error', message: 'Password baru minimal 6 karakter!' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setNotification({ type: 'error', message: 'Konfirmasi password baru tidak cocok!' });
      return;
    }

    setShowPasswordModal(false);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setNotification({
      type: 'success',
      message: 'Password akun berhasil diperbarui secara aman!',
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCopyNip = (nip: string, id: string) => {
    navigator.clipboard.writeText(nip.replace(/\s+/g, ''));
    setCopiedNip(id);
    setTimeout(() => setCopiedNip(null), 2500);
  };

  const handleResetTestingData = () => {
    if (confirm('Reset ke Mode Uji Coba Bersih?\n\n✓ 81 Master Barang resmi BPS disiapkan dengan stok baseline\n✓ Transaksi Masuk dikosongkan (0 dokumen)\n✓ Permintaan / Transaksi Keluar dikosongkan (0 dokumen)\n✓ Kartu Kendali bersih siap menerima mutasi baru\n\nLanjutkan reset?')) {
      resetToTestingMode();
      alert('Data persediaan berhasil di-reset ke kondisi awal siap uji coba fitur!');
      window.location.reload();
    }
  };

  const handleLoadSampleData = () => {
    if (confirm('Muat kembali data simulasi lengkap (81 barang resmi BPS + contoh transaksi masuk & pengeluaran)?')) {
      loadSimulationData();
      alert('Data sampel simulasi resmi BPS berhasil dimuat!');
      window.location.reload();
    }
  };

  const handleClearAllData = () => {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin mengosongkan semua data (0 barang, 0 transaksi)? Anda harus memasukkan master barang secara manual dari nol.')) {
      wipeAllData();
      alert('Seluruh data persediaan dan transaksi berhasil dikosongkan.');
      window.location.reload();
    }
  };

  const initials = userProfile.name
    ? userProfile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'BP';

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-dark-800">Pengaturan & Profil</h1>
          <span
            className={cn(
              'text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider',
              userProfile.role === 'admin'
                ? 'bg-bps-orange-50 text-bps-orange border border-bps-orange/20'
                : 'bg-bps-green-50 text-bps-green border border-bps-green/20'
            )}
          >
            {userProfile.role === 'admin' ? 'Administrator Persediaan' : 'Pegawai BPS'}
          </span>
        </div>
        <p className="text-sm text-dark-400 mt-1">
          Kelola profil pengguna, daftar Tim Kerja & Penanggung Jawab (PJ), dan informasi instansi BPS OKU Selatan
        </p>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={cn(
            'flex items-center justify-between p-4 rounded-2xl text-sm shadow-sm animate-fade-in border',
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          )}
        >
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <p className="font-semibold">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 rounded-lg hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-dark-100 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('profil')}
          className={cn(
            'pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all',
            activeTab === 'profil'
              ? 'border-bps-blue text-bps-blue'
              : 'border-transparent text-dark-400 hover:text-dark-700'
          )}
        >
          <User className="w-4 h-4" />
          <span>Profil Akun</span>
        </button>

        {userProfile.role === 'admin' && (
          <button
            onClick={() => setActiveTab('tim')}
            className={cn(
              'pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all',
              activeTab === 'tim'
                ? 'border-bps-blue text-bps-blue'
                : 'border-transparent text-dark-400 hover:text-dark-700'
            )}
          >
            <Users className="w-4 h-4" />
            <span>Daftar Tim & Penanggung Jawab (PJ)</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('sistem')}
          className={cn(
            'pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all',
            activeTab === 'sistem'
              ? 'border-bps-blue text-bps-blue'
              : 'border-transparent text-dark-400 hover:text-dark-700'
          )}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Informasi Sistem</span>
        </button>

        <button
          onClick={() => setActiveTab('instansi')}
          className={cn(
            'pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all',
            activeTab === 'instansi'
              ? 'border-bps-blue text-bps-blue'
              : 'border-transparent text-dark-400 hover:text-dark-700'
          )}
        >
          <Building className="w-4 h-4" />
          <span>Data Instansi BPS</span>
        </button>
      </div>

      {/* Tab Content: Profil Akun */}
      {activeTab === 'profil' && (
        <div className="card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-dark-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-dark-800 flex items-center gap-2">
                <User className="w-5 h-5 text-bps-blue" />
                Informasi Pengguna
              </h3>
              <p className="text-xs text-dark-400 mt-0.5">
                Data identitas yang terdaftar pada sistem SIMPAN OKUS
              </p>
            </div>
            <span className="badge text-xs font-semibold px-3 py-1 bg-dark-50 text-dark-600">
              ID: {userProfile.id}
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Avatar Box */}
              <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
                <div className="relative group">
                  <div
                    className={cn(
                      'w-24 h-24 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md overflow-hidden ring-4 ring-white',
                      userProfile.role === 'admin'
                        ? 'bg-gradient-to-br from-bps-blue via-bps-blue-600 to-bps-orange'
                        : 'bg-gradient-to-br from-bps-blue via-bps-teal to-bps-green'
                    )}
                  >
                    {userProfile.avatar_url ? (
                      <img
                        src={userProfile.avatar_url}
                        alt="Foto Profil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-bps-blue text-white flex items-center justify-center shadow-md hover:bg-bps-blue-600 transition-colors"
                    title="Upload / Ganti Foto Profil"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-dark-700">{userProfile.name}</p>
                  <p className="text-[11px] text-dark-400">
                    {userProfile.role === 'admin' ? 'Administrator' : 'Pegawai BPS'}
                  </p>
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] text-bps-blue hover:underline font-semibold"
                    >
                      {userProfile.avatar_url ? 'Ganti Foto' : 'Unggah Foto'}
                    </button>
                    {userProfile.avatar_url && (
                      <>
                        <span className="text-dark-300">·</span>
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="text-[11px] text-red-500 hover:underline font-semibold"
                        >
                          Hapus Foto
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Input Data */}
              <div className="flex-1 space-y-4 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label text-xs font-semibold text-dark-700">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="input text-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nama Pegawai / Admin"
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label text-xs font-semibold text-dark-700">
                      NIP (Nomor Induk Pegawai)
                    </label>
                    <input
                      type="text"
                      className="input text-sm font-mono"
                      value={formData.nip}
                      onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                      placeholder="18 Digit NIP Resmi BPS"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label text-xs font-semibold text-dark-700">
                      Email Instansi
                    </label>
                    <input
                      type="email"
                      className="input text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nama@bps-okus.go.id"
                    />
                  </div>
                  <div>
                    <label className="input-label text-xs font-semibold text-dark-700">
                      Unit Kerja / Tim
                    </label>
                    <input
                      type="text"
                      className="input text-sm"
                      value={formData.bidang}
                      onChange={(e) => setFormData({ ...formData, bidang: e.target.value })}
                      placeholder="Subbagian Umum / Tim Statistik"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-dark-100">
                  <button type="submit" className="btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5 shadow-sm">
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Profil</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className="btn-secondary text-xs py-2.5 px-4 inline-flex items-center gap-1.5"
                  >
                    <Lock className="w-4 h-4 text-dark-500" />
                    <span>Ganti Password</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tab Content: Daftar Tim & Penanggung Jawab (PJ) - Khusus Role Admin */}
      {activeTab === 'tim' && userProfile.role === 'admin' && (
        <div className="space-y-6">
          {/* Pejabat Utama Persediaan Card */}
          <div className="card p-6 border-l-4 border-l-bps-blue">
            <h3 className="text-base font-bold text-dark-800 mb-1 flex items-center gap-2">
              <Shield className="w-5 h-5 text-bps-blue" />
              Pejabat Pengelola Persediaan & Kuasa Pengguna Barang
            </h3>
            <p className="text-xs text-dark-400 mb-4">
              Pejabat berwenang penandatangan dokumen resmi, berita acara, dan laporan persediaan
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* KPB */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-bps-blue-50/50 to-white border border-bps-blue/20">
                <span className="text-[10px] font-bold text-bps-blue uppercase tracking-wider px-2 py-0.5 bg-bps-blue-100/60 rounded-md">
                  {PEJABAT_KPB.peran}
                </span>
                <h4 className="font-bold text-dark-800 text-sm mt-2">{PEJABAT_KPB.nama}</h4>
                <p className="text-xs text-dark-500 mt-0.5">{PEJABAT_KPB.jabatan}</p>
                <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-bps-blue/10">
                  <span className="text-dark-400 font-mono text-[11px]">NIP. {PEJABAT_KPB.nip}</span>
                  <button
                    onClick={() => handleCopyNip(PEJABAT_KPB.nip, 'kpb')}
                    className="text-bps-blue hover:text-bps-blue-700 text-[11px] font-semibold flex items-center gap-1"
                  >
                    {copiedNip === 'kpb' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNip === 'kpb' ? 'Tersalin' : 'Salin NIP'}</span>
                  </button>
                </div>
              </div>

              {/* Pengelola Persediaan */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-bps-orange-50/40 to-white border border-bps-orange/20">
                <span className="text-[10px] font-bold text-bps-orange uppercase tracking-wider px-2 py-0.5 bg-bps-orange-100/60 rounded-md">
                  {PENGELOLA_PERSEDIAAN.peran}
                </span>
                <h4 className="font-bold text-dark-800 text-sm mt-2">{PENGELOLA_PERSEDIAAN.nama}</h4>
                <p className="text-xs text-dark-500 mt-0.5">{PENGELOLA_PERSEDIAAN.jabatan}</p>
                <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-bps-orange/10">
                  <span className="text-dark-400 font-mono text-[11px]">NIP. {PENGELOLA_PERSEDIAAN.nip}</span>
                  <button
                    onClick={() => handleCopyNip(PENGELOLA_PERSEDIAAN.nip, 'pengelola')}
                    className="text-bps-orange hover:text-bps-orange-700 text-[11px] font-semibold flex items-center gap-1"
                  >
                    {copiedNip === 'pengelola' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNip === 'pengelola' ? 'Tersalin' : 'Salin NIP'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 8 Tim Kerja BPS OKU Selatan */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4 border-b border-dark-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-dark-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-bps-blue" />
                  Daftar 8 Tim Kerja & Penanggung Jawab (PJ) Pemohon
                </h3>
                <p className="text-xs text-dark-400 mt-0.5">
                  Digunakan otomatis pada formulir permohonan ATK dan penandatangan Surat Permintaan Barang (SPB)
                </p>
              </div>
              <span className="badge bg-bps-blue-50 text-bps-blue font-bold text-xs px-3 py-1">
                8 Tim Terdaftar
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3.5">
              {TIM_PEMOHON_LIST.map((tim, index) => (
                <div
                  key={tim.id}
                  className="p-4 rounded-xl border border-dark-100 bg-white hover:border-bps-blue/40 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold text-bps-blue bg-bps-blue-50 px-2 py-0.5 rounded-md">
                        Tim #{index + 1}
                      </span>
                      <span className="text-[11px] text-dark-400 font-mono">ID: {tim.id}</span>
                    </div>
                    <h4 className="font-bold text-dark-800 text-sm">{tim.nama_tim}</h4>
                    <div className="mt-2 space-y-0.5">
                      <p className="text-[11px] text-dark-400">Penanggung Jawab (PJ):</p>
                      <p className="text-xs font-bold text-dark-700">{tim.penanggung_jawab}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-dark-50 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-dark-500">
                      NIP: {tim.nip_pj || '-'}
                    </span>
                    {tim.nip_pj && (
                      <button
                        onClick={() => handleCopyNip(tim.nip_pj, tim.id)}
                        className="text-bps-blue hover:text-bps-blue-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        {copiedNip === tim.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedNip === tim.id ? 'Tersalin' : 'Salin NIP'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Informasi Sistem */}
      {activeTab === 'sistem' && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bps-blue to-bps-teal flex items-center justify-center shadow-lg shadow-bps-blue/20">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-dark-800">SIMPAN OKUS</h2>
                  <span className="badge text-[11px] font-bold bg-bps-blue-50 text-bps-blue border border-bps-blue/20">
                    BPS OKU SELATAN
                  </span>
                </div>
                <p className="text-sm text-dark-500 font-medium mt-0.5">
                  Sistem Informasi Manajemen Persediaan Ogan Komering Ulu Selatan
                </p>
                <p className="text-xs text-dark-400 mt-0.5">
                  Dirancang untuk akuntabilitas, transparansi stock opname, dan kemudahan permintaan ATK
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-dark-50 border border-dark-100">
                <div className="flex items-center gap-2 text-xs text-dark-500 mb-1.5">
                  <Info className="w-4 h-4 text-bps-blue" />
                  <span>Versi Aplikasi</span>
                </div>
                <p className="text-lg font-bold text-dark-800">v1.2.0 (Stable)</p>
                <p className="text-[11px] text-dark-400 mt-0.5">Next.js 14 + TailwindCSS</p>
              </div>

              <div className="p-4 rounded-xl bg-dark-50 border border-dark-100">
                <div className="flex items-center gap-2 text-xs text-dark-500 mb-1.5">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Database Utama</span>
                </div>
                <p className="text-lg font-bold text-dark-800">PostgreSQL (Supabase)</p>
                <p className="text-[11px] text-emerald-600 font-medium mt-0.5">✓ Terhubung Aktif</p>
              </div>

              <div className="p-4 rounded-xl bg-dark-50 border border-dark-100">
                <div className="flex items-center gap-2 text-xs text-dark-500 mb-1.5">
                  <Globe className="w-4 h-4 text-bps-orange" />
                  <span>Lingkungan</span>
                </div>
                <p className="text-lg font-bold text-dark-800">BPS OKU Selatan</p>
                <p className="text-[11px] text-dark-400 mt-0.5">Kode Satker: 1608</p>
              </div>

              <div className="p-4 rounded-xl bg-dark-50 border border-dark-100">
                <div className="flex items-center gap-2 text-xs text-dark-500 mb-1.5">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>Autentikasi & RLS</span>
                </div>
                <p className="text-lg font-bold text-dark-800">Multi-Role Aktif</p>
                <p className="text-[11px] text-purple-600 font-medium mt-0.5">Admin & Pegawai</p>
              </div>
            </div>

            {/* Bagian Uji Coba & Manajemen Data Persediaan */}
            <div className="mt-6 pt-5 border-t border-dark-100">
              <div className="flex items-center justify-between gap-4 mb-2">
                <h4 className="text-sm font-bold text-dark-800 flex items-center gap-2">
                  <Database className="w-4 h-4 text-bps-blue" />
                  Manajemen &amp; Reset Data Persediaan (Uji Coba Sistem)
                </h4>
                <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  Fitur Pengujian
                </span>
              </div>
              <p className="text-xs text-dark-400 mb-4">
                Pilih opsi di bawah untuk mengatur ulang data persediaan sesuai kebutuhan pengujian alur sistem per fitur.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Opsi 1: Reset Bersih Siap Uji Coba (Rekomendasi Utama) */}
                <div className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 flex flex-col justify-between relative overflow-hidden shadow-xs hover:border-emerald-400 transition-all">
                  <div className="absolute top-2 right-2">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      Rekomendasi
                    </span>
                  </div>
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-dark-800">Mode Uji Coba Bersih</h5>
                    <p className="text-[11px] text-dark-500 mt-1 leading-relaxed">
                      81 Master barang siap dengan stok baseline. Transaksi masuk &amp; keluar 0. Siap untuk uji coba input transaksi masuk, permintaan (SPB), persetujuan, dan kartu kendali.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetTestingData}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset untuk Uji Coba</span>
                  </button>
                </div>

                {/* Opsi 2: Muat Data Simulasi Lengkap */}
                <div className="p-4 rounded-2xl border border-bps-blue/20 bg-bps-blue-50/40 flex flex-col justify-between shadow-xs hover:border-bps-blue/40 transition-all">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-bps-blue-100 text-bps-blue flex items-center justify-center mb-2.5">
                      <Database className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-dark-800">Data Simulasi Penuh</h5>
                    <p className="text-[11px] text-dark-500 mt-1 leading-relaxed">
                      Memuat 81 barang BPS lengkap beserta contoh riwayat transaksi masuk dan keluar (Agustus - September) untuk demonstrasi instan.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLoadSampleData}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-bps-blue bg-white hover:bg-bps-blue-50 border border-bps-blue/30 transition-all shadow-xs active:scale-95"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Muat Data Simulasi</span>
                  </button>
                </div>

                {/* Opsi 3: Kosongkan Total */}
                <div className="p-4 rounded-2xl border border-red-200 bg-red-50/40 flex flex-col justify-between shadow-xs hover:border-red-300 transition-all">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-2.5">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-dark-800">Kosongkan Total</h5>
                    <p className="text-[11px] text-dark-500 mt-1 leading-relaxed">
                      Mengosongkan semua data (0 barang, 0 transaksi masuk, 0 transaksi keluar) jika ingin mencoba input master barang dari formulir kosong.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearAllData}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-700 bg-white hover:bg-red-50 border border-red-300 transition-all shadow-xs active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Kosongkan Semua Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Data Instansi BPS */}
      {activeTab === 'instansi' && (
        <div className="card p-6 space-y-5">
          <div className="border-b border-dark-100 pb-4">
            <h3 className="text-base font-bold text-dark-800 flex items-center gap-2">
              <Building className="w-5 h-5 text-bps-blue" />
              Informasi Satuan Kerja BPS
            </h3>
            <p className="text-xs text-dark-400 mt-0.5">
              Data instansi yang tercantum pada Kop Surat resmi & cetak dokumen
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label text-xs font-semibold text-dark-700">Nama Instansi</label>
              <input
                className="input text-sm"
                defaultValue="BADAN PUSAT STATISTIK KABUPATEN OGAN KOMERING ULU SELATAN"
                readOnly
              />
            </div>
            <div>
              <label className="input-label text-xs font-semibold text-dark-700">Kode Wilayah / Satker</label>
              <input className="input text-sm font-mono" defaultValue="1608 - OKU SELATAN" readOnly />
            </div>
          </div>

          <div>
            <label className="input-label text-xs font-semibold text-dark-700">Alamat Kantor</label>
            <input
              className="input text-sm"
              defaultValue="Jalan Raya R.A Kartini No. 3,5 Kecamatan Buay Rawan, Muaradua, OKU Selatan, Sumatera Selatan"
              readOnly
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label text-xs font-semibold text-dark-700">Website Resmi</label>
              <input className="input text-sm" defaultValue="https://okuselatankab.bps.go.id" readOnly />
            </div>
            <div>
              <label className="input-label text-xs font-semibold text-dark-700">Email Kedinasan</label>
              <input className="input text-sm" defaultValue="bps1608@bps.go.id" readOnly />
            </div>
          </div>
        </div>
      )}

      {/* Modal Ganti Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in-up overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-dark-100 bg-gradient-to-r from-dark-50 to-white">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-bps-blue" />
                <h2 className="text-base font-bold text-dark-800">Ganti Password Akun</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="p-1.5 rounded-lg text-dark-400 hover:bg-dark-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="p-5 space-y-4">
              <div>
                <label className="input-label text-xs font-semibold text-dark-700">
                  Password Saat Ini <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  className="input text-sm"
                  placeholder="Masukkan password akun saat ini"
                  required
                />
              </div>

              <div>
                <label className="input-label text-xs font-semibold text-dark-700">
                  Password Baru <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="input text-sm"
                  placeholder="Minimal 6 karakter"
                  required
                />
              </div>

              <div>
                <label className="input-label text-xs font-semibold text-dark-700">
                  Konfirmasi Password Baru <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="input text-sm"
                  placeholder="Ketik ulang password baru"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-dark-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="btn-secondary text-xs"
                >
                  Batal
                </button>
                <button type="submit" className="btn-primary text-xs inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Perbarui Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PengaturanPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-dark-500">Memuat pengaturan...</div>}>
      <PengaturanContent />
    </Suspense>
  );
}
