'use client';

import { useState, useEffect } from 'react';
import {
  ArrowUpFromLine, Plus, Search, Printer, Edit2, Trash2,
  X, FileText, CheckCircle2, AlertTriangle, RefreshCw
} from 'lucide-react';
import { mockTransaksiKeluar, mockBarang } from '@/lib/mock-data';
import { TIM_PEMOHON_LIST } from '@/types';
import type { TransaksiKeluar, Barang, JenisPengeluaran } from '@/types';
import { cn, formatDateShort, formatDate, formatTanggalTandaTangan } from '@/lib/utils';
import KopSurat from '@/components/KopSurat';
import {
  fetchAndSyncTransaksiKeluar,
  pushTransaksiKeluar,
  deleteTransaksiKeluarRemote,
  fetchAndSyncBarang,
  updateBarangStockRemote,
} from '@/lib/sync-service';

interface FormItem {
  id_barang: number;
  jumlah: number;
  keterangan: string;
}

export default function TransaksiKeluarPage() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTim, setFilterTim] = useState<string>('all');
  const [filterBarang, setFilterBarang] = useState<string>('all');
  const [showPrintPreview, setShowPrintPreview] = useState<TransaksiKeluar | null>(null);
  const [tglCetakDokumen, setTglCetakDokumen] = useState(() => new Date().toISOString().split('T')[0]);
  const [editItem, setEditItem] = useState<TransaksiKeluar | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<TransaksiKeluar | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  const [selectedTim, setSelectedTim] = useState('tim-sosial');
  const [formJenisPengeluaran, setFormJenisPengeluaran] = useState<JenisPengeluaran>('habis_pakai');
  const [barangList, setBarangList] = useState<Barang[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sipersedia_barang_list');
      if (stored !== null) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
      }
    }
    return mockBarang;
  });
  const [formItems, setFormItems] = useState<FormItem[]>([
    { id_barang: mockBarang[0]?.id || 1, jumlah: 1, keterangan: '' }
  ]);
  const [tglPermintaan, setTglPermintaan] = useState<string>(new Date().toISOString().split('T')[0]);
  const [keteranganPermintaan, setKeteranganPermintaan] = useState<string>('');
  const [transaksiList, setTransaksiList] = useState<TransaksiKeluar[]>([...mockTransaksiKeluar]);
  const [userRole, setUserRole] = useState<'admin' | 'user'>('admin');
  const [isSyncing, setIsSyncing] = useState(false);

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

    // Load persisted transactions if any
    const savedTrx = localStorage.getItem('sipersedia_transaksi_keluar');
    if (savedTrx) {
      try {
        setTransaksiList(JSON.parse(savedTrx));
      } catch (e) {
        console.error(e);
      }
    }

    // Load persisted barang list if any
    let loadedBarang = barangList;
    const savedBarang = localStorage.getItem('sipersedia_barang_list');
    if (savedBarang !== null) {
      try {
        const parsed = JSON.parse(savedBarang);
        if (Array.isArray(parsed)) {
          loadedBarang = parsed;
          setBarangList(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Ambil data barang terbaru dari cloud jika tersedia
    fetchAndSyncBarang().then((cloudBarang) => {
      if (cloudBarang && cloudBarang.length > 0) {
        loadedBarang = cloudBarang;
        setBarangList(cloudBarang);
      }
    });

    // Sinkronisasi otomatis data transaksi dari Cloud Database agar semua user/pegawai tersambung
    const doSync = async () => {
      setIsSyncing(true);
      const remoteData = await fetchAndSyncTransaksiKeluar(loadedBarang);
      if (remoteData) {
        setTransaksiList(remoteData);
      }
      setIsSyncing(false);
    };
    doSync();

    // Polling sync berkala setiap 5 detik agar input dari teman/pegawai lain otomatis masuk ke admin
    const syncInterval = setInterval(() => {
      fetchAndSyncTransaksiKeluar(loadedBarang).then((synced) => {
        if (synced) {
          setTransaksiList(synced);
        }
      });
    }, 5000);

    // Handle query params from Katalog (e.g. ?barang_id=1&action=minta)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const bId = params.get('barang_id');
      const action = params.get('action');

      if (action === 'minta' || bId) {
        const targetId = Number(bId);
        const bObj = mockBarang.find(b => b.id === targetId);
        setEditItem(null);
        setSelectedTim('tim-sosial');
        setFormJenisPengeluaran('habis_pakai');
        setTglPermintaan(new Date().toISOString().split('T')[0]);
        setKeteranganPermintaan(bObj ? `Kebutuhan operasional: ${bObj.nama_barang}` : '');
        setFormItems([
          { id_barang: targetId || mockBarang[0]?.id || 1, jumlah: 1, keterangan: '' }
        ]);
        setShowModal(true);
      }
    }

    return () => clearInterval(syncInterval);
  }, []);

  const isUser = userRole === 'user';

  const filtered = transaksiList.filter(t => {
    const matchSearch = t.no_dokumen.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.nama_tim.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.items.some(item => item.barang?.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchTim = filterTim === 'all' || t.tim_pemohon === filterTim;
    const matchBarang = filterBarang === 'all' || t.items.some(item => item.id_barang === Number(filterBarang));
    return matchSearch && matchTim && matchBarang;
  });

  const handleCreateNew = () => {
    setEditItem(null);
    setSelectedTim('tim-sosial');
    setFormJenisPengeluaran('habis_pakai');
    setTglPermintaan(new Date().toISOString().split('T')[0]);
    setKeteranganPermintaan('');
    setFormItems([
      { id_barang: barangList[0]?.id || mockBarang[0]?.id || 1, jumlah: 1, keterangan: '' }
    ]);
    setShowModal(true);
  };

  const handleEdit = (trx: TransaksiKeluar) => {
    setEditItem(trx);
    setSelectedTim(trx.tim_pemohon);
    setFormJenisPengeluaran(trx.jenis_pengeluaran || 'habis_pakai');
    setTglPermintaan(trx.tanggal);
    setKeteranganPermintaan(trx.keterangan || '');
    if (trx.items && trx.items.length > 0) {
      setFormItems(trx.items.map(item => ({
        id_barang: item.id_barang,
        jumlah: item.jumlah,
        keterangan: item.keterangan || '',
      })));
    } else {
      setFormItems([
        { id_barang: mockBarang[0]?.id || 1, jumlah: 1, keterangan: '' }
      ]);
    }
    setShowModal(true);
  };

  const handleDelete = (trx: TransaksiKeluar) => {
    setDeleteCandidate(trx);
  };

  const confirmDelete = async () => {
    if (deleteCandidate) {
      const docNo = deleteCandidate.no_dokumen;

      // Hapus di cloud database
      deleteTransaksiKeluarRemote(docNo);

      // Kembalikan stok master barang yang pernah dikeluarkan
      let nextBarang = [...barangList];
      deleteCandidate.items.forEach(itm => {
        nextBarang = nextBarang.map(b => {
          if (b.id === itm.id_barang) {
            return { ...b, stok: b.stok + itm.jumlah };
          }
          return b;
        });
      });
      setBarangList(nextBarang);
      localStorage.setItem('sipersedia_barang_list', JSON.stringify(nextBarang));

      const updated = transaksiList.filter(t => t.id !== deleteCandidate.id);
      setTransaksiList(updated);
      localStorage.setItem('sipersedia_transaksi_keluar', JSON.stringify(updated));
      setDeleteCandidate(null);
      setNotification({
        type: 'success',
        message: `Surat permintaan ${docNo} berhasil dihapus & stok barang dikembalikan.`,
      });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleAddItemRow = () => {
    setFormItems(prev => [
      ...prev,
      { id_barang: barangList[0]?.id || mockBarang[0]?.id || 1, jumlah: 1, keterangan: '' }
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (formItems.length > 1) {
      setFormItems(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof FormItem, value: any) => {
    setFormItems(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleSave = async () => {
    const timObj = TIM_PEMOHON_LIST.find(t => t.id === selectedTim) || TIM_PEMOHON_LIST[1];
    const preparedItems = formItems.map(fItem => {
      const bObj = barangList.find(b => b.id === fItem.id_barang) || mockBarang.find(b => b.id === fItem.id_barang) || mockBarang[0];
      return {
        id_barang: fItem.id_barang,
        jumlah: Number(fItem.jumlah) || 1,
        keterangan: (fItem.keterangan || '').trim(),
        jenis_pengeluaran: formJenisPengeluaran,
        barang: bObj,
      };
    });

    if (editItem) {
      const updatedTrx: TransaksiKeluar = {
        ...editItem,
        tanggal: tglPermintaan,
        tim_pemohon: timObj.id,
        nama_tim: timObj.nama_tim,
        penanggung_jawab: timObj.penanggung_jawab,
        nip_pj: timObj.nip_pj,
        jenis_pengeluaran: formJenisPengeluaran,
        items: preparedItems,
        keterangan: (keteranganPermintaan || '').trim(),
      };
      const updatedList = transaksiList.map(t => t.id === editItem.id ? updatedTrx : t);
      setTransaksiList(updatedList);
      localStorage.setItem('sipersedia_transaksi_keluar', JSON.stringify(updatedList));

      // Kirim pembaruan ke cloud
      pushTransaksiKeluar(updatedTrx);

      setShowModal(false);
      setNotification({
        type: 'success',
        message: `Surat permintaan ${editItem.no_dokumen} berhasil diperbarui.`,
      });
      setTimeout(() => setNotification(null), 4000);
    } else {
      const newTrx: TransaksiKeluar = {
        id: Date.now(),
        no_dokumen: `BK-${new Date(tglPermintaan).getFullYear()}/${String(new Date(tglPermintaan).getMonth() + 1).padStart(2, '0')}/${String(transaksiList.length + 1).padStart(3, '0')}`,
        tanggal: tglPermintaan,
        tim_pemohon: timObj.id,
        nama_tim: timObj.nama_tim,
        penanggung_jawab: timObj.penanggung_jawab,
        nip_pj: timObj.nip_pj,
        jenis_pengeluaran: formJenisPengeluaran,
        items: preparedItems,
        keterangan: (keteranganPermintaan || '').trim(),
        created_by: 'usr-001',
        created_at: new Date().toISOString(),
      };
      const updatedList = [newTrx, ...transaksiList];
      setTransaksiList(updatedList);
      localStorage.setItem('sipersedia_transaksi_keluar', JSON.stringify(updatedList));

      // Kirim transaksi ke cloud database agar langsung muncul di laptop admin & pegawai lain
      pushTransaksiKeluar(newTrx);

      // Kurangi stok master barang sesuai jumlah barang keluar (Lokal & Cloud)
      let nextBarang = [...barangList];
      preparedItems.forEach(pItem => {
        nextBarang = nextBarang.map(b => {
          if (b.id === pItem.id_barang) {
            const newStock = Math.max(0, b.stok - pItem.jumlah);
            updateBarangStockRemote(b.id, newStock);
            return { ...b, stok: newStock };
          }
          return b;
        });
      });
      setBarangList(nextBarang);
      localStorage.setItem('sipersedia_barang_list', JSON.stringify(nextBarang));

      setShowModal(false);
      setNotification({
        type: 'success',
        message: `Surat permintaan ${newTrx.no_dokumen} berhasil diajukan dan stok persediaan telah disesuaikan.`,
      });
      setTimeout(() => setNotification(null), 4000);
      setShowPrintPreview(newTrx);
    }
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = ' ';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="page-enter space-y-6">
      {/* Konten Dashboard (Disembunyikan saat mencetak dokumen) */}
      <div className="print:hidden space-y-6">
        {/* Header — Dinamis sesuai Role Admin vs User */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">
            {isUser ? 'Permintaan Barang (SPB)' : 'Pengeluaran / Pemakaian Barang'}
          </h1>
          <p className="text-sm text-dark-400 mt-1">
            {isUser
              ? 'Ajukan permohonan ATK/cetakan dan cetak Surat Permintaan Barang untuk pengambilan'
              : 'Verifikasi, persetujuan, dan pencatatan barang keluar dari gudang persediaan'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateNew}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            {isUser ? 'Buat Surat Permintaan' : 'Catat Pengeluaran'}
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-orange-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-bps-orange" />
          </div>
          <div>
            <p className="text-xl font-bold text-dark-800">{transaksiList.length}</p>
            <p className="text-xs text-dark-400">
              {isUser ? 'Total Surat Permintaan' : 'Total Dokumen Pengeluaran'}
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-blue-50 flex items-center justify-center">
            <ArrowUpFromLine className="w-5 h-5 text-bps-blue" />
          </div>
          <div>
            <p className="text-xl font-bold text-dark-800">
              {transaksiList.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.jumlah, 0), 0)}
            </p>
            <p className="text-xs text-dark-400">
              {isUser ? 'Total Item Diminta' : 'Total Item Disalurkan'}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Dropdown (Tim & Barang) */}
      <div className="card p-4 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 text-xs py-2 w-full"
            placeholder="Cari nomor surat, tim pemohon, atau nama barang..."
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Dropdown Filter Tim */}
          <select
            value={filterTim}
            onChange={(e) => setFilterTim(e.target.value)}
            className="input text-xs py-2 md:w-48 bg-white"
          >
            <option value="all">Semua Tim / Subbag</option>
            {TIM_PEMOHON_LIST.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nama_tim}
              </option>
            ))}
          </select>
          {/* Dropdown Filter Barang */}
          <select
            value={filterBarang}
            onChange={(e) => setFilterBarang(e.target.value)}
            className="input text-xs py-2 md:w-56 bg-white"
          >
            <option value="all">Semua Barang Persediaan</option>
            {barangList.map((b) => (
              <option key={b.id} value={String(b.id)}>
                {b.nama_barang}
              </option>
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
                <th>No</th>
                <th>Nama Barang</th>
                <th>Satuan</th>
                <th>Jumlah</th>
                <th>Tim Pemohon</th>
                <th>Keterangan</th>
                <th>Aksi / Dokumen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((trx) => (
                <tr key={trx.id}>
                  <td>
                    <span className="font-mono text-xs text-bps-blue font-bold">
                      {trx.no_dokumen}
                    </span>
                  </td>
                  <td>
                    <div className="space-y-1">
                      {trx.items.map((item, idx) => (
                        <p key={idx} className="font-semibold text-dark-800 text-sm">
                          {item.barang?.nama_barang}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      {trx.items.map((item, idx) => (
                        <p key={idx} className="text-xs text-dark-500">
                          {item.barang?.satuan?.nama_satuan}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      {trx.items.map((item, idx) => (
                        <p key={idx} className="text-xs font-bold text-dark-800">
                          {item.jumlah}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="font-semibold text-dark-700 text-xs">{trx.nama_tim}</p>
                      <p className="text-[10px] text-dark-400">PJ: {trx.penanggung_jawab}</p>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      {trx.jenis_pengeluaran === 'rusak' && (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-700 border border-red-200">
                          Barang Rusak
                        </span>
                      )}
                      {trx.jenis_pengeluaran === 'usang' && (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                          Barang Usang
                        </span>
                      )}
                      {(!trx.jenis_pengeluaran || trx.jenis_pengeluaran === 'habis_pakai') && (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          Habis Pakai
                        </span>
                      )}
                      {trx.items.map((item, idx) => (
                        <p key={idx} className="text-xs text-dark-400">
                          {item.keterangan || '-'}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {/* Tombol Cetak Surat Permintaan Barang */}
                      <button
                        onClick={() => setShowPrintPreview(trx)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-bps-blue text-white hover:bg-bps-blue-600 shadow-sm transition-all"
                        title="Cetak Formulir Permintaan Barang"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak Surat</span>
                      </button>

                      {/* Tombol Edit — Aktif untuk role Pegawai dan Admin */}
                      <button
                        onClick={() => handleEdit(trx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors shadow-xs"
                        title="Edit Surat Permintaan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {/* Tombol Hapus — Aktif untuk role Pegawai dan Admin */}
                      <button
                        onClick={() => handleDelete(trx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors shadow-xs"
                        title="Hapus Surat Permintaan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <FileText className="w-12 h-12 text-dark-200 mx-auto mb-3" />
                    <p className="text-dark-700 font-semibold text-sm">Belum Ada Permintaan / Pengeluaran Barang</p>
                    <p className="text-dark-400 text-xs mt-1 max-w-md mx-auto leading-relaxed">
                      Data transaksi telah di-reset bersih. Silakan klik tombol <strong>&quot;{isUser ? 'Buat Permintaan Baru' : 'Catat Barang Keluar'}&quot;</strong> di atas untuk mencoba simulasi alur Surat Permintaan Barang (SPB).
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Buat / Edit Permintaan */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-center justify-between p-5 border-b border-dark-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-dark-800">
                  {editItem
                    ? (isUser ? 'Edit Surat Permintaan Barang (SPB)' : 'Edit Dokumen Pengeluaran Barang')
                    : (isUser ? 'Formulir Permintaan Barang (ATK)' : 'Pencatatan Pengeluaran Barang')}
                </h2>
                <p className="text-xs text-dark-400 mt-0.5">
                  {editItem
                    ? `Perbarui rincian untuk ${editItem.no_dokumen}`
                    : (isUser ? 'Isi daftar barang yang dibutuhkan oleh Tim Kerja BPS' : 'Validasi pengeluaran fisik barang dari gudang')}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-dark-400 hover:bg-dark-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="input-label text-xs font-semibold text-dark-700">
                      Tim Pemohon & Penanggung Jawab (PJ) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedTim}
                      onChange={(e) => setSelectedTim(e.target.value)}
                      className="input text-xs"
                    >
                      {TIM_PEMOHON_LIST.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.nama_tim} — PJ: {t.penanggung_jawab}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="input-label text-xs font-semibold text-dark-700">
                      Tanggal Permintaan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="input text-xs"
                      value={tglPermintaan}
                      onChange={(e) => setTglPermintaan(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="input-label text-xs font-semibold text-dark-700">
                      Jenis Pengeluaran / Kondisi <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formJenisPengeluaran}
                      onChange={(e) => setFormJenisPengeluaran(e.target.value as JenisPengeluaran)}
                      className="input text-xs font-medium text-dark-800"
                    >
                      <option value="habis_pakai">Barang Habis Pakai (Reguler)</option>
                      <option value="rusak">Barang Rusak</option>
                      <option value="usang">Barang Usang</option>
                    </select>
                  </div>
                </div>

                {/* Info Card Penanggung Jawab Tim yang Dipilih */}
                {(() => {
                  const activeTim = TIM_PEMOHON_LIST.find(t => t.id === selectedTim) || TIM_PEMOHON_LIST[2];
                  return (
                    <div className="p-2.5 bg-bps-blue-50/70 rounded-xl border border-bps-blue/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs animate-fade-in">
                      <div className="flex items-center gap-1.5">
                        <span className="text-dark-500 font-medium">Penanggung Jawab:</span>
                        <span className="font-bold text-dark-800">{activeTim.penanggung_jawab}</span>
                      </div>
                      <div className="text-dark-500 text-[11px]">
                        NIP: <span className="font-mono font-semibold text-dark-700">{activeTim.nip_pj}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Rincian Item Barang */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="input-label mb-0">Rincian Barang yang Diminta</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-bps-blue hover:text-bps-blue-700 bg-bps-blue-50 px-2.5 py-1 rounded-lg border border-bps-blue/20 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Barang</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {formItems.map((fItem, idx) => (
                    <div key={idx} className="p-3 bg-dark-50/70 border border-dark-100 rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-dark-500 uppercase tracking-wide">
                          Item #{idx + 1}
                        </span>
                        {formItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="p-1 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                            title="Hapus baris barang ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="input-label text-[11px] font-semibold text-dark-600 mb-1">
                          Pilih Barang Persediaan <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={fItem.id_barang}
                          onChange={(e) => handleItemChange(idx, 'id_barang', Number(e.target.value))}
                          className="input text-xs font-medium"
                          required
                        >
                          {barangList.map(b => (
                            <option key={b.id} value={b.id}>
                              [{b.kode_barang}] {b.nama_barang} (Sisa Stok: {b.stok} {b.satuan?.nama_satuan || 'Buah'})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <input
                            type="number"
                            min="1"
                            className="input text-xs"
                            value={fItem.jumlah}
                            onChange={(e) => handleItemChange(idx, 'jumlah', Number(e.target.value))}
                            placeholder="Jumlah"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            className="input text-xs"
                            value={fItem.keterangan}
                            onChange={(e) => handleItemChange(idx, 'keterangan', e.target.value)}
                            placeholder="Keterangan item (opsional)"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="input-label text-xs font-semibold text-dark-700">Catatan Dokumen / Keperluan Permintaan</label>
                <textarea
                  className="input min-h-[65px] resize-none text-xs"
                  value={keteranganPermintaan}
                  onChange={(e) => setKeteranganPermintaan(e.target.value)}
                  placeholder="Contoh: Kebutuhan Pelaksanaan Sakernas / Susenas / Pengarsipan Dokumen Lapangan..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-dark-100 bg-dark-50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="btn-secondary">
                Batal
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
              >
                <CheckCircle2 className="w-4 h-4" />
                {editItem
                  ? 'Simpan Perubahan'
                  : (isUser ? 'Simpan & Siapkan Cetak Surat' : 'Simpan Pengeluaran')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteCandidate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-in-up">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-dark-800">
                  {isUser ? 'Hapus Surat Permintaan' : 'Hapus Dokumen Pengeluaran'}
                </h3>
                <p className="text-xs text-dark-400">Konfirmasi tindakan penghapusan</p>
              </div>
            </div>

            <p className="text-sm text-dark-600 mb-4">
              Apakah Anda yakin ingin menghapus surat permintaan{' '}
              <span className="font-bold text-dark-800 font-mono">{deleteCandidate.no_dokumen}</span> untuk{' '}
              <span className="font-semibold text-dark-800">{deleteCandidate.nama_tim}</span>?
            </p>

            <div className="bg-dark-50 rounded-xl p-3 mb-6 text-xs text-dark-500 space-y-1">
              <div className="flex justify-between">
                <span>Tanggal Permintaan:</span>
                <span className="font-semibold text-dark-700">{formatDateShort(deleteCandidate.tanggal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Penanggung Jawab:</span>
                <span className="font-semibold text-dark-700">{deleteCandidate.penanggung_jawab}</span>
              </div>
              <div className="flex justify-between">
                <span>Jumlah Macam Barang:</span>
                <span className="font-semibold text-dark-700">{deleteCandidate.items.length} item</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="btn-secondary text-xs"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Print Preview — SURAT PERMINTAAN BARANG ATK/CETAKAN/DLL (Persis Format Gambar) */}
      {showPrintPreview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-center justify-between p-4 border-b border-dark-100 no-print sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-bps-blue" />
                <h2 className="text-base font-bold text-dark-800">
                  Surat Permintaan Barang ATK/Cetakan/DLL
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-dark-50 border border-dark-200 rounded-lg px-2.5 py-1">
                  <span className="text-xs font-medium text-dark-600">Tanggal Dokumen:</span>
                  <input
                    type="date"
                    value={tglCetakDokumen}
                    onChange={(e) => setTglCetakDokumen(e.target.value)}
                    className="text-xs bg-white border border-dark-300 rounded px-1.5 py-0.5 text-dark-800 focus:outline-none focus:ring-1 focus:ring-bps-blue"
                    title="Pilih tanggal cetak dokumen (tanggal tanda tangan akan otomatis menyesuaikan)"
                  />
                </div>
                <button onClick={handlePrint} className="btn-primary text-xs py-2 px-3">
                  <Printer className="w-4 h-4" /> Cetak Dokumen
                </button>
                <button onClick={() => setShowPrintPreview(null)} className="p-1.5 rounded-lg text-dark-400 hover:bg-dark-50">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Injeksi Style Cetak: Kunci A4 PORTRAIT untuk Surat Permintaan Barang — Bersih Tanpa Header/Footer Browser (1/1) */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                @page {
                  size: A4 portrait !important;
                  margin: 0 !important;
                }
                html, body {
                  margin: 0 !important;
                  padding: 0 !important;
                  background: #ffffff !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                #print-area {
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                  padding: 8mm 12mm 8mm 12mm !important;
                  width: 100% !important;
                  height: 295mm !important;
                  min-height: 295mm !important;
                  max-height: 295mm !important;
                  display: flex !important;
                  flex-direction: column !important;
                  justify-content: space-between !important;
                  box-sizing: border-box !important;
                }
              }
            `}} />

            <div className="p-8 print:p-0 text-black bg-white" id="print-area">
              {/* KOP SURAT RESMI BPS */}
              <KopSurat />

              {/* No & Tahun — Pas Rapat di Garis Kanan & Tetap 1 Baris Penuh */}
              <div className="flex justify-end mb-4 print:mb-4 text-xs print:text-[11pt]">
                <div className="text-black">
                  <div className="flex items-center justify-start gap-1.5 whitespace-nowrap">
                    <span className="w-14 font-semibold shrink-0">No</span>
                    <span
                      className="font-semibold whitespace-nowrap"
                      style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', hyphens: 'none' }}
                    >
                      : {(showPrintPreview.no_dokumen || '').replace(/-/g, '\u2011')}
                    </span>
                  </div>
                  <div className="flex items-center justify-start gap-1.5 whitespace-nowrap">
                    <span className="w-14 font-semibold shrink-0">Tahun</span>
                    <span className="font-semibold whitespace-nowrap">
                      : {new Date(tglCetakDokumen || showPrintPreview.tanggal).getFullYear() || 2026}
                    </span>
                  </div>
                </div>
              </div>

              {/* Judul Formulir (Tengah) */}
              <div className="text-center mb-6 print:mb-5">
                <h4 className="font-extrabold text-black text-sm print:text-base tracking-wide">
                  SURAT PERMINTAAN BARANG
                </h4>
                <h4 className="font-extrabold text-black text-sm print:text-base tracking-wide">
                  ATK/CETAKAN/DLL
                </h4>
              </div>

              {/* Tim Pemohon (Font Normal tidak di-bold sesuai Gambar 3) */}
              <div className="text-xs print:text-[11pt] mb-3 text-black">
                <p className="font-normal">
                  <span className="font-medium">Tim :</span> {showPrintPreview.nama_tim}
                </p>
              </div>

              {/* Tabel Permintaan Sesuai Format Kolom Gambar User - Proporsi Tinggi Isi A4 */}
              <table className="w-full border-collapse border border-black text-xs print:text-[11pt] mb-8 print:mb-6">
                <thead>
                  <tr className="bg-gray-100 text-black font-bold text-center">
                    <th className="border border-black px-2 py-2 print:py-2.5 w-10">No</th>
                    <th className="border border-black px-3 py-2 print:py-2.5 text-center">Nama Barang</th>
                    <th className="border border-black px-3 py-2 print:py-2.5 text-center w-28 print:w-32">Satuan</th>
                    <th className="border border-black px-3 py-2 print:py-2.5 text-center w-20 print:w-24">Jumlah</th>
                    <th className="border border-black px-3 py-2 print:py-2.5 text-center">Keterangan</th>
                  </tr>
                  {/* Baris penomoran (1)-(5): Ramping */}
                  <tr className="bg-gray-50 text-[9px] print:text-[10pt] text-gray-700 font-bold text-center h-4">
                    <th className="border border-black py-0.5 px-1 leading-tight">(1)</th>
                    <th className="border border-black py-0.5 px-1 leading-tight">(2)</th>
                    <th className="border border-black py-0.5 px-1 leading-tight">(3)</th>
                    <th className="border border-black py-0.5 px-1 leading-tight">(4)</th>
                    <th className="border border-black py-0.5 px-1 leading-tight">(5)</th>
                  </tr>
                </thead>
                <tbody>
                  {showPrintPreview.items.map((item, idx) => (
                    <tr key={idx} className="text-black">
                      <td className="border border-black px-2 py-2.5 print:py-3.5 text-center font-medium">{idx + 1}</td>
                      <td className="border border-black px-3 py-2.5 print:py-3.5 font-medium">{item.barang?.nama_barang}</td>
                      <td className="border border-black px-3 py-2.5 print:py-3.5 text-center">{item.barang?.satuan?.nama_satuan}</td>
                      <td className="border border-black px-3 py-2.5 print:py-3.5 text-center font-normal">{item.jumlah}</td>
                      <td className="border border-black px-3 py-2.5 print:py-3.5 text-center">{item.keterangan || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Catatan Dokumen / Keperluan Permintaan (Di luar kolom / di bawah tabel persis seperti contoh gambar) */}
              <p className="text-xs print:text-[11pt] text-gray-700 mb-6 print:mb-6 italic">
                Catatan: {showPrintPreview.keterangan || '-'}
              </p>

              {/* Tanda Tangan Format Resmi BPS - Proporsi Jarak Mantap Mengisi Halaman A4 */}
              <div className="w-full flex items-start justify-between text-xs print:text-[11pt] text-black mt-8 pt-2 print:mt-auto avoid-break">
                {/* Kolom Kiri: Administrator Gudang */}
                <div className="w-72 text-center flex flex-col items-center">
                  <p className="font-semibold text-black">Administrator Gudang</p>
                  <p className="font-semibold text-black">Kuasa Pengguna Barang</p>
                  <div className="h-16 print:h-24" />
                  <p className="text-center">
                    <span className="border-b border-black pb-0.5 font-bold text-black inline-block">
                      Guspita Karleni, S.Si
                    </span>
                  </p>
                  <p className="mt-1 text-black font-medium text-[11px] print:text-[10.5pt] text-center">NIP. 19970806 202521 2039</p>
                </div>

                {/* Kolom Kanan: Penanggung Jawab Tim Pemohon */}
                <div className="w-72 text-center flex flex-col items-center">
                  <p className="text-black font-medium">{formatTanggalTandaTangan(tglCetakDokumen)}</p>
                  <p className="font-semibold text-black">Penanggung Jawab</p>
                  <div className="h-16 print:h-24" />
                  <p className="text-center">
                    <span className="border-b border-black pb-0.5 font-bold text-black inline-block">
                      {showPrintPreview.penanggung_jawab || '............................................................'}
                    </span>
                  </p>
                  <p className="mt-1 text-black font-medium text-[11px] print:text-[10.5pt] text-center">NIP. {showPrintPreview.nip_pj || '....................................'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
