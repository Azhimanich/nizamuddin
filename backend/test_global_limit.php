<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test the new global 3-item limit
use App\Http\Controllers\Api\AcademicController;
use Illuminate\Http\Request;

try {
    $controller = new AcademicController();
    
    // Check current pinned count
    $currentCount = \App\Models\AcademicCalendar::where('is_pinned', true)->count();
    echo "Current total pinned events: {$currentCount}\n";
    
    if ($currentCount < 3) {
        // Try to pin an event to test the limit
        $unpinnedEvent = \App\Models\AcademicCalendar::where('is_pinned', false)->first();
        if ($unpinnedEvent) {
            echo "Trying to pin event: {$unpinnedEvent->title} (ID: {$unpinnedEvent->id})\n";
            
            $request = new Request();
            $result = $controller->pinEvent($request, $unpinnedEvent->id);
            
            echo "Status: " . $result->getStatusCode() . "\n";
            echo "Content: " . $result->getContent() . "\n";
        }
    } else {
        echo "Already at 3 pinned events. Testing limit enforcement...\n";
        
        // Try to pin another event
        $unpinnedEvent = \App\Models\AcademicCalendar::where('is_pinned', false)->first();
        if ($unpinnedEvent) {
            echo "Trying to pin event when at limit: {$unpinnedEvent->title} (ID: {$unpinnedEvent->id})\n";
            
            $request = new Request();
            $result = $controller->pinEvent($request, $unpinnedEvent->id);
            
            echo "Status: " . $result->getStatusCode() . "\n";
            echo "Content: " . $result->getContent() . "\n";
        }
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
