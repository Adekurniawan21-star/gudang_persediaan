import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('transaksi_keluar')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = getServiceSupabase();

    // Map payload into columns existing in Supabase table
    const payload = {
      no_dokumen: body.no_dokumen,
      id_barang: body.id_barang || (body.items && body.items[0]?.id_barang) || 1,
      jumlah: body.jumlah || (body.items && body.items.reduce((s: number, i: any) => s + (i.jumlah || 0), 0)) || 1,
      tanggal: body.tanggal || new Date().toISOString().split('T')[0],
      tujuan: body.nama_tim || body.tujuan || 'Kantor BPS',
      pemohon: body.penanggung_jawab || body.pemohon || 'Pegawai',
      keterangan: typeof body.keterangan === 'string' && body.keterangan.startsWith('{')
        ? body.keterangan
        : JSON.stringify({
            note: body.keterangan || '',
            jenis_pengeluaran: body.jenis_pengeluaran || 'habis_pakai',
            tim_pemohon: body.tim_pemohon || 'tim-sosial',
            nama_tim: body.nama_tim || 'Tim Sosial',
            penanggung_jawab: body.penanggung_jawab || 'Pegawai',
            nip_pj: body.nip_pj || '-',
            items: body.items || [],
          }),
    };

    const { data, error } = await supabase
      .from('transaksi_keluar')
      .upsert(payload, { onConflict: 'no_dokumen' })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const no_dokumen = searchParams.get('no_dokumen');
    const id = searchParams.get('id');
    const clear_all = searchParams.get('clear_all');

    const supabase = getServiceSupabase();

    if (clear_all === 'true') {
      const { error } = await supabase.from('transaksi_keluar').delete().neq('id', 0);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: 'Semua transaksi keluar berhasil dikosongkan' });
    }

    let query = supabase.from('transaksi_keluar').delete();

    if (no_dokumen) {
      query = query.eq('no_dokumen', no_dokumen);
    } else if (id) {
      query = query.eq('id', Number(id));
    } else {
      return NextResponse.json({ error: 'Parameter no_dokumen atau id dibutuhkan' }, { status: 400 });
    }

    const { error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
