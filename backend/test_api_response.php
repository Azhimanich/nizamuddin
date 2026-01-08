<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Profile;

echo "=== Simulating API Response ===\n";

$locale = 'id';

$profiles = Profile::where('is_active', true)
    ->orderBy('order')
    ->get()
    ->map(function ($profile) use ($locale) {
        $content = $profile->content[$locale] ?? $profile->content['id'] ?? [];
        return [
            'id' => $profile->id,
            'type' => $profile->type,
            'key' => $profile->key,
            'content' => $content,
            'image' => $profile->image ? 'http://localhost:8000/storage/' . $profile->image : null,
            'video_url' => $profile->video_url,
        ];
    });

// Group by type for easier access
$grouped = [];
foreach ($profiles as $profile) {
    if (!isset($grouped[$profile['type']])) {
        $grouped[$profile['type']] = [];
    }
    $grouped[$profile['type']][$profile['key']] = $profile;
}

echo "Video profil data:\n";
if (isset($grouped['video']['video_profil'])) {
    $videoProfile = $grouped['video']['video_profil'];
    echo "✅ Found video_profil\n";
    echo "Content keys: " . implode(', ', array_keys($videoProfile['content'])) . "\n";
    echo "YouTube URL: " . ($videoProfile['content']['youtube_url'] ?? 'NOT FOUND') . "\n";
    echo "Title: " . ($videoProfile['content']['title'] ?? 'NOT FOUND') . "\n";
    echo "Description: " . ($videoProfile['content']['description'] ?? 'NOT FOUND') . "\n";
} else {
    echo "❌ video_profil not found\n";
    echo "Available types: " . implode(', ', array_keys($grouped)) . "\n";
    if (isset($grouped['video'])) {
        echo "Available video keys: " . implode(', ', array_keys($grouped['video'])) . "\n";
    }
}

echo "\nFull JSON structure:\n";
echo json_encode($grouped, JSON_PRETTY_PRINT);
