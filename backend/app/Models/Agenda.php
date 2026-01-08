<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agenda extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'date',
        'time',
        'location',
        'image',
        'google_calendar_link',
        'is_active',
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime',
        'is_active' => 'boolean',
    ];
}

