<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        // Trae solo el horario del usuario logueado
        return $request->user()->schedules;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'subject' => 'required|string',
            'day' => 'required|string',
            'start_time' => 'required',
            'end_time' => 'required',
            'classroom' => 'nullable|string',
        ]);

        $schedule = $request->user()->schedules()->create($data);

        return response()->json($schedule, 201);
    }
}