<?php 
use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Schedule;
use App\Jobs\SendReservationReminders;

Schedule::job(new SendReservationReminders)->everyFiveMinutes();