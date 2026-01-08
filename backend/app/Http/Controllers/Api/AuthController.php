<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $key = 'login.'.$request->ip();
            
            if (RateLimiter::tooManyAttempts($key, 5)) {
                $seconds = RateLimiter::availableIn($key);
                return response()->json([
                    'message' => "Terlalu banyak percobaan login. Coba lagi dalam {$seconds} detik.",
                ], 429);
            }

            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            $credentials = $request->only('email', 'password');
            
            if (!Auth::attempt($credentials, $request->filled('remember'))) {
                RateLimiter::hit($key, 60);
                return response()->json([
                    'message' => 'Email atau password salah.',
                ], 401);
            }

            RateLimiter::clear($key);
            
            $user = Auth::user();
            
            try {
                $token = $user->createToken('auth-token')->plainTextToken;
            } catch (\Exception $e) {
                \Log::error('Token creation failed: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Gagal membuat token. Pastikan personal_access_tokens table sudah dibuat.',
                    'error' => $e->getMessage(),
                ], 500);
            }

            // Load user with roles safely
            $roles = [];
            try {
                $userRoles = $user->roles;
                if ($userRoles && $userRoles->count() > 0) {
                    $roles = $userRoles->pluck('name')->toArray();
                }
            } catch (\Exception $e) {
                \Log::warning('Failed to load roles: ' . $e->getMessage());
                // Continue without roles if there's an error
            }

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $roles,
                ],
                'token' => $token,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Login error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan saat login.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user()->load('roles', 'permissions'));
    }
}

