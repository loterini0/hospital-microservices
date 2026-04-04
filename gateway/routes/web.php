<?php
use Illuminate\Support\Facades\Route;

Route::get('/login', function () {
    return response()->json(['message' => 'Authentication required. Please login at /api/auth/login'], 401);
})->name('login');