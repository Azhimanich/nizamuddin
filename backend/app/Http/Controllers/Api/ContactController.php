<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\WhatsappSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $contact = Contact::create($validated);

        return response()->json([
            'message' => 'Pesan berhasil dikirim',
            'contact' => $contact,
        ], 201);
    }

    public function subscribeWhatsApp(Request $request)
    {
        $validated = $request->validate([
            'phone_number' => 'required|string',
            'name' => 'nullable|string',
        ]);

        $subscription = WhatsappSubscription::firstOrCreate(
            ['phone_number' => $validated['phone_number']],
            ['name' => $validated['name'] ?? null, 'is_active' => true]
        );

        return response()->json([
            'message' => 'Berhasil berlangganan',
            'subscription' => $subscription,
        ]);
    }

    public function blastWhatsApp(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $subscriptions = WhatsappSubscription::where('is_active', true)->get();
        $apiKey = config('services.whatsapp.api_key');
        $phoneNumber = config('services.whatsapp.phone_number');

        foreach ($subscriptions as $subscription) {
            // Implement WhatsApp API call here
            // Example using HTTP client
            Http::post('https://api.whatsapp.com/send', [
                'api_key' => $apiKey,
                'phone' => $subscription->phone_number,
                'message' => $request->message,
            ]);
        }

        return response()->json([
            'message' => 'Blast WhatsApp berhasil dikirim ke ' . $subscriptions->count() . ' nomor',
        ]);
    }
}

