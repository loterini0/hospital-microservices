<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'     => 'Admin',
            'email'    => 'admin@hospital.com',
            'password' => 'password123',
            'role'     => 'admin',
            'question' => '¿Nombre de tu mascota?',
            'answer'   => 'Firulais',
        ]);

        User::create([
            'name'     => 'Doctor Juan',
            'email'    => 'doctor@hospital.com',
            'password' => 'password123',
            'role'     => 'doctor',
            'question' => '¿Ciudad de nacimiento?',
            'answer'   => 'Manizales',
        ]);

        User::create([
            'name'     => 'Paciente Maria',
            'email'    => 'paciente@hospital.com',
            'password' => 'password123',
            'role'     => 'patient',
            'question' => '¿Color favorito?',
            'answer'   => 'Azul',
        ]);
    }
}