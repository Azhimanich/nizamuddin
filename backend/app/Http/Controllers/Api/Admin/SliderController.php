<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SliderController extends Controller
{
    public function index()
    {
        $sliders = Slider::orderBy('order')->get()->map(function ($item) {
            $imageUrl = null;
            if ($item->image) {
                $imageUrl = request()->getSchemeAndHttpHost() . '/storage/' . $item->image;
            }
            
            return [
                'id' => $item->id,
                'title_id' => $item->title_id,
                'title_en' => $item->title_en,
                'title_ar' => $item->title_ar,
                'subtitle_id' => $item->subtitle_id,
                'subtitle_en' => $item->subtitle_en,
                'subtitle_ar' => $item->subtitle_ar,
                'cta_text_id' => $item->cta_text_id,
                'cta_text_en' => $item->cta_text_en,
                'cta_text_ar' => $item->cta_text_ar,
                'cta_link' => $item->cta_link,
                'image' => $imageUrl,
                'order' => $item->order,
                'is_active' => $item->is_active,
            ];
        });
        return response()->json($sliders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_id' => 'required|string',
            'title_en' => 'nullable|string',
            'title_ar' => 'nullable|string',
            'subtitle_id' => 'required|string',
            'subtitle_en' => 'nullable|string',
            'subtitle_ar' => 'nullable|string',
            'cta_text_id' => 'nullable|string',
            'cta_text_en' => 'nullable|string',
            'cta_text_ar' => 'nullable|string',
            'cta_link' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'order' => 'nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('sliders', 'public');
        }

        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        $slider = Slider::create($validated);

        $imageUrl = null;
        if ($slider->image) {
            $imageUrl = request()->getSchemeAndHttpHost() . '/storage/' . $slider->image;
        }

        return response()->json([
            'id' => $slider->id,
            'title_id' => $slider->title_id,
            'title_en' => $slider->title_en,
            'title_ar' => $slider->title_ar,
            'subtitle_id' => $slider->subtitle_id,
            'subtitle_en' => $slider->subtitle_en,
            'subtitle_ar' => $slider->subtitle_ar,
            'cta_text_id' => $slider->cta_text_id,
            'cta_text_en' => $slider->cta_text_en,
            'cta_text_ar' => $slider->cta_text_ar,
            'cta_link' => $slider->cta_link,
            'image' => $imageUrl,
            'order' => $slider->order,
            'is_active' => $slider->is_active,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $slider = Slider::findOrFail($id);

        $validated = $request->validate([
            'title_id' => 'sometimes|string',
            'title_en' => 'nullable|string',
            'title_ar' => 'nullable|string',
            'subtitle_id' => 'sometimes|string',
            'subtitle_en' => 'nullable|string',
            'subtitle_ar' => 'nullable|string',
            'cta_text_id' => 'nullable|string',
            'cta_text_en' => 'nullable|string',
            'cta_text_ar' => 'nullable|string',
            'cta_link' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'order' => 'nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($slider->image) {
                Storage::disk('public')->delete($slider->image);
            }
            $validated['image'] = $request->file('image')->store('sliders', 'public');
        } else {
            // Keep existing image if no new file is provided
            unset($validated['image']);
        }

        $slider->update($validated);
        
        // Reload to get updated data
        $slider->refresh();

        $imageUrl = null;
        if ($slider->image) {
            $imageUrl = request()->getSchemeAndHttpHost() . '/storage/' . $slider->image;
        }

        return response()->json([
            'id' => $slider->id,
            'title_id' => $slider->title_id,
            'title_en' => $slider->title_en,
            'title_ar' => $slider->title_ar,
            'subtitle_id' => $slider->subtitle_id,
            'subtitle_en' => $slider->subtitle_en,
            'subtitle_ar' => $slider->subtitle_ar,
            'cta_text_id' => $slider->cta_text_id,
            'cta_text_en' => $slider->cta_text_en,
            'cta_text_ar' => $slider->cta_text_ar,
            'cta_link' => $slider->cta_link,
            'image' => $imageUrl,
            'order' => $slider->order,
            'is_active' => $slider->is_active,
        ]);
    }

    public function destroy($id)
    {
        $slider = Slider::findOrFail($id);
        if ($slider->image) {
            Storage::disk('public')->delete($slider->image);
        }
        $slider->delete();

        return response()->json(['message' => 'Slider deleted successfully']);
    }
}

