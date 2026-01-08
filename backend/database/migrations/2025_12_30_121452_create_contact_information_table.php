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
        Schema::create('contact_information', function (Blueprint $table) {
            $table->id();
            $table->string('type')->unique(); // 'address', 'phone', 'email', 'google_maps_api_key', 'google_maps_embed_url'
            $table->text('value_id')->nullable(); // Bahasa Indonesia
            $table->text('value_en')->nullable(); // Bahasa Inggris
            $table->text('value_ar')->nullable(); // Bahasa Arab
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_information');
    }
};
