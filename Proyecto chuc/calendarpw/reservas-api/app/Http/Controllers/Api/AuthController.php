<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
   public function login(Request $request)
{
    $credentials = $request->only('email', 'password');

    // Intenta autenticar
    if (!Auth::attempt($credentials)) {
        return response()->json([
            'message' => 'Credenciales incorrectas'
        ], 401);
    }

    // Busca al usuario manualmente para asegurar que el modelo está cargado
    $user = \App\Models\User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json([
            'message' => 'Usuario no encontrado después de Auth'
        ], 500);
    }

    // Intenta crear el token
    try {
        $token = $user->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    } catch (\Exception $e) {
        // Si esto falla, el error 500 es por falta de la tabla o configuración de Sanctum
        return response()->json([
            'message' => 'Error al crear el token: ' . $e->getMessage()
        ], 500);
    }
}

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'ok',
        ]);
    }
    
}