<!doctype html>
<html lang="es">
<body>
  <h2>Recordatorio (24 horas antes)</h2>
  <p>Mañana tienes este evento:</p>
  <p><strong>Título:</strong> <?php echo e($r->title); ?></p>
  <p><strong>Categoría:</strong> <?php echo e($r->space->name ?? '-'); ?></p>
  <p><strong>Inicio:</strong> <?php echo e($r->start_time); ?></p>
</body>
</html><?php /**PATH /home/angpe_3ownhvs/reservas-project/Proyecto chuc/calendarpw/reservas-api/resources/views/emails/reservation_reminder.blade.php ENDPATH**/ ?>