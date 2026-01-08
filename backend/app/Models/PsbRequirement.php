<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PsbRequirement extends Model
{
    protected $fillable = [
        'category',
        'item',
        'locale',
        'order',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer'
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByLocale($query, $locale = 'id')
    {
        return $query->where('locale', $locale);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('id');
    }
}
