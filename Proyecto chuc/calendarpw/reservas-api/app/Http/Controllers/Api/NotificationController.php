<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // Listar notificaciones del usuario (por default solo no leídas)
    public function index(Request $request)
    {
        $onlyUnread = $request->query('unread', '1') === '1';

        $q = Notification::where('user_id', $request->user()->id)
            ->orderByDesc('created_at');

        if ($onlyUnread) $q->whereNull('read_at');

        return $q->get();
    }

    // Marcar como leída
    public function markRead(Request $request, $id)
    {
        $n = Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $n->update(['read_at' => now()]);

        return response()->json(['message' => 'ok']);
    }

    // Contador (badge)
    public function unreadCount(Request $request)
    {
        $count = Notification::where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->count();

        return response()->json(['count' => $count]);
    }
}