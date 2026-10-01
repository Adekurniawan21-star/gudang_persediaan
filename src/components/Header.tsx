'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  userName: string;
  userRole: string;
  userBidang: string;
}

export default function Header({
  onToggleMobileSidebar,
  userName,
  userRole,
  userBidang,
}: HeaderProps) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sipersedia_user');
    router.push('/login');
  };

  const notifications = [
    { id: 1, type: 'warning', message: 'Stok Toner Printer HP tinggal 3 unit', time: '5 menit lalu' },
    { id: 2, type: 'warning', message: 'Stok Sabun Cuci Tangan tinggal 2 botol', time: '1 jam lalu' },
    { id: 3, type: 'info', message: 'Permintaan barang baru dari Siti Nurhaliza', time: '2 jam lalu' },
  ];

  const handleSwitchRole = () => {
    if (userRole === 'admin') {
      localStorage.setItem('sipersedia_user', JSON.stringify({
        id: 'usr-001',
        name: 'Ahmad Fauzi (Pegawai BPS)',
        email: 'user@bps-okus.go.id',
        role: 'user',
        bidang: 'Tim Statistik Sosial',
      }));
    } else {
      localStorage.setItem('sipersedia_user', JSON.stringify({
        id: 'admin-001',
        name: 'Admin Persediaan BPS',
        email: 'admin@bps-okus.go.id',
        role: 'admin',
        bidang: 'Subbagian Umum',
      }));
    }
    window.location.reload();
  };

  return (
    <header className="h-16 bg-white border-b border-dark-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shadow-sm">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-dark-500 hover:bg-dark-50 hover:text-dark-700 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile BPS Logo Display */}
        <div className="lg:hidden flex items-center gap-2">
          <img src="/images/logo-bps.svg" alt="Logo BPS" className="w-7 h-7 object-contain" />
          <span className="font-extrabold text-sm text-bps-blue">SIPERSEDIA</span>
        </div>

        {/* Desktop Institution Badge */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-dark-50/80 border border-dark-100">
          <img src="/images/logo-bps.svg" alt="Logo BPS" className="w-5 h-5 object-contain" />
          <div className="text-xs">
            <span className="font-bold text-dark-800 tracking-wide">BPS OKU SELATAN</span>
            <span className="text-dark-400 mx-1.5">·</span>
            <span className="text-dark-500 font-medium">Sistem Persediaan</span>
          </div>
        </div>

        {/* Search */}
        <div className="hidden xl:flex items-center gap-2 bg-dark-50 rounded-xl px-3 py-2 w-72 border border-dark-100/60 focus-within:border-bps-blue focus-within:ring-2 focus-within:ring-bps-blue/10 transition-all">
          <Search className="w-4 h-4 text-dark-400" />
          <input
            type="text"
            placeholder="Cari barang, kode, transaksi..."
            className="bg-transparent text-xs text-dark-700 placeholder:text-dark-400 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2.5">
        {/* Role Pill Badge */}
        <div className="hidden sm:flex items-center">
          {userRole === 'admin' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-bps-orange-50 text-bps-orange-700 border border-bps-orange-200">
              <span className="w-2 h-2 rounded-full bg-bps-orange animate-pulse" />
              ADMIN GUDANG
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-bps-green-50 text-bps-green-700 border border-bps-green-200">
              <span className="w-2 h-2 rounded-full bg-bps-green animate-pulse" />
              USER PEGAWAI
            </span>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
            className="relative p-2 rounded-xl text-dark-500 hover:bg-dark-50 hover:text-dark-700 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-bps-orange rounded-full border-2 border-white" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-dark-100 overflow-hidden animate-fade-in z-50">
              <div className="p-3.5 border-b border-dark-100 flex items-center justify-between bg-dark-50/50">
                <h3 className="font-bold text-xs text-dark-800 uppercase tracking-wider">Notifikasi Sistem</h3>
                <span className="badge bg-bps-orange-100 text-bps-orange-700 text-[10px] font-bold">3 Baru</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3 hover:bg-dark-50 transition-colors border-b border-dark-50 last:border-0">
                    <div className="flex items-start gap-2.5">
                      <div className={cn(
                        'mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                        notif.type === 'warning' ? 'bg-bps-orange-50 text-bps-orange' : 'bg-bps-blue-50 text-bps-blue'
                      )}>
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-dark-700 font-medium leading-relaxed">{notif.message}</p>
                        <p className="text-[10px] text-dark-400 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-dark-100 bg-white">
                <button className="w-full text-center text-xs text-bps-blue font-bold py-1.5 rounded-lg hover:bg-bps-blue-50 transition-colors">
                  Lihat Semua Notifikasi
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-dark-100 mx-0.5" />

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-dark-50 transition-colors border border-transparent hover:border-dark-100"
          >
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm",
              userRole === 'admin'
                ? "bg-gradient-to-br from-bps-blue via-bps-blue-600 to-bps-orange"
                : "bg-gradient-to-br from-bps-blue via-bps-teal to-bps-green"
            )}>
              {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-dark-800 leading-none">{userName}</p>
              <p className="text-[11px] text-dark-400 mt-0.5">{userBidang}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-dark-400 hidden md:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-dark-100 overflow-hidden animate-fade-in z-50">
              <div className="p-4 border-b border-dark-100 bg-gradient-to-br from-dark-50 to-white">
                <p className="font-bold text-sm text-dark-800">{userName}</p>
                <p className="text-xs text-dark-500 mt-0.5">{userBidang}</p>
                <div className="mt-2">
                  <span className={cn(
                    "badge text-[10px] font-bold px-2 py-0.5",
                    userRole === 'admin'
                      ? "bg-bps-orange-100 text-bps-orange-700"
                      : "bg-bps-green-100 text-bps-green-700"
                  )}>
                    {userRole === 'admin' ? '🛡️ Administrator Gudang' : '👤 Pegawai / User BPS'}
                  </span>
                </div>
              </div>

              {/* Quick Role Switcher Button */}
              <div className="p-2 border-b border-dark-100 bg-bps-blue-50/40">
                <button
                  onClick={handleSwitchRole}
                  className="w-full text-left p-2 rounded-xl text-xs font-semibold text-bps-blue hover:bg-bps-blue-100/60 transition-colors flex items-center justify-between"
                >
                  <span>Ganti Mode ke {userRole === 'admin' ? 'User (Pegawai)' : 'Admin'}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-bps-blue shadow-xs">
                    Switch
                  </span>
                </button>
              </div>

              <div className="p-1.5">
                <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-dark-700 hover:bg-dark-50 transition-colors">
                  <User className="w-4 h-4 text-dark-400" />
                  Profil Akun
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-dark-700 hover:bg-dark-50 transition-colors">
                  <Settings className="w-4 h-4 text-dark-400" />
                  Pengaturan
                </button>
              </div>

              <div className="p-1.5 border-t border-dark-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar dari Sistem
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
