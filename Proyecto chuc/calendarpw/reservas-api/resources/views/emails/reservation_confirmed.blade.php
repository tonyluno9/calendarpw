<!doctype html>
<html lang="es">
<body>
  <h2>Confirmación de evento</h2>
  <p><strong>Título:</strong> {{ $r->title }}</p>
  <p><strong>Categoría:</strong> {{ $r->space->name ?? '-' }}</p>
  <p><strong>Inicio:</strong> {{ $r->start_time }}</p>
  <p><strong>Fin:</strong> {{ $r->end_time }}</p>
</body>
</html>