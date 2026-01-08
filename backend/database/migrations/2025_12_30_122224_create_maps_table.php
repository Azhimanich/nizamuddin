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
        Schema::create('maps', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable(); // Nama lokasi
            $table->text('address')->nullable(); // Alamat lengkap
            $table->decimal('latitude', 10, 8)->nullable(); // Latitude
            $table->decimal('longitude', 11, 8)->nullable(); // Longitude
            $table->text('embed_url')->nullable(); // Google Maps Embed URL
            $table->string('api_key')->nullable(); // Google Maps API Key (optional)
            $table->integer('zoom_level')->default(15); // Zoom level (1-20)
            $table->string('map_type')->default('roadmap'); // roadmap, satellite, hybrid, terrain
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
        Schema::dropIfExists('maps');
    }
};
