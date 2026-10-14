import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('transaksi_masuk')
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

    const payload = {
      no_dokumen: body.no_dokumen,
      id_barang: body.id_barang || (body.items && body.items[0]?.id_barang) || 1,
      jumlah: body.jumlah || (body.items && body.items.reduce((s: number, i: any) => s + (i.jumlah || 0), 0)) || 1,
      tanggal: body.tanggal || new Date().toISOString().split('T')[0],
      sumber: body.sumber || 'Pembelian',
      no_surat_jalan: body.no_referensi || body.no_surat_jalan || body.no_dokumen,
      harga_satuan: null,
      keterangan: typeof body.keterangan === 'string' && body.keterangan.startsWith('{')
        ? body.keterangan
        : JSON.stringify({
            note: body.keterangan || '',
            sumber: body.sumber || 'Pembelian',
            no_referensi: body.no_referensi || '',
            items: body.items || [],
          }),
    };

    const { data, error } = await supabase
      .from('transaksi_masuk')
      .insert(payload)
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

    const supabase = getServiceSupabase();
    let query = supabase.from('transaksi_masuk').delete();

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
