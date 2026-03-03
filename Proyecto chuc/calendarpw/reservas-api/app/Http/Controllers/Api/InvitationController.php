<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\ReservationInvitation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class InvitationController extends Controller
{
    // Invitaciones recibidas por el usuario logeado (por email del user)
    public function index(Request $request)
    {
        $user = $request->user();

        $invs = ReservationInvitation::with(['reservation.space', 'inviter'])
            ->where('invitee_email', $user->email)
            ->orderByDesc('id')
            ->get()
            ->map(function ($inv) {
                $r = $inv->reservation;

                return [
                    'id' => $inv->id,
                    'status' => $inv->status,
                    'created_at' => $inv->created_at,
                    'responded_at' => $inv->responded_at,
                    'inviter_name' => $inv->inviter?->name,
                    'inviter_email' => $inv->inviter?->email,
                    'reservation' => $r ? [
                        'id' => $r->id,
                        'title' => $r->title,
                        'start_time' => $r->start_time,
                        'end_time' => $r->end_time,
                        'space_id' => $r->space_id,
                        'space_name' => $r->space?->name,
                    ] : null,
                ];
            });

        return response()->json($invs);
    }

    // Crear invitación (solo si el email pertenece a un usuario registrado)
    public function invite(Request $request, $reservationId)
    {
        $user = $request->user();

        $data = $request->validate([
            'invitee_email' => ['required', 'email', 'max:255'],
        ]);

        $reserva = Reservation::where('id', $reservationId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $invitee = User::where('email', $data['invitee_email'])->first();

        if (!$invitee) {
            return response()->json([
                'message' => 'Ese correo no pertenece a un usuario registrado.'
            ], 422);
        }

        if ($invitee->id === $user->id) {
            return response()->json([
                'message' => 'No puedes invitarte a ti mismo.'
            ], 422);
        }

        $exists = ReservationInvitation::where('reservation_id', $reserva->id)
            ->where('invitee_email', $invitee->email)
            ->where('status', 'pending')
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Ya existe una invitación pendiente para ese usuario.'
            ], 422);
        }

        $inv = ReservationInvitation::create([
            'reservation_id' => $reserva->id,
            'inviter_user_id' => $user->id,
            'invitee_email' => $invitee->email,
            'token' => Str::random(64),
            'status' => 'pending',
        ]);

        // Notificación in-app al invitado
        $invitee->notifications()->create([
            'type' => 'invite',
            'title' => 'Nueva invitación',
            'body' => "{$user->name} te invitó a: " . ($reserva->title ?? 'Evento'),
        ]);

        return response()->json([
            'message' => 'Invitación enviada',
            'invitation' => $inv,
        ], 201);
    }

    // Aceptar => clona la reserva al calendario del invitado
    public function accept(Request $request, $id)
    {
        $user = $request->user();

        $inv = ReservationInvitation::with('reservation')
            ->where('id', $id)
            ->where('invitee_email', $user->email)
            ->firstOrFail();

        if ($inv->status !== 'pending') {
            return response()->json(['message' => 'Esta invitación ya fue respondida.'], 422);
        }

        $r = $inv->reservation;
        if (!$r) return response()->json(['message' => 'La reserva ya no existe.'], 404);

        // Clonar (nota: aquí NO revalidamos traslape/capacidad; si quieres, lo metemos)
        $clone = $user->reservas()->create([
            'space_id' => $r->space_id,
            'title' => $r->title,
            'start_time' => $r->start_time,
            'end_time' => $r->end_time,
        ]);

        $inv->update([
            'status' => 'accepted',
            'responded_at' => Carbon::now(),
        ]);

        $inviter = User::find($inv->inviter_user_id);
        if ($inviter) {
            $inviter->notifications()->create([
                'type' => 'invite',
                'title' => 'Invitación aceptada',
                'body' => "{$user->name} aceptó tu invitación: " . ($r->title ?? 'Evento'),
            ]);
        }

        return response()->json(['message' => 'Invitación aceptada', 'reservation' => $clone]);
    }

    public function decline(Request $request, $id)
    {
        $user = $request->user();

        $inv = ReservationInvitation::with('reservation')
            ->where('id', $id)
            ->where('invitee_email', $user->email)
            ->firstOrFail();

        if ($inv->status !== 'pending') {
            return response()->json(['message' => 'Esta invitación ya fue respondida.'], 422);
        }

        $inv->update([
            'status' => 'declined',
            'responded_at' => Carbon::now(),
        ]);

        $inviter = User::find($inv->inviter_user_id);
        if ($inviter) {
            $inviter->notifications()->create([
                'type' => 'invite',
                'title' => 'Invitación rechazada',
                'body' => "{$user->name} rechazó tu invitación.",
            ]);
        }

        return response()->json(['message' => 'Invitación rechazada']);
    }
}