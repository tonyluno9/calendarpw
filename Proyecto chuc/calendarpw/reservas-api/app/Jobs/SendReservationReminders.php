<?php

namespace App\Jobs;

use App\Mail\ReservationReminder;
use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendReservationReminders implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
{
    $from = Carbon::now()->addDay()->startOfMinute();
$to   = Carbon::now()->addDay()->addMinutes(5)->endOfMinute();

    $reservas = Reservation::with(['user','space'])
        ->whereNull('reminded_at')
        ->where('start_time', '>=', $from->toDateTimeString())
        ->where('start_time', '<=', $to->toDateTimeString())
        ->get();

    foreach ($reservas as $r) {
        Mail::to($r->user->email)->send(new ReservationReminder($r));

        $r->user->notifications()->create([
            'type'  => 'reminder',
            'title' => 'Recordatorio: ' . ($r->title ?? 'Evento'),
            'body'  => 'Inicia pronto: ' . $r->start_time,
        ]);

        $r->update(['reminded_at' => now()]);
    }
}
}