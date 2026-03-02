<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Obtener reservas filtradas por rango de fechas para FullCalendar.
     */
    public function index(Request $request)
    {
        $start = $request->query('start');
        $end = $request->query('end');

        $query = Reservation::with(['user', 'space']);

        if ($start && $end) {
            $query->whereBetween('start_time', [$start, $end]);
        }

        return response()->json($query->get()->map(function ($r) {
            return [
                'id' => $r->id,
                'title' => $r->title ?? (($r->space->name ?? 'Clase') . " - " . ($r->user->name ?? 'Alessandro')),
                'start' => $r->start_time,
                'end' => $r->end_time,
                'space_name' => $r->space->name ?? '',
                'user_name' => $r->user->name ?? '',
            ];
        }));
    }

    /**
     * EL MOTOR DE GUARDADO: Aquí es donde se registran tus clases de la UAC.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'space_id'   => 'required|exists:spaces,id',
            'title'      => 'required|string|max:255',
            'start_time' => 'required',
            'end_time'   => 'required',
        ]);

        // Vinculamos la reserva a tu usuario logueado.
        $reserva = $request->user()->reservas()->create([
            'space_id'   => $data['space_id'],
            'title'      => $data['title'],
            'start_time' => $data['start_time'],
            'end_time'   => $data['end_time'],
        ]);

        return response()->json($reserva, 201);
    }

    /**
     * Eliminar compromiso de la agenda.
     */
    public function destroy($id)
    {
        $reserva = Reservation::findOrFail($id);
        $reserva->delete();

        return response()->json(['message' => 'Eliminado correctamente']);
    }
}