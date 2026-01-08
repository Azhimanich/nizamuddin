<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PsbFaq;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PSBFaqController extends Controller
{
    public function getFaqs(Request $request): JsonResponse
    {
        try {
            $locale = $request->get('locale', 'id');
            $category = $request->get('category');
            
            $query = PsbFaq::query();
            
            // Filter by locale
            $query->byLocale($locale);
            
            // Filter by category if provided
            if ($category) {
                $query->byCategory($category);
            }
            
            // Only get active FAQs and order them
            $faqs = $query->active()->ordered()->get();
            
            // Group by category if categories exist
            if ($faqs->isNotEmpty() && $faqs->first()->category) {
                $groupedFaqs = $faqs->groupBy('category');
                
                return response()->json([
                    'success' => true,
                    'data' => [
                        'categories' => $groupedFaqs->keys()->toArray(),
                        'faqs' => $groupedFaqs->toArray()
                    ]
                ]);
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'faqs' => $faqs->toArray()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch FAQs: ' . $e->getMessage()
            ], 500);
        }
    }
}
