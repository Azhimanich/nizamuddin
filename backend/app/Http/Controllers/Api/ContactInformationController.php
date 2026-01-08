<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactInformation;
use Illuminate\Http\Request;

class ContactInformationController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'id');
        $field = 'value_' . $locale;

        $contactInfo = ContactInformation::where('is_active', true)
            ->orderBy('order')
            ->orderBy('type')
            ->get()
            ->map(function ($item) use ($field) {
                return [
                    'type' => $item->type,
                    'value' => $item->$field ?? $item->value_id ?? '',
                ];
            });

        return response()->json($contactInfo);
    }
}

