<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'native_name',
        'rtl',
        'is_active',
    ];

    protected $casts = [
        'rtl' => 'boolean',
        'is_active' => 'boolean',
    ];
}

