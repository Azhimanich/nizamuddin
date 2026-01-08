<?php

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class CreateAdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Create super admin role if not exists
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        
        // Create or update admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@pesantren.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
            ]
        );
        
        // Assign role
        $admin->assignRole($superAdminRole);
        
        $this->command->info('Admin user created successfully!');
        $this->command->info('Email: admin@pesantren.com');
        $this->command->info('Password: password');
    }
}
