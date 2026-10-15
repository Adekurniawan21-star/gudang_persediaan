import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('barang')
      .select('*')
      .order('id', { ascending: true });

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

    const payload: any = {
      kode_barang: body.kode_barang,
      nama_barang: body.nama_barang,
      id_kategori: body.id_kategori || 1,
      id_satuan: body.id_satuan || 1,
      id_lokasi: body.id_lokasi || 1,
      stok: typeof body.stok === 'number' ? body.stok : 0,
      stok_minimum: typeof body.stok_minimum === 'number' ? body.stok_minimum : 5,
      foto_url: body.foto_url || null,
      deskripsi: body.deskripsi || null,
      updated_at: new Date().toISOString(),
    };

    if (body.id && typeof body.id === 'number') {
      payload.id = body.id;
    }

    const { data, error } = await supabase
      .from('barang')
      .upsert(payload, { onConflict: 'kode_barang' })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const supabase = getServiceSupabase();

    if (!body.id) {
      return NextResponse.json({ error: 'Parameter id dibutuhkan' }, { status: 400 });
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };
    if (typeof body.stok === 'number') updateData.stok = body.stok;
    if (body.nama_barang) updateData.nama_barang = body.nama_barang;
    if (body.kode_barang) updateData.kode_barang = body.kode_barang;
    if (body.id_kategori) updateData.id_kategori = body.id_kategori;
    if (body.id_satuan) updateData.id_satuan = body.id_satuan;
    if (body.id_lokasi) updateData.id_lokasi = body.id_lokasi;
    if (typeof body.stok_minimum === 'number') updateData.stok_minimum = body.stok_minimum;
    if (body.deskripsi !== undefined) updateData.deskripsi = body.deskripsi;

    const { data, error } = await supabase
      .from('barang')
      .update(updateData)
      .eq('id', body.id)
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
    const id = searchParams.get('id');
    const kode_barang = searchParams.get('kode_barang');
    const clear_all = searchParams.get('clear_all');

    const supabase = getServiceSupabase();

    if (clear_all === 'true') {
      const { error } = await supabase.from('barang').delete().neq('id', 0);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: 'Semua data barang berhasil dikosongkan' });
    }

    let query = supabase.from('barang').delete();
    if (id) {
      query = query.eq('id', Number(id));
    } else if (kode_barang) {
      query = query.eq('kode_barang', kode_barang);
    } else {
      return NextResponse.json({ error: 'Parameter id atau kode_barang dibutuhkan' }, { status: 400 });
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
