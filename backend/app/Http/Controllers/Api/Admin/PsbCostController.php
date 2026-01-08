<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PsbCost;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PsbCostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $locale = $request->get('locale', 'id');
            
            $costs = PsbCost::byLocale($locale)
                ->active()
                ->ordered()
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $costs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch costs: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'item_name' => 'required|string|max:255',
                'amount' => 'required|string|max:255',
                'note' => 'nullable|string|max:500',
                'locale' => 'required|in:id,en',
                'order' => 'integer|min:0',
                'is_active' => 'boolean'
            ]);

            $cost = PsbCost::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Cost created successfully',
                'data' => $cost
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create cost: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $cost = PsbCost::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $cost
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cost not found'
            ], 404);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $cost = PsbCost::findOrFail($id);
            
            $validated = $request->validate([
                'item_name' => 'sometimes|required|string|max:255',
                'amount' => 'sometimes|required|string|max:255',
                'note' => 'nullable|string|max:500',
                'locale' => 'sometimes|required|in:id,en',
                'order' => 'sometimes|integer|min:0',
                'is_active' => 'sometimes|boolean'
            ]);

            $cost->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Cost updated successfully',
                'data' => $cost
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update cost: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $cost = PsbCost::findOrFail($id);
            $cost->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cost deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete cost: ' . $e->getMessage()
            ], 500);
        }
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'costs' => 'required|array',
                'costs.*.id' => 'required|exists:psb_costs,id',
                'costs.*.order' => 'required|integer|min:0'
            ]);

            foreach ($validated['costs'] as $cost) {
                PsbCost::where('id', $cost['id'])
                    ->update(['order' => $cost['order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Costs reordered successfully'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reorder costs: ' . $e->getMessage()
            ], 500);
        }
    }
}
