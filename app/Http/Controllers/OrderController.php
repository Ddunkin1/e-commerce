<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with('items.product', 'payment')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function show(Request $request, Order $order)
    {
        return response()->json($order->load('items.product', 'payment'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string',
            'payment_method'   => 'required|in:cash,gcash,card',
        ]);

        $cart = Cart::where('user_id', $request->user()->id)->with('items.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        $total = $cart->items->sum(fn($item) => $item->product->price * $item->quantity);

        $order = Order::create([
            'user_id'          => $request->user()->id,
            'total_amount'     => $total,
            'status'           => 'pending',
            'shipping_address' => $request->shipping_address,
        ]);

        foreach ($cart->items as $item) {
            OrderItem::create([
                'order_id'   => $order->id,
                'product_id' => $item->product_id,
                'quantity'   => $item->quantity,
                'price'      => $item->product->price,
            ]);
        }

        Payment::create([
            'order_id' => $order->id,
            'amount'   => $total,
            'method'   => $request->payment_method,
            'status'   => 'pending',
        ]);

        $cart->items()->delete();

        return response()->json($order->load('items.product', 'payment'), 201);
    }
}
