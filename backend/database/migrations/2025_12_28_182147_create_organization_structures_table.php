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
        Schema::create('organization_structures', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nama orang
            $table->string('position'); // Jabatan
            $table->integer('level')->default(1); // Level hierarki (1 = pimpinan tertinggi, dst)
            $table->integer('order')->default(0); // Urutan dalam level yang sama
            $table->unsignedBigInteger('parent_id')->nullable(); // ID parent untuk struktur hierarkis
            $table->string('photo')->nullable(); // Foto
            $table->text('bio_id')->nullable(); // Biografi bahasa Indonesia
            $table->text('bio_en')->nullable(); // Biografi bahasa Inggris
            $table->text('bio_ar')->nullable(); // Biografi bahasa Arab
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('organization_structures')->onDelete('cascade');
            $table->index('level');
            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organization_structures');
    }
};
