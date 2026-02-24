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

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'description' => ['nullable','string'],
            'active' => ['boolean'],
        ]);

        return Space::create($data);
    }

    public function update(Request $request, Space $space)
    {
        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'description' => ['nullable','string'],
            'active' => ['boolean'],
        ]);

        $space->update($data);
        return $space;
    }

    public function destroy(Space $space)
    {
        $space->delete();
        return response()->json(['message' => 'ok']);
    }
}