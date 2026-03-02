<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       
{
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('name'); // Nombre del usuario
        $table->string('email')->unique(); // Correo único para entrar
        $table->string('password'); // Contraseña encriptada
        $table->rememberToken();
        $table->timestamps();
    });
}
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
