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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            // Relación con el usuario (Alessandro u otros alumnos)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Datos de la clase
            $table->string('subject');     // Ejemplo: Programación, Cálculo
            $table->string('day');         // Lunes, Martes, etc.
            $table->time('start_time');    // Ejemplo: 07:00:00
            $table->time('end_time');      // Ejemplo: 09:00:00
            $table->string('classroom')->nullable(); // Opcional: Salón en la UAC
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};