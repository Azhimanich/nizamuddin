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
        Schema::create('psb_faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->text('answer');
            $table->string('locale', 2)->default('id');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('category')->nullable(); // Optional categorization
            $table->timestamps();
            
            $table->index(['locale', 'is_active', 'order']);
            $table->index(['category', 'locale']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('psb_faqs');
    }
};
