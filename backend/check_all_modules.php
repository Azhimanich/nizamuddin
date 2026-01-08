<?php

use Illuminate\Support\Facades\DB;

// Check all relevant tables for NULL is_active values
$tables = ['news', 'galleries', 'categories', 'downloads', 'programs', 'staff', 'agendas', 'contacts', 'about_sections', 'psb_requirements'];

echo "Checking tables for NULL is_active values:\n";
echo "========================================\n";

foreach ($tables as $table) {
    try {
        $count = DB::table($table)->count();
        $nullActive = DB::table($table)->whereNull('is_active')->count();
        echo "Table: $table - Total: $count, NULL is_active: $nullActive\n";
        
        if ($nullActive > 0) {
            echo "  -> NEEDS FIX: $nullActive records have NULL is_active\n";
        }
    } catch (Exception $e) {
        echo "Table: $table - Error: " . $e->getMessage() . "\n";
    }
}

echo "\nChecking for other status columns:\n";
echo "==================================\n";

// Check for other common status columns
$otherTables = ['news', 'galleries', 'categories', 'downloads', 'programs', 'staff', 'agendas', 'contacts'];

foreach ($otherTables as $table) {
    try {
        $columns = DB::getSchemaBuilder()->getColumnListing($table);
        $statusColumns = array_filter($columns, function($col) {
            return strpos($col, 'status') !== false || strpos($col, 'active') !== false;
        });
        
        if (!empty($statusColumns)) {
            echo "Table: $table - Status columns: " . implode(', ', $statusColumns) . "\n";
            
            foreach ($statusColumns as $col) {
                $nullCount = DB::table($table)->whereNull($col)->count();
                if ($nullCount > 0) {
                    echo "  -> $col: $nullCount NULL values\n";
                }
            }
        }
    } catch (Exception $e) {
        echo "Table: $table - Error checking columns: " . $e->getMessage() . "\n";
    }
}
