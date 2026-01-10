<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('news', function (Blueprint $table) {
            // Index untuk query yang sering digunakan
            $table->index(['is_published', 'published_at']);
            $table->index(['is_published', 'is_pinned', 'published_at']);
            $table->index('slug');
            $table->index('category_id');
            $table->index('user_id');
        });
    }

    public function down()
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropIndex(['is_published', 'published_at']);
            $table->dropIndex(['is_published', 'is_pinned', 'published_at']);
            $table->dropIndex('slug');
            $table->dropIndex('category_id');
            $table->dropIndex('user_id');
        });
    }
};
