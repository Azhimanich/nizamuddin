<?php

use Illuminate\Support\Facades\DB;
use App\Models\Slider;

// Update all sliders to set is_active to true
$updated = DB::table('sliders')->whereNull('is_active')->update(['is_active' => 1]);

echo "Updated {$updated} slider records to set is_active = 1\n";

// Or update all sliders regardless of current value
$allUpdated = DB::table('sliders')->update(['is_active' => 1]);
echo "Total sliders updated: {$allUpdated}\n";
