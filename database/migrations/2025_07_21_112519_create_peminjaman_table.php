<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('peminjaman', function (Blueprint $table) {
            $table->id();

            // Relasi ke tabel barang
            $table->unsignedBigInteger('id_barang');
            $table->foreign('id_barang')->references('id_barang')->on('barang')->onDelete('cascade');

            // Jumlah barang dipinjam
            $table->unsignedInteger('jumlah')->default(1);

            // Informasi peminjam
            $table->string('nama_peminjam');
            $table->string('kontak_peminjam');
            $table->string('divisi')->nullable(); // <- Tambahan kolom divisi
            $table->string('foto_peminjam')->nullable();

            // Tanggal-tanggal penting
            $table->date('tanggal_pinjam');
            $table->date('tanggal_kembali'); // tanggal yang direncanakan
            $table->date('tanggal_dikembalikan')->nullable(); // tanggal aktual pengembalian

            // Status peminjaman
            $table->enum('status', ['dipinjam', 'selesai'])->default('dipinjam');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('peminjaman');
    }
};
