<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'title_id',
        'title_en',
        'title_ar',
        'content_id',
        'content_en',
        'content_ar',
        'cta_text_id',
        'cta_text_en',
        'cta_text_ar',
        'cta_link',
        'image',
        'video_url',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}

