<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Profile;

echo "=== Update Video Profile YouTube URL ===\n";

$videoProfile = Profile::where('type', 'video')->where('key', 'video_profil')->first();

if ($videoProfile) {
    $content = $videoProfile->content;
    $newUrl = 'https://www.youtube.com/watch?v=ScMzIvxBSi4';
    
    // Update YouTube URL untuk semua bahasa
    $content['id']['youtube_url'] = $newUrl;
    $content['en']['youtube_url'] = $newUrl;
    $content['ar']['youtube_url'] = $newUrl;
    
    $videoProfile->content = $content;
    $videoProfile->save();
    
    echo "✅ Updated YouTube URL to: {$newUrl}\n";
    echo "Current content structure:\n";
    print_r($videoProfile->content);
} else {
    echo "❌ Video profile not found\n";
}
