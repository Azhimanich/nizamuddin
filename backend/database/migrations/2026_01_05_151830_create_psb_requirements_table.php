<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('psb_requirements', function (Blueprint $table) {
            $table->id();
            $table->string('category'); // Dokumen Identitas, Dokumen Akademik, Dokumen Kesehatan
            $table->string('item'); // Individual requirement item
            $table->string('locale')->default('id'); // id or en
            $table->integer('order')->default(0); // For ordering items
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['category', 'locale']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('psb_requirements');
    }
};
