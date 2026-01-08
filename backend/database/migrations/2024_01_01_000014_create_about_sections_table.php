<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('about_sections', function (Blueprint $table) {
            $table->id();
            $table->string('title_id');
            $table->string('title_en')->nullable();
            $table->string('title_ar')->nullable();
            $table->text('content_id');
            $table->text('content_en')->nullable();
            $table->text('content_ar')->nullable();
            $table->string('cta_text_id')->nullable();
            $table->string('cta_text_en')->nullable();
            $table->string('cta_text_ar')->nullable();
            $table->string('cta_link')->nullable();
            $table->string('image')->nullable();
            $table->string('video_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('about_sections');
    }
};

