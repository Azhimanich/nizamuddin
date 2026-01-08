<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PsbRequirement;
use App\Models\PsbCost;
use App\Models\PsbAdditionalRequirement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PSBRequirementsController extends Controller
{
    public function getRequirements(Request $request): JsonResponse
    {
        try {
            $locale = $request->get('locale', 'id');
            
            // Get document requirements grouped by category
            $documentRequirements = PsbRequirement::byLocale($locale)
                ->active()
                ->ordered()
                ->get()
                ->groupBy('category');

            // Get additional requirements
            $additionalRequirements = PsbAdditionalRequirement::byLocale($locale)
                ->active()
                ->ordered()
                ->pluck('requirement')
                ->toArray();

            // Get costs
            $costs = PsbCost::byLocale($locale)
                ->active()
                ->ordered()
                ->get()
                ->map(function ($cost) {
                    return [
                        'item' => $cost->item_name,
                        'amount' => $cost->amount,
                        'note' => $cost->note
                    ];
                })
                ->toArray();

            // Format response to match frontend structure
            $data = [
                'documents' => $documentRequirements->map(function ($items, $category) {
                    return [
                        'title' => $category,
                        'items' => $items->pluck('item')->toArray()
                    ];
                })->values()->toArray(),
                'requirements' => $additionalRequirements,
                'costs' => $costs,
                'note' => $locale === 'id' 
                    ? 'Biaya dapat berubah sewaktu-waktu. Hubungi admin untuk informasi terkini.'
                    : 'Fees are subject to change. Contact admin for current information.'
            ];

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch PSB requirements: ' . $e->getMessage()
            ], 500);
        }
    }
}
