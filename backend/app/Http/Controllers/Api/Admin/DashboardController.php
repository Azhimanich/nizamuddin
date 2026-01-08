<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\News;
use App\Models\Download;
use App\Models\Contact;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_news' => News::count(),
            'published_news' => News::where('is_published', true)->count(),
            'total_downloads' => Download::sum('download_count'),
            'unread_contacts' => Contact::where('is_read', false)->count(),
            'recent_activities' => ActivityLog::latest()->limit(10)->get(),
        ];

        return response()->json($stats);
    }

    public function statistics()
    {
        $visitors = DB::table('activity_logs')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topDownloads = Download::orderBy('download_count', 'desc')
            ->limit(10)
            ->get(['title', 'download_count']);

        return response()->json([
            'visitors' => $visitors,
            'top_downloads' => $topDownloads,
        ]);
    }
}

