<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('academic_calendars', function (Blueprint $table) {
            // Only add pinned_at if it doesn't exist
            if (!Schema::hasColumn('academic_calendars', 'pinned_at')) {
                $table->timestamp('pinned_at')->nullable()->after('is_pinned');
            }
        });
    }

    public function down(): void
    {
        Schema::table('academic_calendars', function (Blueprint $table) {
            $table->dropColumn('pinned_at');
        });
    }
};
