<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Profile;

echo "=== Checking Video Profile Data ===\n";

$videoProfiles = Profile::where('type', 'video')->get();

if ($videoProfiles->isEmpty()) {
    echo "❌ No video profiles found in database\n";
} else {
    echo "✅ Found {$videoProfiles->count()} video profile(s):\n";
    foreach ($videoProfiles as $profile) {
        echo "- Key: {$profile->key}\n";
        echo "- Type: {$profile->type}\n";
        echo "- Active: " . ($profile->is_active ? 'Yes' : 'No') . "\n";
        echo "- YouTube URL: " . ($profile->content['id']['youtube_url'] ?? 'Not set') . "\n";
        echo "---\n";
    }
}

echo "\n=== All Profile Types ===\n";
$allProfiles = Profile::select('type', 'key')->get()->groupBy('type');
foreach ($allProfiles as $type => $profiles) {
    echo "Type: {$type}\n";
    foreach ($profiles as $profile) {
        echo "  - {$profile->key}\n";
    }
}
