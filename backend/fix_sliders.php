<?php

require_once 'vendor/autoload.php';

use Illuminate\Http\Request;
use App\Models\Slider;

// Update all sliders to set is_active to true
$updated = Slider::whereNull('is_active')->update(['is_active' => true]);

echo "Updated {$updated} slider records to set is_active = true\n";

// Show the updated records
$sliders = Slider::all();
echo "\nCurrent slider records:\n";
foreach ($sliders as $slider) {
    echo "ID: {$slider->id}, Title: {$slider->title_id}, Active: " . ($slider->is_active ? 'true' : 'false') . "\n";
}
