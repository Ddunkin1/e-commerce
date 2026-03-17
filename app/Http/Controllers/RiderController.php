<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class RiderController extends Controller
{
    private function guard(Request $request)
    {
        if (!$request->user()->is_rider) {
            abort(403, 'Forbidden');
        }
    }

    public function myOrders(Request $request)
    {
        $this->guard($request);
        $orders = Order::with('user', 'items.product', 'payment')
            ->where('rider_id', $request->user()->id)
            ->whereNotIn('delivery_status', ['delivered'])
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function history(Request $request)
    {
        $this->guard($request);
        $orders = Order::with('user', 'items.product', 'payment')
            ->where('rider_id', $request->user()->id)
            ->where('delivery_status', 'delivered')
            ->latest()
            ->limit(20)
            ->get();

        return response()->json($orders);
    }

    public function updateDeliveryStatus(Request $request, Order $order)
    {
        $this->guard($request);

        if ($order->rider_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'delivery_status' => 'required|in:picked_up,delivered',
        ]);

        $data = ['delivery_status' => $request->delivery_status];
        if ($request->delivery_status === 'delivered') {
            $data['status'] = 'completed';
        }

        $order->update($data);
        return response()->json($order->load('user', 'items.product', 'payment'));
    }
}
