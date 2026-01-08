<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\AcademicController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\DownloadController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\StaffManagementController;
use App\Http\Controllers\Api\Admin\CalendarController;
use App\Http\Controllers\Api\Admin\ProgramController;
use App\Http\Controllers\Api\Admin\DailyScheduleController;
use App\Http\Controllers\Api\Admin\NewsManagementController;
use App\Http\Controllers\Api\Admin\AgendaController;
use App\Http\Controllers\Api\Admin\GalleryManagementController;
use App\Http\Controllers\Api\Admin\DownloadManagementController;
use App\Http\Controllers\Api\Admin\DownloadCategoryController as AdminDownloadCategoryController;
use App\Http\Controllers\Api\DownloadCategoryController;
use App\Http\Controllers\Api\Admin\SystemController;
use App\Http\Controllers\Api\Admin\SliderController as AdminSliderController;
use App\Http\Controllers\Api\Admin\AboutSectionController as AdminAboutSectionController;
use App\Http\Controllers\Api\Admin\ProfileManagementController;
use App\Http\Controllers\Api\Admin\SocialMediaController as AdminSocialMediaController;
use App\Http\Controllers\Api\SliderController;
use App\Http\Controllers\Api\AboutSectionController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\SocialMediaController;
use App\Http\Controllers\Api\OrganizationStructureController;
use App\Http\Controllers\Api\Admin\OrganizationStructureController as AdminOrganizationStructureController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\ContactManagementController;
use App\Http\Controllers\Api\Admin\ContactInformationController as AdminContactInformationController;
use App\Http\Controllers\Api\ContactInformationController;
use App\Http\Controllers\Api\Admin\MapController as AdminMapController;
use App\Http\Controllers\Api\MapController;
use App\Http\Controllers\Api\PsbController;
use App\Http\Controllers\Api\Admin\PsbManagementController;
use App\Http\Controllers\Api\Admin\PsbRequirementController;
use App\Http\Controllers\Api\Admin\PsbCostController;
use App\Http\Controllers\Api\Admin\PsbAdditionalRequirementController;
use App\Http\Controllers\Api\Admin\PsbFaqController;
use App\Http\Controllers\Api\PSBRequirementsController;
use App\Http\Controllers\Api\PsbHeaderController;
use App\Http\Controllers\Api\Admin\PsbHeaderController as AdminPsbHeaderController;
use App\Http\Controllers\Api\Admin\RoleController;
use App\Http\Controllers\Api\Admin\PermissionController;

