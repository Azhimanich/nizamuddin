<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrganizationStructure extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'position',
        'level',
        'order',
        'parent_id',
        'photo',
        'bio_id',
        'bio_en',
        'bio_ar',
        'email',
        'phone',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'level' => 'integer',
        'order' => 'integer',
    ];

    // Relationship: parent
    public function parent()
    {
        return $this->belongsTo(OrganizationStructure::class, 'parent_id');
    }

    // Relationship: children
    public function children()
    {
        return $this->hasMany(OrganizationStructure::class, 'parent_id')->orderBy('order');
    }
}
