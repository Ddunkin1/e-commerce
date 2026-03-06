<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_products' => Product::count(),
            'total_orders'   => Order::count(),
            'total_users'    => User::count(),
            'total_revenue'  => Order::where('status', '!=', 'cancelled')->sum('total_amount'),
            'pending_orders' => Order::where('status', 'pending')->count(),
        ]);
    }

    public function orders()
    {
        $orders = Order::with('user', 'items.product', 'payment')->latest()->get();
        return response()->json($orders);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate(['status' => 'required|in:pending,processing,completed,cancelled']);
        $order->update(['status' => $request->status]);
        return response()->json($order->load('user', 'items.product', 'payment'));
    }
}
