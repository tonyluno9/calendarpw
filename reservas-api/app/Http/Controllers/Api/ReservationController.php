<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        // opcional: filtrar por rango si mandas start/end desde frontend
        return Reservation::with(['space','user'])
            ->orderBy('start_time')
            ->get()
            ->map(function ($r) {
                return [
                    'id' => $r->id,
                    'space_id' => $r->space_id,
                    'space_name' => $r->space->name,
                    'user_name' => $r->user->name,
                    'title' => $r->title ?? $r->space->name,
                    'start_time' => $r->start_time,
                    'end_time' => $r->end_time,
                ];
            });
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'space_id' => ['required','exists:spaces,id'],
            'start_time' => ['required','date'],
            'end_time' => ['required','date','after:start_time'],
            'title' => ['nullable','string','max:255'],
        ]);

        // Validación de traslape:
        // existe conflicto si: start < existing_end AND end > existing_start
        $conflict = Reservation::where('space_id', $data['space_id'])
            ->where(function ($q) use ($data) {
                $q->where('start_time', '<', $data['end_time'])
                  ->where('end_time',   '>', $data['start_time']);
            })
            ->exists();

        if ($conflict) {
            return response()->json(['message' => 'Conflicto: horario ya reservado'], 409);
        }

        $data['user_id'] = $request->user()->id;

        return Reservation::create($data);
    }

    public function destroy(Reservation $reservation)
    {
        // opcional: solo admin o dueño
        $user = request()->user();
        if (($user->role ?? 'user') !== 'admin' && $reservation->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $reservation->delete();
        return response()->json(['message' => 'ok']);
    }
}