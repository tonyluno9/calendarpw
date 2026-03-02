<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = [
        'user_id',
        'subject',
        'day',
        'start_time',
        'end_time',
        'classroom'
    ];

    // Relación con el usuario (Alessandro o cualquier alumno)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}