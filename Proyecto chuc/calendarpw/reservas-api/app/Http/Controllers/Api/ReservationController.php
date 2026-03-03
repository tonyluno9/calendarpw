<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Space;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservationConfirmed;

class ReservationController extends Controller
{
    /**
     * Listar reservas del usuario logueado
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $start = $request->query('start');
        $end   = $request->query('end');

        $query = Reservation::with('space')
            ->where('user_id', $user->id);

        if ($start && $end) {
            $query->where('start_time', '<', $end)
                  ->where('end_time', '>', $start);
        }

        return response()->json(
            $query->get()->map(function ($r) {
                return [
                    'id' => $r->id,
                    'title' => $r->title ?? ($r->space->name ?? 'Clase'),
                    'start' => $r->start_time,
                    'end' => $r->end_time,
                    'space_name' => $r->space->name ?? '',
                    'space_id' => $r->space_id,
                ];
            })
        );
    }

    /**
     * Crear reserva
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'space_id'   => ['required', 'exists:spaces,id'],
            'title'      => ['required', 'string', 'max:255'],
            'start_time' => ['required', 'date'],
            'end_time'   => ['required', 'date', 'after:start_time'],
        ]);

        $start = Carbon::parse($data['start_time']);
        $end   = Carbon::parse($data['end_time']);

        $space = Space::findOrFail($data['space_id']);

        /*
        =====================================================
        1) Validar disponibilidad horaria del espacio
        =====================================================
        */
        if ($start->format('H:i:s') < $space->available_from ||
            $end->format('H:i:s') > $space->available_to) {

            return response()->json([
                'message' => 'El espacio no está disponible en ese horario.'
            ], 422);
        }

        /*
        =====================================================
        2) Validar traslape del mismo usuario
        =====================================================
        */
        $hasOverlap = Reservation::where('user_id', $user->id)
            ->where('start_time', '<', $end)
            ->where('end_time', '>', $start)
            ->exists();

        if ($hasOverlap) {
            return response()->json([
                'message' => 'Traslape detectado: ya tienes una actividad en ese horario.'
            ], 422);
        }

        /*
        =====================================================
        3) Validar CAPACIDAD del espacio
        =====================================================
        */
        $currentReservations = Reservation::where('space_id', $space->id)
            ->where('start_time', '<', $end)
            ->where('end_time', '>', $start)
            ->count();

        if ($currentReservations >= $space->capacity) {
            return response()->json([
                'message' => 'Capacidad máxima alcanzada para este espacio.'
            ], 422);
        }

        $reserva = $user->reservas()->create([
            'space_id'   => $data['space_id'],
            'title'      => $data['title'],
            'start_time' => $start,
            'end_time'   => $end,
        ]);
        Mail::to($user->email)->send(new ReservationConfirmed($reserva));
        $request->user()->notifications()->create([
        'type' => 'info',
        'title' => 'Nuevo evento creado',
        'body' => ($reserva->title ?? 'Evento') . ' (' . $reserva->start_time . ')',

]);

        return response()->json($reserva, 201);
    }

    /**
     * Actualizar reserva (solo hasta 1 día antes)
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        $reserva = Reservation::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $startTime = Carbon::parse($reserva->start_time);

        /*
        =====================================================
        4) Regla 1 día antes
        =====================================================
        */
        if (Carbon::now()->greaterThan($startTime->subDay())) {
            return response()->json([
                'message' => 'Solo puedes modificar la reserva hasta 1 día antes.'
            ], 422);
        }

        $data = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
        ]);

        $reserva->update($data);

        return response()->json($reserva);
    }

    public function destroy(Request $request, $id)
{
    $user = $request->user();

    $reserva = Reservation::where('id', $id)
        ->where('user_id', $user->id)
        ->firstOrFail();

    $reserva->delete();

    return response()->json(['message' => 'Reserva eliminada correctamente']);
}
    
}