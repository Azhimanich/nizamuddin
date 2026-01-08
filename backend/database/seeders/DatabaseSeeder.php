<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Language;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            LanguageSeeder::class,
            PermissionSeeder::class,
            RolePermissionSeeder::class,
        ]);

        // Create roles
        $superAdmin = Role::create(['name' => 'super_admin', 'guard_name' => 'sanctum']);
        $adminAkademik = Role::create(['name' => 'admin_akademik', 'guard_name' => 'sanctum']);
        $adminHumas = Role::create(['name' => 'admin_humas', 'guard_name' => 'sanctum']);

        // Create default users
        $user1 = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@pesantren.com',
            'password' => Hash::make('password'),
        ]);
        $user1->assignRole($superAdmin);

        $user2 = User::create([
            'name' => 'Admin Akademik',
            'email' => 'akademik@pesantren.com',
            'password' => Hash::make('password'),
        ]);
        $user2->assignRole($adminAkademik);

        $user3 = User::create([
            'name' => 'Admin Humas',
            'email' => 'humas@pesantren.com',
            'password' => Hash::make('password'),
        ]);
        $user3->assignRole($adminHumas);
        $this->call(\Database\Seeders\SocialMediaSeeder::class);
        $this->call(\Database\Seeders\SliderSeeder::class);
        $this->call(\Database\Seeders\ProfileSeeder::class);
        $this->call(\Database\Seeders\OrganizationStructureSeeder::class);
        $this->call(\Database\Seeders\AcademicCalendarSeeder::class);
        $this->call(\Database\Seeders\NewsSeeder::class);
        $this->call(\Database\Seeders\ContactInformationSeeder::class);
        $this->call(\Database\Seeders\MapSeeder::class);
        $this->call(\Database\Seeders\PsbLandingPageSeeder::class);
        $this->call(\Database\Seeders\PsbRegistrationSeeder::class);
        $this->call(\Database\Seeders\PsbRequirementSeeder::class);
        $this->call(\Database\Seeders\DownloadSeeder::class);
        $this->call(\Database\Seeders\ContactSeeder::class);
        $this->call(\Database\Seeders\StaffSeeder::class);
        $this->call(\Database\Seeders\AgendaSeeder::class);
        $this->call(\Database\Seeders\ProgramSeeder::class);
        $this->call(\Database\Seeders\GallerySeeder::class);
    }
}

