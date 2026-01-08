<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'user_id',
        'author',
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'image_caption',
        'related_articles',
        'meta_title',
        'meta_description',
        'views',
        'is_published',
        'is_pinned',
        'allow_comments',
        'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_pinned' => 'boolean',
        'allow_comments' => 'boolean',
        'published_at' => 'datetime',
        'related_articles' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($news) {
            if (empty($news->slug)) {
                $news->slug = Str::slug($news->title);
            }
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class)->where('is_approved', true);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'news_tags');
    }
}

