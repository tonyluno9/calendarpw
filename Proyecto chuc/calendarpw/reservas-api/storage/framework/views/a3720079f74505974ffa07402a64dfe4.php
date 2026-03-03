<!doctype html>
<html lang="es">
<body>
  <h2>Confirmación de evento</h2>
  <p><strong>Título:</strong> <?php echo e($r->title); ?></p>
  <p><strong>Categoría:</strong> <?php echo e($r->space->name ?? '-'); ?></p>
  <p><strong>Inicio:</strong> <?php echo e($r->start_time); ?></p>
  <p><strong>Fin:</strong> <?php echo e($r->end_time); ?></p>
</body>
</html><?php /**PATH /home/angpe_3ownhvs/reservas-project/Proyecto chuc/calendarpw/reservas-api/resources/views/emails/reservation_confirmed.blade.php ENDPATH**/ ?>