<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PsbFaq;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class PsbFaqController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $locale = $request->get('locale', 'id');
            $category = $request->get('category');
            
            $query = PsbFaq::query();
            
            if ($locale) {
                $query->byLocale($locale);
            }
            
            if ($category) {
                $query->byCategory($category);
            }
            
            $faqs = $query->ordered()->get();
            
            return response()->json([
                'success' => true,
                'data' => $faqs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch FAQs: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'question' => 'required|string|max:255',
                'answer' => 'required|string',
                'locale' => 'required|string|in:id,en',
                'category' => 'nullable|string|max:100',
                'order' => 'nullable|integer|min:0',
                'is_active' => 'nullable|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $faq = PsbFaq::create([
                'question' => $request->question,
                'answer' => $request->answer,
                'locale' => $request->locale,
                'category' => $request->category,
                'order' => $request->order ?? 0,
                'is_active' => $request->is_active ?? true
            ]);

            return response()->json([
                'success' => true,
                'message' => 'FAQ created successfully',
                'data' => $faq
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create FAQ: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $faq = PsbFaq::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $faq
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'FAQ not found'
            ], 404);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $faq = PsbFaq::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'question' => 'required|string|max:255',
                'answer' => 'required|string',
                'locale' => 'required|string|in:id,en',
                'category' => 'nullable|string|max:100',
                'order' => 'nullable|integer|min:0',
                'is_active' => 'nullable|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $faq->update([
                'question' => $request->question,
                'answer' => $request->answer,
                'locale' => $request->locale,
                'category' => $request->category,
                'order' => $request->order ?? $faq->order,
                'is_active' => $request->is_active ?? $faq->is_active
            ]);

            return response()->json([
                'success' => true,
                'message' => 'FAQ updated successfully',
                'data' => $faq
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update FAQ: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $faq = PsbFaq::findOrFail($id);
            $faq->delete();

            return response()->json([
                'success' => true,
                'message' => 'FAQ deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete FAQ: ' . $e->getMessage()
            ], 500);
        }
    }

    public function bulkUpdateOrder(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'faqs' => 'required|array',
                'faqs.*.id' => 'required|exists:psb_faqs,id',
                'faqs.*.order' => 'required|integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            foreach ($request->faqs as $faqData) {
                PsbFaq::where('id', $faqData['id'])
                    ->update(['order' => $faqData['order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'FAQ order updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update FAQ order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'ids' => 'required|array',
                'ids.*' => 'required|exists:psb_faqs,id',
                'is_active' => 'required|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            PsbFaq::whereIn('id', $request->ids)
                ->update(['is_active' => $request->is_active]);

            return response()->json([
                'success' => true,
                'message' => 'FAQ status updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update FAQ status: ' . $e->getMessage()
            ], 500);
        }
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'ids' => 'required|array',
                'ids.*' => 'required|exists:psb_faqs,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            PsbFaq::whereIn('id', $request->ids)->delete();

            return response()->json([
                'success' => true,
                'message' => 'FAQs deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete FAQs: ' . $e->getMessage()
            ], 500);
        }
    }
}
