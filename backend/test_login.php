<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

try {
    // Test user exists and password
    $user = User::where('email', 'admin@pesantren.com')->first();
    
    if ($user) {
        echo "User found: " . $user->name . " - " . $user->email . "\n";
        
        // Test password
        if (Hash::check('password', $user->password)) {
            echo "Password verification: OK\n";
            
            // Test login attempt
            $credentials = ['email' => 'admin@pesantren.com', 'password' => 'password'];
            if (Auth::attempt($credentials)) {
                echo "Auth attempt: SUCCESS\n";
                
                // Create token
                try {
                    $token = $user->createToken('test-token')->plainTextToken;
                    echo "Token creation: SUCCESS\n";
                    echo "Token: " . substr($token, 0, 20) . "...\n";
                } catch (Exception $e) {
                    echo "Token creation: FAILED - " . $e->getMessage() . "\n";
                }
            } else {
                echo "Auth attempt: FAILED\n";
            }
        } else {
            echo "Password verification: FAILED\n";
        }
    } else {
        echo "User not found\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
