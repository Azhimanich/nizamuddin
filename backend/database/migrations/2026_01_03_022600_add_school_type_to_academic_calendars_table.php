<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('academic_calendars', function (Blueprint $table) {
            $table->string('school_type')->after('type')->default('tk'); // tk, sd, smp, kepondokan
            $table->integer('order')->after('school_type')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('academic_calendars', function (Blueprint $table) {
            $table->dropColumn(['school_type', 'order']);
        });
    }
};
