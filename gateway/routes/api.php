<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserServiceController;
use App\Http\Controllers\AppointmentServiceController;
use App\Http\Controllers\RecordServiceController;
use App\Http\Controllers\NotificationServiceController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register',       [AuthController::class, 'register']);
    Route::post('/login',          [AuthController::class, 'login']);
    Route::post('/logout',         [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('users')->group(function () {
        Route::get('/',        [UserServiceController::class, 'index']);
        Route::get('/{id}',    [UserServiceController::class, 'show']);
        Route::post('/',       [UserServiceController::class, 'store']);
        Route::put('/{id}',    [UserServiceController::class, 'update']);
        Route::delete('/{id}', [UserServiceController::class, 'destroy']);
    });

    Route::prefix('appointments')->group(function () {
        Route::get('/',                        [AppointmentServiceController::class, 'index']);
        Route::get('/{id}',                    [AppointmentServiceController::class, 'show']);
        Route::get('/patient/{patient_id}',    [AppointmentServiceController::class, 'byPatient']);
        Route::post('/',                       [AppointmentServiceController::class, 'store']);
        Route::put('/{id}',                    [AppointmentServiceController::class, 'update']);
        Route::delete('/{id}',                 [AppointmentServiceController::class, 'destroy']);
    });

    Route::prefix('records')->group(function () {
        Route::get('/',                        [RecordServiceController::class, 'index']);
        Route::get('/{id}',                    [RecordServiceController::class, 'show']);
        Route::get('/patient/{patient_id}',    [RecordServiceController::class, 'byPatient']);
        Route::post('/',                       [RecordServiceController::class, 'store']);
        Route::put('/{id}',                    [RecordServiceController::class, 'update']);
        Route::delete('/{id}',                 [RecordServiceController::class, 'destroy']);
    });

    Route::prefix('notifications')->group(function () {
        Route::get('/',                [NotificationServiceController::class, 'index']);
        Route::get('/user/{user_id}',  [NotificationServiceController::class, 'byUser']);
        Route::post('/',               [NotificationServiceController::class, 'store']);
        Route::put('/{id}/read',       [NotificationServiceController::class, 'markAsRead']);
        Route::delete('/{id}',         [NotificationServiceController::class, 'destroy']);
    });

});