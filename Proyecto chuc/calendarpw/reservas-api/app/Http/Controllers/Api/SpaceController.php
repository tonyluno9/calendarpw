<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Space;
use Illuminate\Http\Request;

class SpaceController extends Controller
{
    public function index()
    {
        return Space::orderBy('name')->get();
    }

    // Crear (ADMIN)
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:1000'],
            'capacity' => ['required', 'integer', 'min:1', 'max:500'],
            'available_from' => ['required', 'date_format:H:i'],
            'available_to' => ['required', 'date_format:H:i', 'after:available_from'],
        ]);

        $space = Space::create($data);
        return response()->json($space, 201);
    }

    public function update(Request $request, $id)
    {
        $space = Space::findOrFail($id);

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:1000'],
            'capacity' => ['sometimes', 'required', 'integer', 'min:1', 'max:500'],
            'available_from' => ['sometimes', 'required', 'date_format:H:i'],
            'available_to' => ['sometimes', 'required', 'date_format:H:i'],
        ]);

        if (isset($data['available_from']) && isset($data['available_to'])) {
            if ($data['available_to'] <= $data['available_from']) {
                return response()->json([
                    'message' => 'available_to debe ser posterior a available_from'
                ], 422);
            }
        }

        $space->update($data);
        return response()->json($space);
    }

    public function destroy($id)
    {
        $space = Space::findOrFail($id);
        $space->delete();

        return response()->json(['message' => 'Space eliminado']);
    }
}