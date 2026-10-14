import type { TransaksiKeluar, TransaksiMasuk, Barang } from '@/types';

/**
 * Parser untuk mengonversi baris tabel Supabase menjadi objek TransaksiKeluar lengkap
 */
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

/**
 * Tarik data transaksi keluar dari database cloud dan sinkronkan dengan localStorage
 */
export async function fetchAndSyncTransaksiKeluar(barangList: Barang[]): Promise<TransaksiKeluar[] | null> {
  try {
    const res = await fetch('/api/transaksi-keluar', { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    if (Array.isArray(json.data) && json.data.length > 0) {
      const parsed = parseRemoteTransaksiKeluar(json.data, barangList);
      const localStr = typeof window !== 'undefined' ? localStorage.getItem('sipersedia_transaksi_keluar') : null;
      const localList: TransaksiKeluar[] = localStr ? JSON.parse(localStr) : [];

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

/**
 * Kirim transaksi keluar baru ke database cloud
 */
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

/**
 * Hapus transaksi keluar dari database cloud
 */
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

/**
 * Kirim transaksi masuk baru ke database cloud
 */
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

/**
 * Hapus transaksi masuk dari database cloud
 */
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
