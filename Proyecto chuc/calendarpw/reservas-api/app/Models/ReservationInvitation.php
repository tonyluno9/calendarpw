<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReservationInvitation extends Model
{
    protected $fillable = [
        'reservation_id',
        'inviter_user_id',
        'invitee_email',
        'token',
        'status',
        'responded_at',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function inviter()
    {
        return $this->belongsTo(User::class, 'inviter_user_id');
    }
}