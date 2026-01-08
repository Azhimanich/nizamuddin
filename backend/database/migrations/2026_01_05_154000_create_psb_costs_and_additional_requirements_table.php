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
        Schema::create('psb_costs', function (Blueprint $table) {
            $table->id();
            $table->string('item_name'); // Biaya Pendaftaran, Biaya Tes Masuk, etc.
            $table->string('amount'); // Rp 500.000, etc.
            $table->text('note')->nullable(); // Additional notes
            $table->string('locale')->default('id'); // id or en
            $table->integer('order')->default(0); // For ordering
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['locale']);
        });

        Schema::create('psb_additional_requirements', function (Blueprint $table) {
            $table->id();
            $table->text('requirement'); // Usia minimal 6 tahun, etc.
            $table->string('locale')->default('id'); // id or en
            $table->integer('order')->default(0); // For ordering
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['locale']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('psb_additional_requirements');
        Schema::dropIfExists('psb_costs');
    }
};
