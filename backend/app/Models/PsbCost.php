<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PsbCost extends Model
{
    protected $fillable = [
        'item_name',
        'amount',
        'note',
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

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('id');
    }
}
