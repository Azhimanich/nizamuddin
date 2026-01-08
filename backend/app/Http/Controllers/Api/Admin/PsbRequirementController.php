<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PsbRequirement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PsbRequirementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $locale = $request->get('locale', 'id');
            $category = $request->get('category');
            
            $query = PsbRequirement::query();
            
            if ($category) {
                $query->byCategory($category);
            }
            
            $requirements = $query->byLocale($locale)
                ->ordered()
                ->get()
                ->groupBy('category');
            
            return response()->json([
                'success' => true,
                'data' => $requirements
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch requirements: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'category' => 'required|string|max:255',
                'item' => 'required|string|max:500',
                'locale' => 'required|in:id,en',
                'order' => 'integer|min:0',
                'is_active' => 'boolean'
            ]);

            $requirement = PsbRequirement::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Requirement created successfully',
                'data' => $requirement
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
                'message' => 'Failed to create requirement: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $requirement = PsbRequirement::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $requirement
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Requirement not found'
            ], 404);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $requirement = PsbRequirement::findOrFail($id);
            
            $validated = $request->validate([
                'category' => 'sometimes|required|string|max:255',
                'item' => 'sometimes|required|string|max:500',
                'locale' => 'sometimes|required|in:id,en',
                'order' => 'sometimes|integer|min:0',
                'is_active' => 'sometimes|boolean'
            ]);

            $requirement->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Requirement updated successfully',
                'data' => $requirement
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
                'message' => 'Failed to update requirement: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $requirement = PsbRequirement::findOrFail($id);
            $requirement->delete();

            return response()->json([
                'success' => true,
                'message' => 'Requirement deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete requirement: ' . $e->getMessage()
            ], 500);
        }
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'requirements' => 'required|array',
                'requirements.*.id' => 'required|exists:psb_requirements,id',
                'requirements.*.order' => 'required|integer|min:0'
            ]);

            foreach ($validated['requirements'] as $req) {
                PsbRequirement::where('id', $req['id'])
                    ->update(['order' => $req['order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Requirements reordered successfully'
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
                'message' => 'Failed to reorder requirements: ' . $e->getMessage()
            ], 500);
        }
    }
}
