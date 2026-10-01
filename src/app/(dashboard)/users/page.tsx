'use client';

import { useState } from 'react';
import {
  Users, Plus, Search, Edit2, Trash2, UserCheck, UserX, Shield, User, X, Mail, Building2,
} from 'lucide-react';
import { mockUsers } from '@/lib/mock-data';
import { cn, formatDateShort } from '@/lib/utils';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);

  const filtered = mockUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.bidang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = mockUsers.filter(u => u.is_active).length;

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Manajemen User</h1>
          <p className="text-sm text-dark-400 mt-1">Kelola pengguna sistem SIPERSEDIA</p>
        </div>
        <button onClick={() => { setEditUser(null); setShowModal(true); }} className="btn-primary">
          <Plus className="w-4 h-4" />
          Tambah User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-blue-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-bps-blue" />
          </div>
          <div>
            <p className="text-xl font-bold text-dark-800">{mockUsers.length}</p>
            <p className="text-xs text-dark-400">Total User</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-green-50 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-bps-green" />
          </div>
          <div>
            <p className="text-xl font-bold text-bps-green">{activeCount}</p>
            <p className="text-xs text-dark-400">Aktif</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-dark-50 flex items-center justify-center">
            <UserX className="w-5 h-5 text-dark-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-dark-400">{mockUsers.length - activeCount}</p>
            <p className="text-xs text-dark-400">Nonaktif</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-300" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10" placeholder="Cari nama, email, atau bidang..." />
        </div>
      </div>

      {/* User cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((user) => (
          <div key={user.id} className={cn(
            'card p-5 transition-all duration-200',
            !user.is_active && 'opacity-60',
          )}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold',
                  user.role === 'admin'
                    ? 'bg-gradient-to-br from-bps-blue to-bps-blue-700'
                    : 'bg-gradient-to-br from-bps-teal to-bps-teal-700',
                )}>
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-semibold text-dark-800 text-sm">{user.name}</h3>
                  <p className="text-xs text-dark-400">{user.email}</p>
                </div>
              </div>
              <span className={cn(
                'badge text-[10px]',
                user.role === 'admin' ? 'bg-bps-blue-50 text-bps-blue-700' : 'bg-bps-teal-50 text-bps-teal-700',
              )}>
                {user.role === 'admin' ? '🔑 Admin' : '👤 User'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-dark-500">
                <Building2 className="w-3.5 h-3.5 text-dark-300" />
                {user.bidang}
              </div>
              {user.nip && (
                <div className="flex items-center gap-2 text-sm text-dark-500">
                  <Shield className="w-3.5 h-3.5 text-dark-300" />
                  NIP: {user.nip}
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-400">Status:</span>
                <span className={cn(
                  'badge text-[10px]',
                  user.is_active ? 'bg-bps-green-50 text-bps-green-700' : 'bg-dark-100 text-dark-400',
                )}>
                  {user.is_active ? '● Aktif' : '○ Nonaktif'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-dark-100">
              <button
                onClick={() => { setEditUser(user); setShowModal(true); }}
                className="flex-1 btn-secondary text-xs py-2"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button className="p-2 rounded-lg text-dark-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal — tanpa field No. Telepon */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-center justify-between p-5 border-b border-dark-100">
              <h2 className="text-lg font-semibold text-dark-800">
                {editUser ? 'Edit User' : 'Tambah User Baru'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-dark-400 hover:bg-dark-50">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="input-label">Nama Lengkap</label>
                <input className="input" placeholder="Nama lengkap" defaultValue={editUser?.name || ''} />
              </div>
              <div>
                <label className="input-label">NIP / Username</label>
                <input className="input" placeholder="199003142010011001" defaultValue={editUser?.nip || ''} />
              </div>
              <div>
                <label className="input-label">Email</label>
                <input type="email" className="input" placeholder="nama@bps-okus.go.id" defaultValue={editUser?.email || ''} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Role</label>
                  <select className="input" defaultValue={editUser?.role || 'user'}>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Bidang / Tim</label>
                  <select className="input" defaultValue={editUser?.bidang || ''}>
                    <option value="">Pilih bidang</option>
                    <option>Subbagian Umum</option>
                    <option>Kepala</option>
                    <option>Tim Umum</option>
                    <option>Tim Statistik Sosial</option>
                    <option>Tim Statistik Distribusi</option>
                    <option>Tim Pertanian</option>
                    <option>Tim IPDS</option>
                    <option>Tim Nerwilis</option>
                    <option>Tim PEK dan KTIP</option>
                  </select>
                </div>
              </div>
              {!editUser && (
                <div>
                  <label className="input-label">Password</label>
                  <input type="password" className="input" placeholder="Password minimal 8 karakter" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={editUser?.is_active ?? true} />
                  <div className="w-9 h-5 bg-dark-200 peer-focus:ring-2 peer-focus:ring-bps-blue-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-bps-green after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
                <span className="text-sm text-dark-600">User Aktif</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-dark-100 bg-dark-50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Batal</button>
              <button className="btn-primary">
                {editUser ? 'Simpan Perubahan' : 'Tambah User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
