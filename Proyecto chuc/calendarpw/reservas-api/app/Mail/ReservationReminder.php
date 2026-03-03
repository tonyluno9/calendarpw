<?php

namespace App\Mail;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReservationReminder extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Reservation $reservation) {}

    public function build()
    {
        $r = $this->reservation->load('space', 'user');

        return $this->subject('Recordatorio (24h): ' . ($r->title ?? 'Evento'))
            ->view('emails.reservation_reminder', ['r' => $r]);
    }
}