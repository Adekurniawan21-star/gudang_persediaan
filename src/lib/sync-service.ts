import type { TransaksiKeluar, TransaksiMasuk, Barang } from '@/types';

export const KATEGORI_LOOKUP: Record<number, string> = {
  1: 'Alat Tulis Kantor',
  2: 'Peralatan Komputer',
  3: 'Perlengkapan Rumah Tangga',
  4: 'Alat Kebersihan',
  5: 'Perlengkapan Cetakan',
  6: 'Peralatan Elektronik',
};

export const SATUAN_LOOKUP: Record<number, string> = {
  1: 'Buah',
  2: 'Rim',
  3: 'Lusin',
  4: 'Pak',
  5: 'Dus',
  6: 'Set',
  7: 'Unit',
  8: 'Lembar',
  9: 'Roll',
  10: 'Botol',
  11: 'Kotak',
  12: 'Batang',
};

export const LOKASI_LOOKUP: Record<number, string> = {
  1: 'Gudang Utama',
  2: 'Gudang ATK',
  3: 'Rak Server',
  4: 'Ruang Arsip',
};

// ==========================================================
// 1. DATA BARANG SYNC
// ==========================================================

export function parseRemoteBarang(rows: any[]): Barang[] {
  return rows.map((r) => ({
    id: r.id,
    kode_barang: r.kode_barang,
    nama_barang: r.nama_barang,
    id_kategori: r.id_kategori || 1,
    id_satuan: r.id_satuan || 1,
    id_lokasi: r.id_lokasi || 1,
    stok: typeof r.stok === 'number' ? r.stok : 0,
    stok_minimum: typeof r.stok_minimum === 'number' ? r.stok_minimum : 5,
    foto_url: r.foto_url || null,
    deskripsi: r.deskripsi || null,
    created_at: r.created_at || new Date().toISOString(),
    updated_at: r.updated_at || new Date().toISOString(),
    kategori: {
      id: r.id_kategori || 1,
      nama_kategori: KATEGORI_LOOKUP[r.id_kategori] || 'Alat Tulis Kantor',
      deskripsi: null,
      created_at: '',
    },
    satuan: {
      id: r.id_satuan || 1,
      nama_satuan: SATUAN_LOOKUP[r.id_satuan] || 'Buah',
      created_at: '',
    },
    lokasi: {
      id: r.id_lokasi || 1,
      nama_lokasi: LOKASI_LOOKUP[r.id_lokasi] || 'Gudang ATK',
      deskripsi: null,
      created_at: '',
    },
  }));
}

export async function fetchAndSyncBarang(): Promise<Barang[] | null> {
  try {
    const res = await fetch('/api/barang', { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    if (Array.isArray(json.data)) {
      const parsed = parseRemoteBarang(json.data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sipersedia_barang_list', JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (e) {
    console.warn('[Sync] Gagal menarik data remote barang:', e);
  }
  return null;
}

export async function pushBarang(b: Barang): Promise<boolean> {
  try {
    const res = await fetch('/api/barang', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(b),
    });
    return res.ok;
  } catch (e) {
    console.warn('[Sync] Gagal menyimpan barang ke database cloud:', e);
    return false;
  }
}

export async function updateBarangStockRemote(id: number, newStock: number): Promise<boolean> {
  try {
    const res = await fetch('/api/barang', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, stok: newStock }),
    });
    return res.ok;
  } catch (e) {
    console.warn('[Sync] Gagal mengupdate stok barang di cloud:', e);
    return false;
  }
}

