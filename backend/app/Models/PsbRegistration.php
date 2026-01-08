<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PsbRegistration extends Model
{
    protected $fillable = [
        'nik',
        'nama_lengkap',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'alamat_lengkap',
        'nomor_telepon',
        'email',
        'status',
        'catatan',
        // Additional fields from form
        'nama_orang_tua',
        'telepon_orang_tua',
        'email_orang_tua',
        'tingkat_pendidikan',
        'sekolah_asal',
        'tahun_lulus',
        'kemampuan_quran',
        'kebutuhan_khusus',
        'motivasi'
    ];
    
    protected $casts = [
        'tanggal_lahir' => 'date',
        'tahun_lulus' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
    
    protected $attributes = [
        'status' => 'pending'
    ];
}
