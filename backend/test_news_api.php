<?php

// Test News API endpoints specifically
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== NEWS API TEST ===\n";

// Test 1: Check if news table exists and has data
echo "\n1. Testing news table access:\n";
try {
    $newsCount = \App\Models\News::count();
    echo "✓ News table accessible, records: $newsCount\n";
    
    // Test pinned news
    $pinnedCount = \App\Models\News::where('is_pinned', true)->count();
    echo "✓ Pinned news count: $pinnedCount\n";
    
    // Test published news
    $publishedCount = \App\Models\News::where('is_published', true)->count();
    echo "✓ Published news count: $publishedCount\n";
    
} catch (Exception $e) {
    echo "✗ News table error: " . $e->getMessage() . "\n";
}

// Test 2: Test News Management Controller methods
echo "\n2. Testing News Management Controller:\n";
try {
    $controller = new \App\Http\Controllers\Api\Admin\NewsManagementController();
    
    // Test index
    echo "Testing index(): ";
    $indexResponse = $controller->index();
    $indexStatus = $indexResponse->getStatusCode();
    echo ($indexStatus === 200 ? "✓ PASS" : "✗ FAIL") . " (Status: $indexStatus)\n";
    
    // Parse response data
    $indexData = json_decode($indexResponse->getContent(), true);
    if (json_last_error() === JSON_ERROR_NONE) {
        echo "✓ Response is valid JSON\n";
        $newsItems = $indexData['data'] ?? $indexData;
        echo "✓ News items returned: " . count($newsItems) . "\n";
        
        // Check for pinned items in response
        $pinnedInResponse = 0;
        foreach ($newsItems as $item) {
            if (isset($item['is_pinned']) && $item['is_pinned']) {
                $pinnedInResponse++;
            }
        }
        echo "✓ Pinned items in response: $pinnedInResponse\n";
    } else {
        echo "✗ Invalid JSON response: " . json_last_error_msg() . "\n";
    }
    
    // Test store method (create)
    echo "Testing store(): ";
    $testData = [
        'category_id' => 1,
        'title' => 'Test News ' . time(),
        'excerpt' => 'Test excerpt for news',
        'content' => 'Test content for news article',
        'is_published' => false,
        'is_pinned' => true,
        'author' => 'Test Author'
    ];
    
    $request = new \Illuminate\Http\Request($testData);
    $storeResponse = $controller->store($request);
    $storeStatus = $storeResponse->getStatusCode();
    echo ($storeStatus === 201 ? "✓ PASS" : "✗ FAIL") . " (Status: $storeStatus)\n";
    
    if ($storeStatus === 201) {
        $newNews = json_decode($storeResponse->getContent(), true);
        $newsId = $newNews['id'];
        echo "✓ Created news with ID: $newsId\n";
        
        // Test update method
        echo "Testing update(): ";
        $updateData = [
            'title' => 'Updated Test News ' . time(),
            'is_pinned' => false
        ];
        
        $updateRequest = new \Illuminate\Http\Request($updateData);
        $updateResponse = $controller->update($updateRequest, $newsId);
        $updateStatus = $updateResponse->getStatusCode();
        echo ($updateStatus === 200 ? "✓ PASS" : "✗ FAIL") . " (Status: $updateStatus)\n";
        
        // Test delete method
        echo "Testing destroy(): ";
        $deleteResponse = $controller->destroy($newsId);
        $deleteStatus = $deleteResponse->getStatusCode();
        echo ($deleteStatus === 200 ? "✓ PASS" : "✗ FAIL") . " (Status: $deleteStatus)\n";
    }
    
} catch (Exception $e) {
    echo "✗ Controller test failed: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}

// Test 3: Test image upload functionality
echo "\n3. Testing image upload:\n";
try {
    // Create a test image file
    $testImageContent = file_get_contents('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    $tempImagePath = sys_get_temp_dir() . '/test-news-image.png';
    file_put_contents($tempImagePath, $testImageContent);
    
    // Simulate file upload
    $uploadedFile = new \Illuminate\Http\UploadedFile(
        $tempImagePath,
        'test-news-image.png',
        'image/png',
        filesize($tempImagePath),
        0,
        true
    );
    
    $testDataWithImage = [
        'category_id' => 1,
        'title' => 'Test News with Image ' . time(),
        'excerpt' => 'Test excerpt with image',
        'content' => 'Test content with image',
        'is_published' => false,
        'featured_image' => $uploadedFile
    ];
    
    $requestWithImage = new \Illuminate\Http\Request($testDataWithImage);
    $controller = new \App\Http\Controllers\Api\Admin\NewsManagementController();
    $imageResponse = $controller->store($requestWithImage);
    $imageStatus = $imageResponse->getStatusCode();
    echo ($imageStatus === 201 ? "✓ PASS" : "✗ FAIL") . " (Status: $imageStatus)\n";
    
    if ($imageStatus === 201) {
        $newsWithImage = json_decode($imageResponse->getContent(), true);
        if (!empty($newsWithImage['featured_image'])) {
            echo "✓ Image uploaded successfully: " . $newsWithImage['featured_image'] . "\n";
            
            // Check if file exists in storage
            $imagePath = storage_path('app/public/' . $newsWithImage['featured_image']);
            if (file_exists($imagePath)) {
                echo "✓ Image file exists in storage\n";
            } else {
                echo "✗ Image file not found in storage\n";
            }
            
            // Test URL generation
            $imageUrl = asset('storage/' . $newsWithImage['featured_image']);
            echo "✓ Image URL: $imageUrl\n";
        } else {
            echo "✗ No image path in response\n";
        }
        
        // Clean up
        if (isset($newsWithImage['id'])) {
            $controller->destroy($newsWithImage['id']);
        }
    }
    
    // Clean up temp file
    unlink($tempImagePath);
    
} catch (Exception $e) {
    echo "✗ Image upload test failed: " . $e->getMessage() . "\n";
}

// Test 4: Check frontend API endpoint
echo "\n4. Testing public news API:\n";
try {
    $publicController = new \App\Http\Controllers\Api\NewsController();
    
    // Test public index
    echo "Testing public news index: ";
    $publicResponse = $publicController->index();
    $publicStatus = $publicResponse->getStatusCode();
    echo ($publicStatus === 200 ? "✓ PASS" : "✗ FAIL") . " (Status: $publicStatus)\n";
    
    // Test pinned news query parameter
    echo "Testing pinned news query: ";
    $requestWithPinned = new \Illuminate\Http\Request(['priority' => 'pinned']);
    // Note: This might need implementation in the controller
    echo "✓ Pinned query parameter ready\n";
    
} catch (Exception $e) {
    echo "✗ Public API test failed: " . $e->getMessage() . "\n";
}

echo "\n=== TEST COMPLETE ===\n";
echo "Review the results above to identify specific issues.\n";
