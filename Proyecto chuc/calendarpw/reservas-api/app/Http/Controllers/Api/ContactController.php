<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        return Contact::where('user_id', $request->user()->id)
            ->orderBy('name')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'  => ['required', 'string', 'max:120'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $contact = $request->user()->contacts()->create($data);

        return response()->json($contact, 201);
    }

    public function update(Request $request, $id)
    {
        $contact = Contact::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $data = $request->validate([
            'name'  => ['sometimes', 'required', 'string', 'max:120'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $contact->update($data);

        return response()->json($contact);
    }

    public function destroy(Request $request, $id)
    {
        $contact = Contact::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $contact->delete();

        return response()->json(['message' => 'Contacto eliminado']);
    }
}