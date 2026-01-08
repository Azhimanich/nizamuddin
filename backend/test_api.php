<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Profile;

echo "=== Testing Profile API Response ===\n";

// Simulate API response
$profiles = Profile::orderBy('order')->get()->map(function ($item) {
    return [
        'id' => $item->id,
        'type' => $item->type,
        'key' => $item->key,
        'content' => $item->content,
        'image' => $item->image ? 'http://localhost:8000/storage/' . $item->image : null,
        'video_url' => $item->video_url,
        'order' => $item->order,
        'is_active' => $item->is_active,
    ];
});

$groupedProfiles = [];
foreach ($profiles as $profile) {
    $groupedProfiles[$profile['type']][$profile['key']] = $profile;
}

echo "Video profile data structure:\n";
if (isset($groupedProfiles['video']['video_profil'])) {
    $videoProfile = $groupedProfiles['video']['video_profil'];
    echo "✅ Found video_profil:\n";
    echo "- Type: " . $videoProfile['type'] . "\n";
    echo "- Key: " . $videoProfile['key'] . "\n";
    echo "- Content structure:\n";
    print_r($videoProfile['content']);
} else {
    echo "❌ video_profil not found\n";
}

echo "\n=== Identity Profile Data ===\n";
if (isset($groupedProfiles['identity'])) {
    echo "✅ Found identity profiles:\n";
    foreach ($groupedProfiles['identity'] as $key => $profile) {
        echo "- {$key}: " . ($profile['content']['id']['value'] ?? 'No value') . "\n";
    }
} else {
    echo "❌ No identity profiles found\n";
}
