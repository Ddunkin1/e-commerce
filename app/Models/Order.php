<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['user_id', 'rider_id', 'total_amount', 'status', 'delivery_status', 'shipping_address'];

    public function user() { return $this->belongsTo(User::class); }
    public function rider() { return $this->belongsTo(User::class, 'rider_id'); }
    public function items() { return $this->hasMany(OrderItem::class); }
    public function payment() { return $this->hasOne(Payment::class); }
}
