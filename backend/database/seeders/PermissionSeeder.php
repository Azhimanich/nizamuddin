<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // User Management
            'manage_users',
            'view_users',
            'create_users',
            'edit_users',
            'delete_users',

            // Role & Permission Management
            'manage_roles',
            'view_roles',
            'create_roles',
            'edit_roles',
            'delete_roles',
            'manage_permissions',
            'view_permissions',
            'create_permissions',
            'delete_permissions',

            // Dashboard & System
            'view_dashboard',
            'view_statistics',
            'view_logs',
            'manage_settings',

            // News Management
            'manage_news',
            'view_news',
            'create_news',
            'edit_news',
            'delete_news',

            // Agenda Management
            'manage_agenda',
            'view_agenda',
            'create_agenda',
            'edit_agenda',
            'delete_agenda',

            // Gallery Management
            'manage_gallery',
            'view_gallery',
            'create_gallery',
            'edit_gallery',
            'delete_gallery',

            // Profile Management
            'manage_profiles',
            'view_profiles',
            'edit_profiles',

            // Slider Management
            'manage_sliders',
            'view_sliders',
            'create_sliders',
            'edit_sliders',
            'delete_sliders',

            // Social Media Management
            'manage_social_media',
            'view_social_media',
            'edit_social_media',

            // Staff Management
            'manage_staff',
            'view_staff',
            'create_staff',
            'edit_staff',
            'delete_staff',

            // Academic Management
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

            // Contact Management
            'manage_contacts',
            'view_contacts',
            'manage_contact_information',
            'view_contact_information',

            // PSB Management
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

            // Downloads Management
            'manage_downloads',
            'view_downloads',
            'create_downloads',
            'edit_downloads',
            'delete_downloads',

            // WhatsApp Management
            'manage_whatsapp',
            'view_whatsapp',

            // Map Management
            'manage_maps',
            'view_maps',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web'
            ]);
        }

        $this->command->info('Permissions seeded successfully!');
    }
}
