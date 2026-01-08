<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Profile;

echo "=== Test YouTube Autoplay Function ===\n";

function getYoutubeEmbedUrl($url) {
    try {
        if (!$url) return '';
        
        echo "Original YouTube URL: {$url}\n";
        
        // Extract video ID from YouTube URL
        $regex = '/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/';
        preg_match($regex, $url, $match);
        
        if ($match && $match[1]) {
            // Add autoplay and mute parameters for autoplay functionality
            $embedUrl = "https://www.youtube.com/embed/{$match[1]}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1";
            echo "Generated embed URL: {$embedUrl}\n";
            return $embedUrl;
        }
        
        // If it's already an embed URL, add autoplay parameters
        if (strpos($url, 'youtube.com/embed/') !== false) {
            $separator = strpos($url, '?') !== false ? '&' : '?';
            $autoplayUrl = $url . $separator . 'autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1';
            echo "URL is already embed format, adding autoplay: {$autoplayUrl}\n";
            return $autoplayUrl;
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
        echo "✅ Success! Autoplay Embed URL: {$embedUrl}\n";
        
        // Test iframe HTML
        $iframe = '<iframe src="' . $embedUrl . '" title="Video Profil Pondok Pesantren Nizamuddin" width="560" height="315" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
        echo "Generated iframe HTML:\n{$iframe}\n";
        
        echo "\n📋 Parameter Breakdown:\n";
        echo "- autoplay=1: Video akan otomatis play\n";
        echo "- mute=1: Video dalam keadaan muted (wajib untuk autoplay)\n";
        echo "- playsinline=1: Support untuk mobile devices\n";
        echo "- rel=0: Tidak menampilkan video terkait\n";
        echo "- modestbranding=1: Minimal branding YouTube\n";
    } else {
        echo "❌ Failed to generate embed URL\n";
    }
} else {
    echo "❌ Video profile not found\n";
}
