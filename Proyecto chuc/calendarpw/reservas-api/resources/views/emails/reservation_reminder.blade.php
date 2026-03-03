<!doctype html>
<html lang="es">
<body>
  <h2>Recordatorio (24 horas antes)</h2>
  <p>Mañana tienes este evento:</p>
  <p><strong>Título:</strong> {{ $r->title }}</p>
  <p><strong>Categoría:</strong> {{ $r->space->name ?? '-' }}</p>
  <p><strong>Inicio:</strong> {{ $r->start_time }}</p>
</body>
</html>