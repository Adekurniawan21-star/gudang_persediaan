'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import BpsLogo from '@/components/BpsLogo';

export default function LoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const performLogin = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      localStorage.setItem('sipersedia_user', JSON.stringify({
        id: 'admin-001',
        name: 'Admin Persediaan BPS',
        email: 'admin@bps-okus.go.id',
        role: 'admin',
        bidang: 'Subbagian Umum',
      }));
    } else {
      localStorage.setItem('sipersedia_user', JSON.stringify({
        id: 'usr-001',
        name: 'Ahmad Fauzi (Pegawai BPS)',
        email: 'pegawai@bps-okus.go.id',
        role: 'user',
        bidang: 'Tim Statistik Sosial',
      }));
    }
    router.push('/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    await new Promise((resolve) => setTimeout(resolve, 600));

    const input = usernameOrEmail.trim().toLowerCase();
    const pass = password.trim();

    // Cek apakah Admin Persediaan
    if (
      (input === 'admin_persediaan' || input === 'admin' || input === 'admin@bps-okus.go.id') &&
      (pass === 'admin123' || pass === 'admin')
    ) {
      performLogin('admin');
      return;
    }

    // Cek apakah Pegawai
    if (
      (input === 'pegawai' || input === 'user' || input === 'pegawai@bps-okus.go.id') &&
      (pass === 'pegawai123' || pass === 'pegawai' || pass === 'user' || pass === 'user123')
    ) {
      performLogin('user');
      return;
    }

    // Cek di database user terdaftar jika ada
    try {
      const storedUsers = localStorage.getItem('sipersedia_users_list');
      if (storedUsers) {
        const userList = JSON.parse(storedUsers);
        const matched = userList.find((u: any) =>
          (u.email?.toLowerCase() === input || u.nip === input || u.name?.toLowerCase() === input) &&
          (u.password ? u.password === pass : (pass === 'user123' || pass === 'admin123'))
        );
        if (matched) {
          localStorage.setItem('sipersedia_user', JSON.stringify(matched));
          router.push('/dashboard');
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    setError('Username atau password tidak valid. Silakan periksa kembali.');
    setIsLoading(false);
  };

  return (
    <div className="login-bg min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Glowing Ambient Circles in Official BPS Colors (Biru, Orange, Hijau) */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-bps-blue/25 blur-[100px] pointer-events-none animate-pulse-soft" />
      <div
        className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-bps-orange/20 blur-[110px] pointer-events-none animate-pulse-soft"
        style={{ animationDelay: '1.5s' }}
      />
      <div
        className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-bps-green/20 blur-[110px] pointer-events-none animate-pulse-soft"
        style={{ animationDelay: '3s' }}
      />

      <div className="relative z-10 w-full max-w-md animate-fade-in my-8">
        {/* Logo & Header Instansi */}
        <div className="text-center mb-6">
          {/* BPS Logo Box dengan Badge Putih Bersih */}
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white shadow-2xl shadow-black/20 mb-4 ring-4 ring-white/20 transition-transform hover:scale-105 duration-300">
            <BpsLogo size={68} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5 text-bps-orange" />
            <span>Badan Pusat Statistik RI</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            SIMPAN OKUS
          </h1>
          <p className="text-white/80 text-sm font-medium mt-0.5">
            Sistem Informasi Manajemen Persediaan
          </p>
          <p className="text-bps-orange-300 text-xs font-semibold tracking-wider mt-1 uppercase">
            BPS KABUPATEN OGAN KOMERING ULU SELATAN
          </p>
        </div>

        {/* Login Card dengan Aksen Tricolor BPS (Biru - Orange - Hijau) */}
        <div className="glass-card rounded-2xl shadow-2xl border border-white/40 overflow-hidden relative backdrop-blur-xl">
          {/* Pita Tricolor Resmi BPS di Bagian Atas Kartu */}
          <div className="h-1.5 w-full bg-gradient-to-r from-bps-blue via-bps-orange to-bps-green" />

          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-dark-800">Masuk ke Sistem</h2>
              <p className="text-dark-400 text-xs mt-1">
                Silakan masuk menggunakan kredensial akun kedinasan Anda
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fade-in font-medium">
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 animate-ping" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="usernameOrEmail" className="input-label text-xs font-semibold text-dark-700">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                  <input
                    id="usernameOrEmail"
                    type="text"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    className="input pl-10 pr-4 py-2.5 text-sm rounded-xl border-dark-200 focus:border-bps-blue focus:ring-bps-blue/20"
                    placeholder="Masukkan username"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="input-label text-xs font-semibold text-dark-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10 pr-10 py-2.5 text-sm rounded-xl border-dark-200 focus:border-bps-blue focus:ring-bps-blue/20"
                    placeholder="Masukkan password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-bps-blue via-bps-blue-600 to-bps-teal hover:opacity-95 shadow-lg shadow-bps-blue/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi Kredensial...</span>
                  </div>
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white/50 text-xs mt-6 space-y-1">
          <p className="flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-bps-green" />
            <span>Sistem Informasi Persediaan Barang BPS OKU Selatan</span>
          </p>
        </div>
      </div>
    </div>
  );
}
