<?php

use Illuminate\Support\Facades\DB;

echo "Fixing all modules with is_active filtering...\n";
echo "============================================\n";

// List of all tables that use is_active filtering based on controller analysis
$tables = [
    'sliders',
    'staff', 
    'social_media',
    'profiles',
    'organization_structures',
    'maps',
    'albums',
    'photos', 
    'videos',
    'downloads',
    'download_categories',
    'contact_information',
    'whatsapp_subscriptions',
    'categories',
    'announcements',
    'academic_calendars',
    'specialization_categories',
    'about_sections',
    'programs',
    'daily_schedules'
];

$totalFixed = 0;

foreach ($tables as $table) {
    try {
        // Check if table exists
        $tableExists = DB::getSchemaBuilder()->hasTable($table);
        
        if (!$tableExists) {
            echo "Table: $table - Does not exist\n";
            continue;
        }
        
        // Check if is_active column exists
        $columnExists = DB::getSchemaBuilder()->hasColumn($table, 'is_active');
        
        if (!$columnExists) {
            echo "Table: $table - No is_active column\n";
            continue;
        }
        
        // Count total records
        $totalRecords = DB::table($table)->count();
        
        // Count NULL is_active records
        $nullActiveCount = DB::table($table)->whereNull('is_active')->count();
        
        echo "Table: $table - Total: $totalRecords, NULL is_active: $nullActiveCount\n";
        
        if ($nullActiveCount > 0) {
            // Update all NULL is_active to true (1)
            $updated = DB::table($table)->whereNull('is_active')->update(['is_active' => 1]);
            echo "  -> FIXED: Updated $updated records to is_active = 1\n";
            $totalFixed += $updated;
        } else {
            echo "  -> OK: All records have is_active set\n";
        }
        
    } catch (Exception $e) {
        echo "Table: $table - Error: " . $e->getMessage() . "\n";
    }
}

echo "\n============================================\n";
echo "Total records fixed: $totalFixed\n";
echo "All modules should now display correctly!\n";
