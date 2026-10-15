'use client';

import { useState, useEffect } from 'react';
import {
  ArrowDownToLine, Plus, Search, Printer, Edit2, Trash2,
  FileText, Calendar, X, AlertTriangle, CheckCircle2, PlusCircle, Trash,
} from 'lucide-react';
import { mockTransaksiMasuk, mockBarang } from '@/lib/mock-data';
import type { TransaksiMasuk, SumberBarangMasuk, Barang } from '@/types';
import { cn, formatCurrency, formatDateShort, formatDate, formatTanggalTandaTangan } from '@/lib/utils';
import KopSurat from '@/components/KopSurat';

interface FormMasukItem {
  id_barang: number;
  jumlah: number;
  keterangan: string;
}

export default function TransaksiMasukPage() {
  const [transaksiList, setTransaksiList] = useState<TransaksiMasuk[]>([...mockTransaksiMasuk]);
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
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrintPreview, setShowPrintPreview] = useState<TransaksiMasuk | null>(null);
  const [editItem, setEditItem] = useState<TransaksiMasuk | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<TransaksiMasuk | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  // Quick Add Master Barang Modal State
  const [showQuickAddBarang, setShowQuickAddBarang] = useState(false);
  const [quickAddIdx, setQuickAddIdx] = useState<number>(0);
  const [quickNamaBarang, setQuickNamaBarang] = useState('');
  const [quickSatuan, setQuickSatuan] = useState('Buah');
  const [quickKategori, setQuickKategori] = useState('Alat Tulis Kantor');

  // Form State
  const [formSumber, setFormSumber] = useState<SumberBarangMasuk>('Pembelian');
  const [formTanggal, setFormTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formNoReferensi, setFormNoReferensi] = useState<string>('');
  const [formItems, setFormItems] = useState<FormMasukItem[]>([
    { id_barang: mockBarang[0]?.id || 1, jumlah: 10, keterangan: '' }
  ]);
  const [formKeterangan, setFormKeterangan] = useState<string>('');
  const [tglCetakDokumen, setTglCetakDokumen] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Load persisted incoming transactions
    const savedTrx = localStorage.getItem('sipersedia_transaksi_masuk');
    if (savedTrx) {
      try {
        const parsed = JSON.parse(savedTrx);
        if (Array.isArray(parsed)) {
          setTransaksiList(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem('sipersedia_transaksi_masuk', JSON.stringify(mockTransaksiMasuk));
    }

    // Load barang list
    const savedBarang = localStorage.getItem('sipersedia_barang_list');
    if (savedBarang !== null) {
      try {
        const parsed = JSON.parse(savedBarang);
        if (Array.isArray(parsed)) {
          setBarangList(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const filtered = transaksiList.filter(t =>
    t.no_dokumen.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.no_referensi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.items.some(item => item.barang?.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalItemsBulanIni = filtered.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.jumlah, 0), 0);
  const totalPembelianBulanIni = filtered.filter(t => t.sumber === 'Pembelian').length;
  const totalTransferBulanIni = filtered.filter(t => t.sumber === 'Transfer Masuk').length;

  const handleOpenAdd = () => {
    setEditItem(null);
    setFormSumber('Pembelian');
    setFormTanggal(new Date().toISOString().split('T')[0]);
    setFormNoReferensi(`NOTA/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(transaksiList.length + 1).padStart(3, '0')}`);
    setFormItems([
      { id_barang: barangList[0]?.id || 1, jumlah: 10, keterangan: '' }
    ]);
    setFormKeterangan('');
    setShowModal(true);
  };

  const handleSumberChange = (sumber: SumberBarangMasuk) => {
    setFormSumber(sumber);
    if (!editItem) {
      if (sumber === 'Pembelian') {
        setFormNoReferensi(`NOTA/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(transaksiList.length + 1).padStart(3, '0')}`);
      } else {
        setFormNoReferensi(`BAST/BPS-SUMSEL/${String(transaksiList.length + 1).padStart(3, '0')}/${new Date().getFullYear()}`);
      }
    }
  };

  const handleOpenEdit = (trx: TransaksiMasuk) => {
    setEditItem(trx);
    setFormSumber(trx.sumber);
    setFormTanggal(trx.tanggal);
    setFormNoReferensi(trx.no_referensi || '');
    setFormKeterangan(trx.keterangan || '');
    if (trx.items && trx.items.length > 0) {
      setFormItems(trx.items.map(item => ({
        id_barang: item.id_barang,
        jumlah: item.jumlah,
        keterangan: item.keterangan || '',
      })));
    } else {
      setFormItems([
        { id_barang: barangList[0]?.id || 1, jumlah: 1, keterangan: '' }
      ]);
    }
    setShowModal(true);
  };

  const addFormItem = () => {
    setFormItems(prev => [
      ...prev,
      { id_barang: barangList[0]?.id || 1, jumlah: 1, keterangan: '' }
    ]);
  };

  const removeFormItem = (idx: number) => {
    if (formItems.length <= 1) return;
    setFormItems(prev => prev.filter((_, i) => i !== idx));
  };

  const updateFormItem = (idx: number, field: keyof FormMasukItem, value: any) => {
    setFormItems(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  // Handler Tambah Cepat Barang Baru langsung dari formulir transaksi masuk
  const handleSaveQuickBarang = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNamaBarang.trim()) {
      alert('Nama barang tidak boleh kosong!');
      return;
    }
    const newB: Barang = {
      id: Date.now(),
      kode_barang: '-',
      nama_barang: quickNamaBarang.trim(),
      id_kategori: 1,
      id_satuan: 1,
      id_lokasi: 1,
      stok: 0,
      stok_minimum: 0,
      foto_url: null,
      deskripsi: 'Ditambahkan via Transaksi Masuk',
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0],
      kategori: { id: 1, nama_kategori: quickKategori, deskripsi: null, created_at: '' },
      satuan: { id: 1, nama_satuan: quickSatuan, created_at: '' },
      lokasi: { id: 1, nama_lokasi: 'Gudang ATK', deskripsi: null, created_at: '' },
    };
    const updatedBarang = [newB, ...barangList];
    setBarangList(updatedBarang);
    localStorage.setItem('sipersedia_barang_list', JSON.stringify(updatedBarang));
    updateFormItem(quickAddIdx, 'id_barang', newB.id);
    setShowQuickAddBarang(false);
    setQuickNamaBarang('');
    showToast(`Barang baru "${newB.nama_barang}" berhasil ditambahkan & langsung dipilih!`, 'success');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formItems.length === 0) {
      alert('Tambahkan minimal 1 item barang');
      return;
    }
    if (formItems.some(i => i.jumlah <= 0)) {
      alert('Jumlah semua barang masuk harus lebih dari 0');
      return;
    }

    const preparedItems = formItems.map(item => {
      const b = barangList.find(b => b.id === Number(item.id_barang));
      return {
        id_barang: Number(item.id_barang),
        jumlah: Number(item.jumlah),
        harga_satuan: null,
        keterangan: item.keterangan.trim() || null,
        barang: b,
      };
    });

    let updatedList: TransaksiMasuk[];
    let nextBarang = [...barangList];

    if (editItem) {
      // 1. Revert stok lama
      editItem.items.forEach(oldItem => {
        nextBarang = nextBarang.map(b => {
          if (b.id === oldItem.id_barang) {
            return { ...b, stok: Math.max(0, b.stok - oldItem.jumlah) };
          }
          return b;
        });
      });

      // 2. Tambah stok baru
      preparedItems.forEach(newItem => {
        nextBarang = nextBarang.map(b => {
          if (b.id === newItem.id_barang) {
            return { ...b, stok: b.stok + newItem.jumlah };
          }
          return b;
        });
      });

      // 3. Update transaksi list
      updatedList = transaksiList.map(t => {
        if (t.id === editItem.id) {
          return {
            ...t,
            tanggal: formTanggal,
            sumber: formSumber,
            no_referensi: formNoReferensi.trim() || null,
            keterangan: formKeterangan.trim() || null,
            items: preparedItems,
          };
        }
        return t;
      });

      showToast(`Transaksi ${editItem.no_dokumen} berhasil diperbarui!`, 'success');
    } else {
      // Transaksi baru
      preparedItems.forEach(newItem => {
        nextBarang = nextBarang.map(b => {
          if (b.id === newItem.id_barang) {
            return { ...b, stok: b.stok + newItem.jumlah };
          }
          return b;
        });
      });

      const docNo = `BM-${new Date(formTanggal).getFullYear()}/${String(new Date(formTanggal).getMonth() + 1).padStart(2, '0')}/${String(transaksiList.length + 1).padStart(3, '0')}`;
      const newTrx: TransaksiMasuk = {
        id: Date.now(),
        no_dokumen: docNo,
        tanggal: formTanggal,
        sumber: formSumber,
        no_referensi: formNoReferensi.trim() || null,
        items: preparedItems,
        keterangan: formKeterangan.trim() || `Penerimaan ${formSumber}`,
        created_by: 'admin-001',
        created_at: new Date().toISOString(),
      };
      updatedList = [newTrx, ...transaksiList];
      showToast(`Dokumen transaksi masuk ${newTrx.no_dokumen} (${preparedItems.length} item) berhasil dicatat!`, 'success');
    }

    setBarangList(nextBarang);
    localStorage.setItem('sipersedia_barang_list', JSON.stringify(nextBarang));
    setTransaksiList(updatedList);
    localStorage.setItem('sipersedia_transaksi_masuk', JSON.stringify(updatedList));
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (!deleteCandidate) return;
    const targetDoc = deleteCandidate.no_dokumen;

    // Kurangi stok master barang yang pernah ditambahkan oleh dokumen ini
    let nextBarang = [...barangList];
    deleteCandidate.items.forEach(itm => {
      nextBarang = nextBarang.map(b => {
        if (b.id === itm.id_barang) {
          return { ...b, stok: Math.max(0, b.stok - itm.jumlah) };
        }
        return b;
      });
    });
    setBarangList(nextBarang);
    localStorage.setItem('sipersedia_barang_list', JSON.stringify(nextBarang));

    const updated = transaksiList.filter(t => t.id !== deleteCandidate.id);
    setTransaksiList(updated);
    localStorage.setItem('sipersedia_transaksi_masuk', JSON.stringify(updated));
    setDeleteCandidate(null);
    showToast(`Transaksi ${targetDoc} berhasil dihapus & stok disesuaikan.`, 'info');
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Transaksi Masuk</h1>
          <p className="text-sm text-dark-400 mt-1">Catat barang masuk dari pembelian atau transfer dari provinsi</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setEditItem(null); setFormSumber('Pembelian'); setShowModal(true); }} className="btn-primary">
            <Plus className="w-4 h-4" />
            Tambah Transaksi
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-green-50 flex items-center justify-center">
            <ArrowDownToLine className="w-5 h-5 text-bps-green" />
          </div>
          <div>
            <p className="text-xl font-bold text-dark-800">{filtered.length}</p>
            <p className="text-xs text-dark-400">Transaksi Bulan Ini</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-blue-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-bps-blue" />
          </div>
          <div>
            <p className="text-xl font-bold text-dark-800">{totalItemsBulanIni}</p>
            <p className="text-xs text-dark-400">Total Item Masuk</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bps-teal-50 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-bps-teal" />
          </div>
          <div>
            <p className="text-xl font-bold text-dark-800">
              {totalPembelianBulanIni} Nota / {totalTransferBulanIni} BAST
            </p>
            <p className="text-xs text-dark-400">Penerimaan Bulan Ini</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
            placeholder="Cari no dokumen, no BAST, atau nama barang..."
          />
        </div>
      </div>

      {/* Table — per No Dokumen (Master-Detail) */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No. Dokumen</th>
                <th>Tanggal</th>
                <th>Sumber</th>
                <th>No. Referensi</th>
                <th>Barang</th>
                <th>Keterangan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((trx) => (
                <tr key={trx.id}>
                  <td>
                    <span className="font-mono text-xs font-medium text-bps-blue bg-bps-blue-50 px-2 py-1 rounded">
                      {trx.no_dokumen}
                    </span>
                  </td>
                  <td className="text-sm text-dark-500">{formatDateShort(trx.tanggal)}</td>
                  <td>
                    <span className={cn(
                      'badge',
                      trx.sumber === 'Pembelian' && 'bg-bps-blue-50 text-bps-blue-700',
                      trx.sumber === 'Transfer Masuk' && 'bg-bps-green-50 text-bps-green-700',
                    )}>
                      {trx.sumber}
                    </span>
                  </td>
                  <td>
                    <div>
                      <p className="text-xs text-dark-400 font-medium">
                        {trx.sumber === 'Pembelian' ? 'No. Nota' : 'No. BAST'}
                      </p>
                      <p className="text-sm font-semibold text-dark-800">{trx.no_referensi || '-'}</p>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      {trx.items.map((item, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="font-medium text-dark-700">{item.barang?.nama_barang}</span>
                          <span className="text-dark-400 ml-1">
                            ({item.jumlah} {item.barang?.satuan?.nama_satuan})
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="text-xs text-dark-500 max-w-[150px] truncate">{trx.keterangan || '-'}</td>
                  <td>
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setShowPrintPreview(trx)}
                        className="p-1.5 rounded-lg text-dark-400 hover:text-dark-700 hover:bg-dark-100 transition-colors"
                        title="Cetak Berita Acara Penerimaan"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(trx)}
                        className="p-1.5 rounded-lg text-dark-400 hover:text-bps-blue hover:bg-bps-blue-50 transition-colors"
                        title="Edit Transaksi"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(trx)}
                        className="p-1.5 rounded-lg text-dark-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <ArrowDownToLine className="w-12 h-12 text-dark-200 mx-auto mb-3" />
                    <p className="text-dark-700 font-semibold text-sm">Belum Ada Transaksi Barang Masuk</p>
                    <p className="text-dark-400 text-xs mt-1 max-w-md mx-auto leading-relaxed">
                      Data transaksi telah di-reset bersih. Silakan klik tombol <strong>&quot;Tambah Transaksi&quot;</strong> di atas untuk mencoba mencatat penerimaan barang masuk ke gudang.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-center justify-between p-5 border-b border-dark-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-bps-green-50 flex items-center justify-center">
                  <ArrowDownToLine className="w-5 h-5 text-bps-green" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-dark-800">
                    {editItem ? 'Edit Transaksi Masuk' : 'Tambah Transaksi Masuk'}
                  </h2>
                  <p className="text-xs text-dark-400">Penerimaan barang fisik ke gudang persediaan BPS</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-dark-400 hover:bg-dark-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label text-xs font-semibold text-dark-700">Sumber Barang <span className="text-red-500">*</span></label>
                    <select
                      className="input text-xs"
                      value={formSumber}
                      onChange={(e) => handleSumberChange(e.target.value as SumberBarangMasuk)}
                      required
                    >
                      <option value="Pembelian">Pembelian (Pengadaan Kantor)</option>
                      <option value="Transfer Masuk">Transfer Masuk dari BPS Provinsi</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label text-xs font-semibold text-dark-700">Tanggal Penerimaan <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      className="input text-xs"
                      value={formTanggal}
                      onChange={(e) => setFormTanggal(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label text-xs font-semibold text-dark-700">
                    {formSumber === 'Pembelian' ? 'Nomor Nota Pembelian' : 'Nomor BAST (Berita Acara Serah Terima)'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="input text-xs font-mono font-medium"
                    placeholder={formSumber === 'Pembelian' ? 'Contoh: NOTA/2026/001' : 'Contoh: BAST/BPS-SUMSEL/128/VIII/2026'}
                    value={formNoReferensi}
                    onChange={(e) => setFormNoReferensi(e.target.value)}
                    required
                  />
                  <p className="text-[10px] text-dark-400 mt-1">
                    {formSumber === 'Pembelian' ? 'Nomor nota faktur pembelian barang' : 'Nomor BAST dari BPS Provinsi Sumatera Selatan'}
                  </p>
                </div>

                {/* DAFTAR BARANG MASUK MULTI-ITEM */}
                <div className="space-y-3 pt-2 border-t border-dark-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-dark-800">Daftar Item Barang Masuk</h4>
                      <p className="text-[11px] text-dark-400">Dapat mencatat lebih dari satu barang dalam satu nomor surat/dokumen</p>
                    </div>
                    <button
                      type="button"
                      onClick={addFormItem}
                      className="inline-flex items-center gap-1 text-xs font-bold text-bps-blue hover:text-bps-blue-700 bg-bps-blue-50 hover:bg-bps-blue-100 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Barang</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {formItems.map((item, idx) => (
                      <div key={idx} className="p-3 bg-dark-50 rounded-xl border border-dark-100 space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-dark-700">Barang #{idx + 1}</span>
                          {formItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFormItem(idx)}
                              className="text-red-500 hover:text-red-700 text-xs inline-flex items-center gap-1"
                            >
                              <Trash className="w-3 h-3" />
                              <span>Hapus</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="input-label text-[11px] font-semibold text-dark-600 mb-0">Pilih Barang</label>
                          <button
                            type="button"
                            onClick={() => {
                              setQuickAddIdx(idx);
                              setQuickNamaBarang('');
                              setShowQuickAddBarang(true);
                            }}
                            className="text-[11px] font-bold text-bps-blue hover:text-bps-blue-700 underline inline-flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>+ Tambah Barang Baru</span>
                          </button>
                        </div>
                        <select
                          className="input text-xs"
                          value={item.id_barang}
                          onChange={(e) => updateFormItem(idx, 'id_barang', Number(e.target.value))}
                          required
                        >
                          {barangList.map(b => (
                            <option key={b.id} value={b.id}>
                              {b.nama_barang} (Stok: {b.stok} {b.satuan?.nama_satuan || 'Buah'})
                            </option>
                          ))}
                        </select>

                        <div>
                          <label className="input-label text-[11px] font-semibold text-dark-600">
                            Jumlah Masuk ({barangList.find(b => b.id === Number(item.id_barang))?.satuan?.nama_satuan || 'Buah'}) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="1"
                            className="input text-xs font-bold w-full"
                            value={item.jumlah}
                            onChange={(e) => updateFormItem(idx, 'jumlah', Number(e.target.value))}
                            required
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            className="input text-xs"
                            placeholder="Keterangan item (opsional)"
                            value={item.keterangan}
                            onChange={(e) => updateFormItem(idx, 'keterangan', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="input-label text-xs font-semibold text-dark-700">Catatan Dokumen / Keperluan</label>
                  <textarea
                    className="input min-h-[60px] resize-none text-xs"
                    placeholder="Contoh: Pengadaan ATK Triwulan dari Toko Mitra..."
                    value={formKeterangan}
                    onChange={(e) => setFormKeterangan(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-5 border-t border-dark-100 bg-dark-50 rounded-b-2xl">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary text-xs">
                  Batal
                </button>
                <button type="submit" className="btn-success text-xs inline-flex items-center gap-1.5">
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>{editItem ? 'Simpan Perubahan' : 'Catat Barang Masuk'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Transaksi */}
      {deleteCandidate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-slide-in-up p-5 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-dark-800">Hapus Transaksi Masuk?</h3>
              <p className="text-xs text-dark-500 mt-1">
                Apakah Anda yakin ingin menghapus dokumen transaksi{' '}
                <strong className="text-dark-800">"{deleteCandidate.no_dokumen}"</strong>?
              </p>
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg mt-2">
                Stok master barang akan otomatis dikurangi kembali sesuai jumlah yang pernah dicatat.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="btn-secondary text-xs flex-1"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all flex-1 shadow-sm active:scale-95"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Print Preview Modal — per No Surat (Master-Detail) */}
      {showPrintPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-dark-100 no-print gap-3 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-base font-bold text-dark-800">Preview Cetak — Bukti Penerimaan Barang</h2>
                <p className="text-xs text-dark-400">Dokumen Penerimaan Barang Masuk (Per Nomor Surat)</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-dark-50 border border-dark-200 rounded-lg px-2 py-1 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-dark-400" />
                  <span className="text-dark-500 font-medium">Tgl Cetak:</span>
                  <input
                    type="date"
                    value={tglCetakDokumen}
                    onChange={(e) => setTglCetakDokumen(e.target.value)}
                    className="bg-transparent font-semibold text-dark-800 focus:outline-none cursor-pointer"
                  />
                </div>
                <button onClick={handlePrint} className="btn-primary text-xs py-2 px-3">
                  <Printer className="w-4 h-4" />
                  Cetak Dokumen
                </button>
                <button onClick={() => setShowPrintPreview(null)} className="btn-secondary text-xs py-2 px-3">
                  Tutup
                </button>
              </div>
            </div>

            {/* Injeksi Style Cetak: Kunci A4 PORTRAIT untuk Bukti Penerimaan Barang */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                @page {
                  size: A4 portrait !important;
                  margin: 6mm 8mm 6mm 8mm !important;
                }
                #print-area {
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                  padding: 0 !important;
                  width: 100% !important;
                }
              }
            `}} />

            <div className="p-8 print:p-0 text-black bg-white" id="print-area">
              {/* KOP SURAT RESMI BPS */}
              <KopSurat />

              <h4 className="text-center font-bold text-black mb-5 print:mb-4 text-base print:text-lg uppercase tracking-wider underline underline-offset-4">
                BUKTI PENERIMAAN BARANG
              </h4>

              <div className="grid grid-cols-2 gap-y-2 text-xs print:text-[11pt] mb-6 print:mb-4 text-black">
                <div className="flex gap-2">
                  <span className="text-gray-700 w-32 print:w-36">No. Dokumen</span>
                  <span className="font-semibold">: {showPrintPreview.no_dokumen}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-700 w-32 print:w-36">Tanggal Surat</span>
                  <span className="font-semibold">: {formatDate(showPrintPreview.tanggal)}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-700 w-32 print:w-36">Sumber Barang</span>
                  <span className="font-semibold">: {showPrintPreview.sumber === 'Pembelian' ? 'Pembelian (Pengadaan Kantor)' : 'Transfer Masuk dari BPS Provinsi'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-700 w-32 print:w-36">
                    {showPrintPreview.sumber === 'Pembelian' ? 'No. Nota' : 'No. BAST'}
                  </span>
                  <span className="font-semibold">: {showPrintPreview.no_referensi || '-'}</span>
                </div>
              </div>

              {/* Tabel barang — semua item dalam satu dokumen nomor surat */}
              <table className="w-full border-collapse border border-black text-xs print:text-[11pt] mb-6 print:mb-4">
                <thead>
                  <tr className="bg-gray-100 text-black font-bold">
                    <th className="border border-black px-2 py-2 print:py-2.5 text-center w-10">No</th>
                    <th className="border border-black px-3 py-2 print:py-2.5 text-left">Nama Barang</th>
                    <th className="border border-black px-3 py-2 print:py-2.5 text-center w-28 print:w-32">Satuan</th>
                    <th className="border border-black px-3 py-2 print:py-2.5 text-center w-24 print:w-28">Jumlah</th>
                    <th className="border border-black px-3 py-2 print:py-2.5 text-left">Keterangan</th>
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
                      <td className="border border-black px-2 py-2.5 print:py-3 text-center">{idx + 1}</td>
                      <td className="border border-black px-3 py-2.5 print:py-3 font-medium">{item.barang?.nama_barang}</td>
                      <td className="border border-black px-3 py-2.5 print:py-3 text-center">{item.barang?.satuan?.nama_satuan || 'Buah'}</td>
                      <td className="border border-black px-3 py-2.5 print:py-3 text-center font-normal">{item.jumlah}</td>
                      <td className="border border-black px-3 py-2.5 print:py-3">{item.keterangan || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {showPrintPreview.keterangan && (
                <p className="text-xs print:text-[10.5pt] text-gray-700 mb-6 print:mb-4 italic">Catatan: {showPrintPreview.keterangan}</p>
              )}

              {/* Tanda tangan format resmi BPS */}
              <div className="w-full flex items-start justify-between mt-10 print:mt-6 text-xs print:text-[11pt] text-black avoid-break">
                <div className="w-72 text-center flex flex-col items-center">
                  <p className="font-semibold text-black">Yang Menyerahkan,</p>
                  <p className="font-medium text-black">
                    {showPrintPreview.sumber === 'Pembelian' ? 'Rekanan / Vendor' : 'BPS Provinsi Sumatera Selatan'}
                  </p>
                  <div className="h-16 print:h-14" />
                  <p className="text-center">
                    <span className="font-bold text-black border-b border-black pb-0.5 inline-block">
                      (&nbsp;................................&nbsp;)
                    </span>
                  </p>
                </div>
                <div className="w-72 text-center flex flex-col items-center">
                  <p className="text-black font-medium">{formatTanggalTandaTangan(tglCetakDokumen)}</p>
                  <p className="font-semibold text-black">Petugas Pengelola Persediaan</p>
                  <div className="h-16 print:h-14" />
                  <p className="text-center">
                    <span className="font-bold text-black border-b border-black pb-0.5 inline-block">
                      Guspita Karleni, S.Si
                    </span>
                  </p>
                  <p className="text-[11px] print:text-[10.5pt] text-black mt-1 font-medium text-center">NIP. 19970806 202521 2039</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Cepat Barang Baru untuk Kegiatan */}
      {showQuickAddBarang && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in-up overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-dark-100 bg-bps-blue-50/50">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-bps-blue" />
                <div>
                  <h3 className="text-sm font-bold text-dark-800">Tambah Barang Baru ke Master</h3>
                  <p className="text-[11px] text-dark-400">Barang otomatis terdaftar dengan stok awal 0</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickAddBarang(false)}
                className="p-1 rounded-lg text-dark-400 hover:bg-dark-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickBarang} className="p-4 space-y-3">
              <div>
                <label className="input-label text-xs font-semibold text-dark-700">
                  Nama Barang <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={quickNamaBarang}
                  onChange={(e) => setQuickNamaBarang(e.target.value)}
                  className="input text-xs"
                  placeholder="Contoh: Kertas HVS F4 70gsm, Spidol Snowman..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="input-label text-xs font-semibold text-dark-700">Satuan Ukuran</label>
                  <select
                    value={quickSatuan}
                    onChange={(e) => setQuickSatuan(e.target.value)}
                    className="input text-xs"
                  >
                    <option value="Buah">Buah</option>
                    <option value="Rim">Rim</option>
                    <option value="Kotak">Kotak</option>
                    <option value="Pak">Pak</option>
                    <option value="Dus">Dus</option>
                    <option value="Lusin">Lusin</option>
                    <option value="Unit">Unit</option>
                    <option value="Lembar">Lembar</option>
                    <option value="Roll">Roll</option>
                    <option value="Botol">Botol</option>
                    <option value="Batang">Batang</option>
                    <option value="Pcs">Pcs</option>
                  </select>
                </div>
                <div>
                  <label className="input-label text-xs font-semibold text-dark-700">Kategori</label>
                  <select
                    value={quickKategori}
                    onChange={(e) => setQuickKategori(e.target.value)}
                    className="input text-xs"
                  >
                    <option value="Alat Tulis Kantor">Alat Tulis Kantor</option>
                    <option value="Peralatan Komputer">Peralatan Komputer</option>
                    <option value="Perlengkapan Cetakan">Perlengkapan Cetakan</option>
                    <option value="Alat Kebersihan">Alat Kebersihan</option>
                    <option value="Perlengkapan Rumah Tangga">Perlengkapan Rumah Tangga</option>
                    <option value="Peralatan Elektronik">Peralatan Elektronik</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800">
                💡 Barang ini langsung ditambahkan ke master persediaan dengan stok 0, lalu otomatis terpilih di formulir transaksi masuk Anda.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-dark-100">
                <button
                  type="button"
                  onClick={() => setShowQuickAddBarang(false)}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simpan &amp; Pilih</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
