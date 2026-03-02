<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\SpaceController;
use App\Http\Controllers\Api\ScheduleController;

// Esta es la única ruta pública
Route::post('/login', [AuthController::class, 'login']);

// TODO lo demás debe ir aquí adentro para que Laravel sepa que eres Alessandro
Route::middleware('auth:sanctum')->group(function () {
    // Rutas de Reservas (Agenda)
    Route::get('/reservas', [ReservationController::class, 'index']);
    Route::post('/reservas', [ReservationController::class, 'store']);
    Route::delete('/reservas/{id}', [ReservationController::class, 'destroy']);

    // Rutas de Categorías (Spaces)
    Route::get('/spaces', [SpaceController::class, 'index']);

    // Rutas de Horarios
    Route::get('/schedules', [ScheduleController::class, 'index']);
    Route::post('/schedules', [ScheduleController::class, 'store']);
});