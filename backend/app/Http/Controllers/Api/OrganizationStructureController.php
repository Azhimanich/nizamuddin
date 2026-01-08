<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrganizationStructure;
use Illuminate\Http\Request;

class OrganizationStructureController extends Controller
{
    public function index()
    {
        $structures = OrganizationStructure::where('is_active', true)
            ->orderBy('level')
            ->orderBy('order')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'position' => $item->position,
                    'level' => $item->level,
                    'order' => $item->order,
                    'parent_id' => $item->parent_id,
                    'photo' => $item->photo ? (request()->getSchemeAndHttpHost() . '/storage/' . $item->photo) : null,
                    'bio_id' => $item->bio_id,
                    'bio_en' => $item->bio_en,
                    'bio_ar' => $item->bio_ar,
                    'email' => $item->email,
                    'phone' => $item->phone,
                ];
            });

        // Return flat array, let frontend build hierarchy
        return response()->json($structures->values()->all());
    }
}
