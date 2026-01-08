<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('psb_registrations', function (Blueprint $table) {
            $table->string('nama_lengkap')->after('nik');
            $table->string('tempat_lahir')->after('nama_lengkap');
            $table->date('tanggal_lahir')->after('tempat_lahir');
            $table->enum('jenis_kelamin', ['L', 'P'])->after('tanggal_lahir');
            $table->text('alamat_lengkap')->after('jenis_kelamin');
            $table->string('nomor_telepon')->after('alamat_lengkap');
            $table->string('email')->nullable()->after('nomor_telepon');
            $table->enum('status', ['pending', 'diproses', 'diterima', 'ditolak'])->default('pending')->after('email');
            $table->text('catatan')->nullable()->after('status');
            $table->string('nama_orang_tua')->nullable()->after('catatan');
            $table->string('telepon_orang_tua')->nullable()->after('nama_orang_tua');
            $table->string('email_orang_tua')->nullable()->after('telepon_orang_tua');
            $table->string('tingkat_pendidikan')->nullable()->after('email_orang_tua');
            $table->string('sekolah_asal')->nullable()->after('tingkat_pendidikan');
            $table->integer('tahun_lulus')->nullable()->after('sekolah_asal');
            $table->string('kemampuan_quran')->nullable()->after('tahun_lulus');
            $table->text('kebutuhan_khusus')->nullable()->after('kemampuan_quran');
            $table->text('motivasi')->nullable()->after('kebutuhan_khusus');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('psb_registrations', function (Blueprint $table) {
            $table->dropColumn([
                'nama_lengkap',
                'tempat_lahir',
                'tanggal_lahir',
                'jenis_kelamin',
                'alamat_lengkap',
                'nomor_telepon',
                'email',
                'status',
                'catatan',
                'nama_orang_tua',
                'telepon_orang_tua',
                'email_orang_tua',
                'tingkat_pendidikan',
                'sekolah_asal',
                'tahun_lulus',
                'kemampuan_quran',
                'kebutuhan_khusus',
                'motivasi'
            ]);
        });
    }
};