// Public routes
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::get('/profile', [ProfileController::class, 'index']);
Route::get('/academic', [AcademicController::class, 'index']);
Route::get('/academic/calendar', [AcademicController::class, 'calendar']);
Route::get('/academic/calendar/{id}', [AcademicController::class, 'show']);
Route::get('/daily-schedules', [AcademicController::class, 'dailySchedules']);
Route::get('/staff', [StaffController::class, 'index']);
Route::get('/staff/{id}', [StaffController::class, 'show']);
Route::get('/specialization-categories', [\App\Http\Controllers\Api\Admin\SpecializationCategoryController::class, 'index']);
Route::get('/categories', [\App\Http\Controllers\Api\CategoryController::class, 'index']);
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{slug}', [NewsController::class, 'show']);
Route::get('/agenda', [\App\Http\Controllers\Api\AgendaController::class, 'index']);
Route::get('/agenda/{id}', [\App\Http\Controllers\Api\AgendaController::class, 'show']);
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/gallery/photos', [GalleryController::class, 'photos']);
Route::get('/gallery/videos', [GalleryController::class, 'videos']);
Route::get('/downloads', [DownloadController::class, 'index']);
Route::get('/downloads/{id}/download', [DownloadController::class, 'download']);
Route::get('/download-categories', [DownloadCategoryController::class, 'index']);
Route::get('/sliders', [SliderController::class, 'index']);
Route::get('/about', [AboutSectionController::class, 'index']);
Route::get('/social-media', [SocialMediaController::class, 'index']);
Route::get('/organization-structure', [OrganizationStructureController::class, 'index']);
Route::get('/contact-information', [ContactInformationController::class, 'index']);
Route::get('/map', [MapController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']);
Route::post('/whatsapp/subscribe', [ContactController::class, 'subscribeWhatsApp']);
Route::post('/psb/register', [PsbController::class, 'store']);
Route::post('/psb/check-status', [PsbController::class, 'checkStatus']);
Route::get('/psb/requirements', [PSBRequirementsController::class, 'getRequirements']);
Route::get('/psb/faqs', [\App\Http\Controllers\Api\PSBFaqController::class, 'getFaqs']);
Route::get('/psb/header', [PsbHeaderController::class, 'show']);

// PSB Management - Public routes (accessible without auth for now)
Route::get('/admin/psb-registrations/statistics', [PsbManagementController::class, 'statistics']);
Route::get('/admin/psb-registrations', [PsbManagementController::class, 'index']);
Route::get('/admin/psb-registrations/export', [PsbManagementController::class, 'export']);
Route::get('/admin/psb-registrations/{id}', [PsbManagementController::class, 'show']);
Route::put('/admin/psb-registrations/{id}/status', [PsbManagementController::class, 'updateStatus']);
Route::delete('/admin/psb-registrations/{id}', [PsbManagementController::class, 'destroy']);
Route::post('/admin/psb-registrations/bulk-update-status', [PsbManagementController::class, 'bulkUpdateStatus']);
Route::post('/admin/psb-registrations/bulk-delete', [PsbManagementController::class, 'bulkDelete']);

// Search
Route::get('/search', [\App\Http\Controllers\Api\SearchController::class, 'search']);

// Authentication
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
        
        // Super Admin only
        Route::middleware('role:super_admin')->group(function () {
            Route::apiResource('users', UserController::class);
            Route::apiResource('roles', RoleController::class);
            Route::apiResource('permissions', PermissionController::class);
            Route::get('/logs', [SystemController::class, 'logs']);
            Route::get('/statistics', [DashboardController::class, 'statistics']);
            Route::put('/settings', [SystemController::class, 'updateSettings']);
        });
        
        // Admin Akademik
        Route::middleware('role:super_admin|admin_akademik')->group(function () {
            Route::apiResource('staff', StaffManagementController::class);
            Route::apiResource('organization-structure', AdminOrganizationStructureController::class);
            Route::apiResource('specialization-categories', \App\Http\Controllers\Api\Admin\SpecializationCategoryController::class);
            Route::apiResource('programs', ProgramController::class);
            // Calendar routes handled by AcademicController
            Route::apiResource('daily-schedules', DailyScheduleController::class);
            Route::get('/academic/calendar', [AcademicController::class, 'calendar']);
            Route::post('/academic/calendar', [AcademicController::class, 'store']);
            Route::put('/academic/calendar/{id}', [AcademicController::class, 'update']);
            Route::delete('/academic/calendar/{id}', [AcademicController::class, 'destroy']);
            Route::post('/academic/calendar/{id}/pin', [AcademicController::class, 'pinEvent']);
            Route::get('/academic/calendar/pinned/{school_type}', [AcademicController::class, 'getPinnedEvents']);
            Route::put('/facilities', [SystemController::class, 'updateFacilities']);
        });
        
        // Admin Humas - Homepage Management
        Route::middleware('role:super_admin|admin_humas')->group(function () {
            Route::apiResource('sliders', AdminSliderController::class);
            Route::apiResource('social-media', AdminSocialMediaController::class);
            Route::get('/about', [AdminAboutSectionController::class, 'index']);
            Route::post('/about', [AdminAboutSectionController::class, 'store']);
            Route::put('/about/{id}', [AdminAboutSectionController::class, 'update']);
            Route::delete('/about/{id}', [AdminAboutSectionController::class, 'destroy']);
            Route::apiResource('profiles', ProfileManagementController::class);
        });
        
        // Admin Humas - Profile Management
        Route::middleware('role:super_admin|admin_humas')->group(function () {
            Route::apiResource('profiles', ProfileManagementController::class);
            Route::get('/identity-keys', [ProfileManagementController::class, 'getIdentityKeys']);
            Route::get('/video-keys', [ProfileManagementController::class, 'getVideoKeys']);
        });
        
        // Admin Humas & Akademik
        Route::middleware('role:super_admin|admin_humas|admin_akademik')->group(function () {
            Route::apiResource('categories', CategoryController::class);
            Route::apiResource('news', NewsManagementController::class);
            Route::apiResource('agenda', AgendaController::class);
            Route::get('/gallery', [GalleryManagementController::class, 'index']);
            Route::post('/gallery/albums', [GalleryManagementController::class, 'storeAlbum']);
            Route::post('/gallery/photos', [GalleryManagementController::class, 'storePhoto']);
            Route::put('/gallery/photos/{id}', [GalleryManagementController::class, 'updatePhoto']);
            Route::delete('/gallery/photos/{id}', [GalleryManagementController::class, 'destroyPhoto']);
            Route::post('/gallery/videos', [GalleryManagementController::class, 'storeVideo']);
            Route::put('/gallery/videos/{id}', [GalleryManagementController::class, 'updateVideo']);
            Route::delete('/gallery/videos/{id}', [GalleryManagementController::class, 'destroyVideo']);
            Route::apiResource('downloads', DownloadManagementController::class);
            Route::apiResource('download-categories', AdminDownloadCategoryController::class);
            Route::post('/whatsapp/blast', [ContactController::class, 'blastWhatsApp']);
            Route::apiResource('contacts', ContactManagementController::class);
            Route::post('/contacts/{id}/mark-read', [ContactManagementController::class, 'markAsRead']);
            Route::post('/contacts/{id}/mark-unread', [ContactManagementController::class, 'markAsUnread']);
            Route::post('/contacts/bulk-mark-read', [ContactManagementController::class, 'bulkMarkAsRead']);
            Route::post('/contacts/bulk-delete', [ContactManagementController::class, 'bulkDelete']);
            Route::apiResource('contact-information', AdminContactInformationController::class);
            Route::apiResource('maps', AdminMapController::class);
            Route::apiResource('psb-requirements', PsbRequirementController::class);
            Route::apiResource('psb-costs', PsbCostController::class);
            Route::apiResource('psb-additional-requirements', PsbAdditionalRequirementController::class);
            Route::apiResource('psb-faqs', PsbFaqController::class);
            Route::get('psb-header', [AdminPsbHeaderController::class, 'show']);
            Route::put('psb-header', [AdminPsbHeaderController::class, 'update']);
        });
    });
});

