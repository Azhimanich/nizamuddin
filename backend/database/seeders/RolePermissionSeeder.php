<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $adminAkademik = Role::firstOrCreate(['name' => 'admin_akademik', 'guard_name' => 'web']);
        $adminHumas = Role::firstOrCreate(['name' => 'admin_humas', 'guard_name' => 'web']);

        // Get all permissions
        $allPermissions = Permission::pluck('name');

        // Super Admin gets all permissions
        $superAdmin->givePermissionTo($allPermissions);

        // Admin Akademik permissions
        $adminAkademikPermissions = [
            'view_dashboard',
            'manage_staff',
            'view_staff',
            'create_staff',
            'edit_staff',
            'delete_staff',
            'manage_academic',
            'view_academic',
            'manage_calendar',
            'view_calendar',
            'manage_daily_schedules',
            'view_daily_schedules',
            'manage_organization_structure',
            'view_organization_structure',
            'manage_specialization_categories',
            'view_specialization_categories',
            'create_specialization_categories',
            'edit_specialization_categories',
            'delete_specialization_categories',
        ];
        $adminAkademik->givePermissionTo($adminAkademikPermissions);

        // Admin Humas permissions
        $adminHumasPermissions = [
            'view_dashboard',
            'manage_sliders',
            'view_sliders',
            'create_sliders',
            'edit_sliders',
            'delete_sliders',
            'manage_social_media',
            'view_social_media',
            'edit_social_media',
            'manage_profiles',
            'view_profiles',
            'edit_profiles',
            'manage_news',
            'view_news',
            'create_news',
            'edit_news',
            'delete_news',
            'manage_agenda',
            'view_agenda',
            'create_agenda',
            'edit_agenda',
            'delete_agenda',
            'manage_gallery',
            'view_gallery',
            'create_gallery',
            'edit_gallery',
            'delete_gallery',
            'manage_contacts',
            'view_contacts',
            'manage_contact_information',
            'view_contact_information',
            'manage_downloads',
            'view_downloads',
            'create_downloads',
            'edit_downloads',
            'delete_downloads',
            'manage_whatsapp',
            'view_whatsapp',
            'manage_maps',
            'view_maps',
            'manage_psb_registrations',
            'view_psb_registrations',
            'edit_psb_registrations',
            'delete_psb_registrations',
            'manage_psb_requirements',
            'view_psb_requirements',
            'manage_psb_costs',
            'view_psb_costs',
            'manage_psb_additional_requirements',
            'view_psb_additional_requirements',
            'manage_psb_faqs',
            'view_psb_faqs',
            'manage_psb_header',
            'view_psb_header',
        ];
        $adminHumas->givePermissionTo($adminHumasPermissions);

        $this->command->info('Role permissions seeded successfully!');
        $this->command->info('Super Admin: ' . count($allPermissions) . ' permissions');
        $this->command->info('Admin Akademik: ' . count($adminAkademikPermissions) . ' permissions');
        $this->command->info('Admin Humas: ' . count($adminHumasPermissions) . ' permissions');
    }
}
