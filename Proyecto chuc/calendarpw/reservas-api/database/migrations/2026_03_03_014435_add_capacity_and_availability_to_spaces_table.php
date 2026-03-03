<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('spaces', function (Blueprint $table) {
            if (!Schema::hasColumn('spaces', 'capacity')) {
                $table->unsignedInteger('capacity')->default(1)->after('description');
            }
            if (!Schema::hasColumn('spaces', 'available_from')) {
                $table->time('available_from')->default('07:00:00')->after('capacity');
            }
            if (!Schema::hasColumn('spaces', 'available_to')) {
                $table->time('available_to')->default('22:00:00')->after('available_from');
            }
        });
    }

    public function down(): void
    {
        Schema::table('spaces', function (Blueprint $table) {
            if (Schema::hasColumn('spaces', 'available_to')) $table->dropColumn('available_to');
            if (Schema::hasColumn('spaces', 'available_from')) $table->dropColumn('available_from');
            if (Schema::hasColumn('spaces', 'capacity')) $table->dropColumn('capacity');
        });
    }
};