<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Space extends Model
{
    protected $fillable = ['name','description','active'];
    
public function reservations()
{
    return $this->hasMany(Reservation::class);
}
    //
}
