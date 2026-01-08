<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PsbAdditionalRequirement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PsbAdditionalRequirementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $locale = $request->get('locale', 'id');
            
            $requirements = PsbAdditionalRequirement::byLocale($locale)
                ->active()
                ->ordered()
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $requirements
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch additional requirements: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'requirement' => 'required|string|max:500',
                'locale' => 'required|in:id,en',
                'order' => 'integer|min:0',
                'is_active' => 'boolean'
            ]);

            $requirement = PsbAdditionalRequirement::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Additional requirement created successfully',
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
                'message' => 'Failed to create additional requirement: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $requirement = PsbAdditionalRequirement::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $requirement
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Additional requirement not found'
            ], 404);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $requirement = PsbAdditionalRequirement::findOrFail($id);
            
            $validated = $request->validate([
                'requirement' => 'sometimes|required|string|max:500',
                'locale' => 'sometimes|required|in:id,en',
                'order' => 'sometimes|integer|min:0',
                'is_active' => 'sometimes|boolean'
            ]);

            $requirement->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Additional requirement updated successfully',
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
                'message' => 'Failed to update additional requirement: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $requirement = PsbAdditionalRequirement::findOrFail($id);
            $requirement->delete();

            return response()->json([
                'success' => true,
                'message' => 'Additional requirement deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete additional requirement: ' . $e->getMessage()
            ], 500);
        }
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'requirements' => 'required|array',
                'requirements.*.id' => 'required|exists:psb_additional_requirements,id',
                'requirements.*.order' => 'required|integer|min:0'
            ]);

            foreach ($validated['requirements'] as $req) {
                PsbAdditionalRequirement::where('id', $req['id'])
                    ->update(['order' => $req['order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Additional requirements reordered successfully'
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
                'message' => 'Failed to reorder additional requirements: ' . $e->getMessage()
            ], 500);
        }
    }
}
