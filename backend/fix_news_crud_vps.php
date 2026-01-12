<?php

// Comprehensive fix for News CRUD issues on VPS
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== NEWS CRUD VPS FIX ===\n";

// 1. Check database migrations for news
echo "\n1. Checking news table structure...\n";
try {
    $newsColumns = \Illuminate\Support\Facades\Schema::getColumnListing('news');
    $requiredColumns = ['id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 'is_published', 'is_pinned', 'category_id', 'user_id', 'author'];
    
    foreach ($requiredColumns as $column) {
        if (in_array($column, $newsColumns)) {
            echo "✓ Column '$column' exists\n";
        } else {
            echo "✗ Column '$column' MISSING\n";
        }
    }
    
    // Check if is_pinned column exists and has correct type
    if (in_array('is_pinned', $newsColumns)) {
        $columnType = \Illuminate\Support\Facades\DB::getSchemaBuilder()->getColumnType('news', 'is_pinned');
        echo "✓ is_pinned column type: $columnType\n";
    }
    
} catch (Exception $e) {
    echo "✗ Error checking news table: " . $e->getMessage() . "\n";
}

// 2. Check storage configuration and permissions
echo "\n2. Checking storage configuration...\n";
$storagePaths = [
    'storage' => storage_path(),
    'app_public' => storage_path('app/public'),
    'news_storage' => storage_path('app/public/news'),
    'public_storage' => public_path('storage'),
];

foreach ($storagePaths as $name => $path) {
    if (is_dir($path)) {
        $writable = is_writable($path);
        echo "✓ $name: $path (" . ($writable ? "WRITABLE" : "NOT WRITABLE") . ")\n";
        
        if (!$writable) {
            echo "  → Attempting to fix permissions...\n";
            chmod($path, 0755);
            $writableAfter = is_writable($path);
            echo "  → After fix: " . ($writableAfter ? "WRITABLE" : "STILL NOT WRITABLE") . "\n";
        }
    } else {
        echo "✗ $name: $path (DIRECTORY MISSING)\n";
        echo "  → Creating directory...\n";
        mkdir($path, 0755, true);
        echo "  → Created: $path\n";
    }
}

// 3. Check symbolic link
echo "\n3. Checking storage symbolic link...\n";
$publicStorage = public_path('storage');
$targetStorage = storage_path('app/public');

if (is_link($publicStorage)) {
    $linkTarget = readlink($publicStorage);
    if ($linkTarget === $targetStorage) {
        echo "✓ Storage link exists and points to correct target\n";
    } else {
        echo "✗ Storage link points to wrong target: $linkTarget\n";
        echo "  → Recreating storage link...\n";
        unlink($publicStorage);
        symlink($targetStorage, $publicStorage);
        echo "  → Storage link recreated\n";
    }
} else {
    echo "✗ Storage link missing\n";
    echo "  → Creating storage link...\n";
    try {
        symlink($targetStorage, $publicStorage);
        echo "  ✓ Storage link created\n";
    } catch (Exception $e) {
        echo "  ✗ Failed to create link: " . $e->getMessage() . "\n";
        echo "  → Try running: php artisan storage:link\n";
    }
}

// 4. Test image upload functionality
echo "\n4. Testing image upload functionality...\n";
try {
    // Test creating a test image path
    $testImagePath = 'news/test-image-' . time() . '.jpg';
    $fullPath = storage_path('app/public/' . $testImagePath);
    
    // Create a simple test image
    $imageData = imagecreatetruecolor(100, 100);
    imagejpeg($imageData, $fullPath);
    imagedestroy($imageData);
    
    if (file_exists($fullPath)) {
        echo "✓ Test image created successfully\n";
        
        // Test URL generation
        $imageUrl = asset('storage/' . $testImagePath);
        echo "✓ Image URL would be: $imageUrl\n";
        
        // Clean up test image
        unlink($fullPath);
        echo "✓ Test image cleaned up\n";
    } else {
        echo "✗ Failed to create test image\n";
    }
} catch (Exception $e) {
    echo "✗ Image upload test failed: " . $e->getMessage() . "\n";
}

// 5. Check news controller methods
echo "\n5. Testing News Management Controller...\n";
try {
    $controller = new \App\Http\Controllers\Api\Admin\NewsManagementController();
    
    // Test index method
    echo "Testing index() method: ";
    $response = $controller->index();
    $statusCode = $response->getStatusCode();
    echo ($statusCode === 200 ? "✓ PASS ($statusCode)" : "✗ FAIL ($statusCode)") . "\n";
    
    // Check if pinned news are handled correctly
    $newsData = json_decode($response->getContent(), true);
    if (is_array($newsData)) {
        $pinnedCount = 0;
        foreach ($newsData['data'] ?? $newsData as $item) {
            if (isset($item['is_pinned']) && $item['is_pinned']) {
                $pinnedCount++;
            }
        }
        echo "✓ Found $pinnedCount pinned news items\n";
    }
    
} catch (Exception $e) {
    echo "✗ News controller test failed: " . $e->getMessage() . "\n";
}

// 6. Check API routes for news
echo "\n6. Checking API routes...\n";
try {
    $routes = \Illuminate\Support\Facades\Route::getRoutes();
    $newsRoutes = [];
    
    foreach ($routes as $route) {
        $uri = $route->uri();
        if (strpos($uri, 'admin/news') !== false) {
            $methods = implode(', ', $route->methods());
            $newsRoutes[] = "$methods $uri";
        }
    }
    
    if (!empty($newsRoutes)) {
        echo "✓ Found news CRUD routes:\n";
        foreach ($newsRoutes as $route) {
            echo "  → $route\n";
        }
    } else {
        echo "✗ No news CRUD routes found\n";
    }
} catch (Exception $e) {
    echo "✗ Route check failed: " . $e->getMessage() . "\n";
}

// 7. Check environment variables
echo "\n7. Checking environment configuration...\n";
$envChecks = [
    'APP_URL' => env('APP_URL'),
    'APP_ENV' => env('APP_ENV'),
    'FILESYSTEM_DISK' => env('FILESYSTEM_DISK'),
    'CACHE_STORE' => env('CACHE_STORE'),
];

foreach ($envChecks as $key => $value) {
    echo "✓ $key: " . ($value ?: 'NOT SET') . "\n";
}

// 8. Generate fix commands
echo "\n8. Recommended fix commands:\n";
echo "Run these commands on your VPS:\n\n";

echo "# Fix storage permissions\n";
echo "chmod -R 755 storage/\n";
echo "chmod -R 755 bootstrap/cache/\n\n";

echo "# Create storage link\n";
echo "php artisan storage:link --force\n\n";

echo "# Clear caches\n";
echo "php artisan cache:clear\n";
echo "php artisan config:clear\n";
echo "php artisan route:clear\n";
echo "php artisan view:clear\n\n";

echo "# Run migrations (if needed)\n";
echo "php artisan migrate --force\n\n";

echo "# Optimize for production\n";
echo "php artisan config:cache\n";
echo "php artisan route:cache\n";
echo "php artisan view:cache\n\n";

echo "=== FIX COMPLETE ===\n";
echo "Please check the output above and run the recommended commands.\n";