export async function deleteBarangRemote(id: number): Promise<boolean> {
  try {
    const res = await fetch(`/api/barang?id=${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function clearAllBarangRemote(): Promise<boolean> {
  try {
    const res = await fetch('/api/barang?clear_all=true', {
      method: 'DELETE',
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

// ==========================================================
// 2. TRANSAKSI KELUAR (PERMINTAAN BARANG) SYNC
// ==========================================================

export function parseRemoteTransaksiKeluar(rows: any[], barangList: Barang[]): TransaksiKeluar[] {
  return rows.map((r) => {
    let meta: any = {};
    if (r.keterangan && typeof r.keterangan === 'string' && r.keterangan.startsWith('{')) {
      try {
        meta = JSON.parse(r.keterangan);
      } catch (e) {}
    }

    const b = barangList.find((b) => b.id === r.id_barang);
    const items = meta.items && meta.items.length > 0
      ? meta.items.map((it: any) => ({
          ...it,
          barang: barangList.find((b) => b.id === it.id_barang) || b,
        }))
      : [
          {
            id_barang: r.id_barang,
            jumlah: r.jumlah,
            keterangan: meta.note || r.keterangan || '',
            jenis_pengeluaran: meta.jenis_pengeluaran || 'habis_pakai',
            barang: b,
          },
        ];

    return {
      id: r.id,
      no_dokumen: r.no_dokumen,
      tanggal: r.tanggal,
      tim_pemohon: meta.tim_pemohon || 'tim-sosial',
      nama_tim: meta.nama_tim || r.tujuan || 'Kantor BPS',
      penanggung_jawab: meta.penanggung_jawab || r.pemohon || 'Pegawai',
      nip_pj: meta.nip_pj || '-',
      jenis_pengeluaran: meta.jenis_pengeluaran || 'habis_pakai',
      items,
      keterangan: meta.note || (meta.items ? '' : r.keterangan) || null,
      created_by: r.created_by || 'usr-remote',
      created_at: r.created_at || new Date().toISOString(),
    };
  });
}

export async function fetchAndSyncTransaksiKeluar(barangList: Barang[]): Promise<TransaksiKeluar[] | null> {
  try {
    const res = await fetch('/api/transaksi-keluar', { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    if (Array.isArray(json.data)) {
      const parsed = parseRemoteTransaksiKeluar(json.data, barangList);
      const localStr = typeof window !== 'undefined' ? localStorage.getItem('sipersedia_transaksi_keluar') : null;
      const localList: TransaksiKeluar[] = localStr ? JSON.parse(localStr) : [];

      // Merge: dahulukan data remote dari cloud
      const mergedMap = new Map<string, TransaksiKeluar>();
      localList.forEach((t) => mergedMap.set(t.no_dokumen, t));
      parsed.forEach((t) => mergedMap.set(t.no_dokumen, t));

      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
      );

      if (typeof window !== 'undefined') {
        localStorage.setItem('sipersedia_transaksi_keluar', JSON.stringify(merged));
      }
      return merged;
    }
  } catch (e) {
    console.warn('[Sync] Gagal menarik data remote transaksi keluar:', e);
  }
  return null;
}

export async function pushTransaksiKeluar(trx: TransaksiKeluar): Promise<boolean> {
  try {
    const res = await fetch('/api/transaksi-keluar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trx),
    });
    return res.ok;
  } catch (e) {
    console.warn('[Sync] Gagal menyimpan transaksi keluar ke database cloud:', e);
    return false;
  }
}

export async function deleteTransaksiKeluarRemote(no_dokumen: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/transaksi-keluar?no_dokumen=${encodeURIComponent(no_dokumen)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function clearAllTransaksiKeluarRemote(): Promise<boolean> {
  try {
    const res = await fetch('/api/transaksi-keluar?clear_all=true', {
      method: 'DELETE',
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

// ==========================================================
// 3. TRANSAKSI MASUK (PENERIMAAN BARANG) SYNC
// ==========================================================

export function parseRemoteTransaksiMasuk(rows: any[], barangList: Barang[]): TransaksiMasuk[] {
  return rows.map((r) => {
    let meta: any = {};
    if (r.keterangan && typeof r.keterangan === 'string' && r.keterangan.startsWith('{')) {
      try {
        meta = JSON.parse(r.keterangan);
      } catch (e) {}
    }

    const b = barangList.find((b) => b.id === r.id_barang);
    const items = meta.items && meta.items.length > 0
      ? meta.items.map((it: any) => ({
          ...it,
          barang: barangList.find((b) => b.id === it.id_barang) || b,
        }))
      : [
          {
            id_barang: r.id_barang,
            jumlah: r.jumlah,
            harga_satuan: r.harga_satuan || null,
            keterangan: meta.note || r.keterangan || '',
            barang: b,
          },
        ];

    return {
      id: r.id,
      no_dokumen: r.no_dokumen,
      tanggal: r.tanggal,
      sumber: meta.sumber || r.sumber || 'Pembelian',
      no_referensi: meta.no_referensi || r.no_surat_jalan || null,
      items,
      keterangan: meta.note || (meta.items ? '' : r.keterangan) || null,
      created_by: r.created_by || 'admin-001',
      created_at: r.created_at || new Date().toISOString(),
    };
  });
}

export async function fetchAndSyncTransaksiMasuk(barangList: Barang[]): Promise<TransaksiMasuk[] | null> {
  try {
    const res = await fetch('/api/transaksi-masuk', { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    if (Array.isArray(json.data)) {
      const parsed = parseRemoteTransaksiMasuk(json.data, barangList);
      const localStr = typeof window !== 'undefined' ? localStorage.getItem('sipersedia_transaksi_masuk') : null;
      const localList: TransaksiMasuk[] = localStr ? JSON.parse(localStr) : [];

      const mergedMap = new Map<string, TransaksiMasuk>();
      localList.forEach((t) => mergedMap.set(t.no_dokumen, t));
      parsed.forEach((t) => mergedMap.set(t.no_dokumen, t));

      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
      );

      if (typeof window !== 'undefined') {
        localStorage.setItem('sipersedia_transaksi_masuk', JSON.stringify(merged));
      }
      return merged;
    }
  } catch (e) {
    console.warn('[Sync] Gagal menarik data remote transaksi masuk:', e);
  }
  return null;
}

export async function pushTransaksiMasuk(trx: TransaksiMasuk): Promise<boolean> {
  try {
    const res = await fetch('/api/transaksi-masuk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trx),
    });
    return res.ok;
  } catch (e) {
    console.warn('[Sync] Gagal menyimpan transaksi masuk ke database cloud:', e);
    return false;
  }
}

export async function deleteTransaksiMasukRemote(no_dokumen: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/transaksi-masuk?no_dokumen=${encodeURIComponent(no_dokumen)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function clearAllTransaksiMasukRemote(): Promise<boolean> {
  try {
    const res = await fetch('/api/transaksi-masuk?clear_all=true', {
      method: 'DELETE',
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}
