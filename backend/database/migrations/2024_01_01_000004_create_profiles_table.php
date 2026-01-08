<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // welcome, vision, mission, identity, etc
            $table->string('key')->unique();
            $table->json('content'); // Multi-language content
            $table->string('image')->nullable();
            $table->string('video_url')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('profile_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained()->onDelete('cascade');
            $table->string('locale', 2);
            $table->text('title')->nullable();
            $table->longText('content')->nullable();
            $table->timestamps();
            
            $table->unique(['profile_id', 'locale']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_translations');
        Schema::dropIfExists('profiles');
    }
};

