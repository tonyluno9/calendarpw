<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\SpaceController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\NotificationController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);

    // ===== Usuario normal =====
    Route::get('/reservas', [ReservationController::class, 'index']);
    Route::post('/reservas', [ReservationController::class, 'store']);
    Route::delete('/reservas/{id}', [ReservationController::class, 'destroy']);
    Route::put('/reservas/{id}', [ReservationController::class, 'update']);

    Route::get('/spaces', [SpaceController::class, 'index']);

    Route::get('/schedules', [ScheduleController::class, 'index']);
    Route::post('/schedules', [ScheduleController::class, 'store']);

    // ===== Admin =====
    Route::middleware('auth:sanctum')->group(function () {

    // Usuario normal
    Route::get('/reservas', [ReservationController::class, 'index']);
    Route::post('/reservas', [ReservationController::class, 'store']);
    Route::delete('/reservas/{id}', [ReservationController::class, 'destroy']);

    Route::get('/spaces', [SpaceController::class, 'index']);

    Route::get('/schedules', [ScheduleController::class, 'index']);
    Route::post('/schedules', [ScheduleController::class, 'store']);

    // ADMIN
    Route::middleware('is_admin')->prefix('admin')->group(function () {
        Route::post('/spaces', [SpaceController::class, 'store']);
        Route::put('/spaces/{id}', [SpaceController::class, 'update']);
        Route::delete('/spaces/{id}', [SpaceController::class, 'destroy']);
        Route::get('/contacts', [ContactController::class, 'index']);
        Route::post('/contacts', [ContactController::class, 'store']);
        Route::put('/contacts/{id}', [ContactController::class, 'update']);
        Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);
    });
});
});