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
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return response()->json($order->load('items.product', 'payment', 'rider'));
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

        foreach ($cart->items as $item) {
            if (!$item->product) {
                return response()->json(['message' => 'A product in your cart no longer exists.'], 422);
            }
            if ($item->quantity > $item->product->stock) {
                return response()->json([
                    'message' => "Not enough stock for \"{$item->product->name}\". Only {$item->product->stock} left."
                ], 422);
            }
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
            $item->product->decrement('stock', $item->quantity);
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

    public function cancel(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Only pending orders can be cancelled.'], 422);
        }

        foreach ($order->items as $item) {
            if ($item->product) {
                $item->product->increment('stock', $item->quantity);
            }
        }

        $order->update(['status' => 'cancelled']);

        if ($order->payment) {
            $order->payment->update(['status' => 'cancelled']);
        }

        return response()->json($order->load('items.product', 'payment'));
    }
}
