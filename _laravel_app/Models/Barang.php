<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_barang';
    protected $table = 'barang';
    protected $fillable = ['nama_barang', 'kode_barang', 'kategori', 'stok', 'foto'];

}

