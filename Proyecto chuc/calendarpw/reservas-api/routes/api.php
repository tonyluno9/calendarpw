<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\SpaceController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\InvitationController;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::post('/reservas/{id}/invite', [InvitationController::class, 'invite']);
Route::get('/invitations', [InvitationController::class, 'index']);
Route::post('/invitations/{id}/accept', [InvitationController::class, 'accept']);
Route::post('/invitations/{id}/decline', [InvitationController::class, 'decline']);

    // CATEGORÍAS (Spaces) - cualquier usuario
    Route::get('/spaces', [SpaceController::class, 'index']);
    Route::post('/spaces', [SpaceController::class, 'store']);
    Route::put('/spaces/{id}', [SpaceController::class, 'update']);
    Route::delete('/spaces/{id}', [SpaceController::class, 'destroy']);

    // Reservas
    Route::get('/reservas', [ReservationController::class, 'index']);
    Route::post('/reservas', [ReservationController::class, 'store']);
    Route::put('/reservas/{id}', [ReservationController::class, 'update']);
    Route::delete('/reservas/{id}', [ReservationController::class, 'destroy']);

    // Schedules
    Route::get('/schedules', [ScheduleController::class, 'index']);
    Route::post('/schedules', [ScheduleController::class, 'store']);

    // Notificaciones
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);

    // Contactos - cualquier usuario
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::post('/contacts', [ContactController::class, 'store']);
    Route::put('/contacts/{id}', [ContactController::class, 'update']);
    Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);
});