<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Map extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'latitude',
        'longitude',
        'embed_url',
        'api_key',
        'zoom_level',
        'map_type',
        'order',
        'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'zoom_level' => 'integer',
        'order' => 'integer',
        'is_active' => 'boolean',
    ];
}

