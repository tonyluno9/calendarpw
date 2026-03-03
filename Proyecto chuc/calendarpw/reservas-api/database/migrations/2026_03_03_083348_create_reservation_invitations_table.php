<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('reservation_invitations', function (Blueprint $table) {
        $table->id();

        $table->foreignId('reservation_id')->constrained()->cascadeOnDelete();
        $table->foreignId('inviter_user_id')->constrained('users')->cascadeOnDelete();

        $table->string('invitee_email');
        $table->string('token', 64)->unique();

        $table->enum('status', ['pending','accepted','declined'])->default('pending');
        $table->timestamp('responded_at')->nullable();

        $table->timestamps();

        $table->index(['invitee_email', 'status']);
    });
}
    public function down(): void
{
    Schema::dropIfExists('reservation_invitations');
}
};
