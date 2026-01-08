<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Profile;

echo "=== Test YouTube Embed Function ===\n";

function getYoutubeEmbedUrl($url) {
    try {
        if (!$url) return '';
        
        echo "Original YouTube URL: {$url}\n";
        
        // Extract video ID from YouTube URL
        $regex = '/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/';
        preg_match($regex, $url, $match);
        
        if ($match && $match[1]) {
            $embedUrl = "https://www.youtube.com/embed/{$match[1]}";
            echo "Generated embed URL: {$embedUrl}\n";
            return $embedUrl;
        }
        
        // If it's already an embed URL, return as is
        if (strpos($url, 'youtube.com/embed/') !== false) {
            echo "URL is already embed format: {$url}\n";
            return $url;
        }
        
        echo "Could not extract video ID from: {$url}\n";
        return '';
    } catch (Exception $error) {
        echo "Error parsing YouTube URL: " . $error->getMessage() . "\n";
        return '';
    }
}

// Test dengan URL dari database
$videoProfile = Profile::where('type', 'video')->where('key', 'video_profil')->first();

if ($videoProfile) {
    $youtubeUrl = $videoProfile->content['id']['youtube_url'];
    echo "Testing with URL: {$youtubeUrl}\n";
    
    $embedUrl = getYoutubeEmbedUrl($youtubeUrl);
    
    if ($embedUrl) {
        echo "✅ Success! Embed URL: {$embedUrl}\n";
        
        // Test iframe HTML
        $iframe = '<iframe src="' . $embedUrl . '" title="Test Video" width="560" height="315" allowfullscreen></iframe>';
        echo "Generated iframe HTML:\n{$iframe}\n";
    } else {
        echo "❌ Failed to generate embed URL\n";
    }
} else {
    echo "❌ Video profile not found\n";
}
