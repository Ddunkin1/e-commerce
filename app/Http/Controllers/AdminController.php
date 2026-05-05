<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    private function guard(Request $request)
    {
        if (!$request->user()->is_admin) {
            abort(403, 'Forbidden');
        }
    }

    public function stats(Request $request)
    {
        $this->guard($request);
        $revenueByMonth = Order::where('status', '!=', 'cancelled')
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(total_amount) as revenue, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $lowStock = Product::where('stock', '<=', 10)->with('category')->orderBy('stock')->get();

        $recentOrders = Order::with('user', 'payment')->latest()->limit(5)->get();

        return response()->json([
            'total_products'  => Product::count(),
            'total_orders'    => Order::count(),
            'total_users'     => User::count(),
            'total_revenue'   => Order::where('status', '!=', 'cancelled')->sum('total_amount'),
            'pending_orders'  => Order::where('status', 'pending')->count(),
            'revenue_by_month' => $revenueByMonth,
            'low_stock'        => $lowStock,
            'recent_orders'    => $recentOrders,
        ]);
    }

    public function orders(Request $request)
    {
        $this->guard($request);
        $query = Order::with('user', 'items.product', 'payment', 'rider')->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return response()->json($query->get());
    }

    public function updateStatus(Request $request, Order $order)
    {
        $this->guard($request);
        $request->validate(['status' => 'required|in:pending,processing,completed,cancelled']);
        $order->update(['status' => $request->status]);
        return response()->json($order->load('user', 'items.product', 'payment'));
    }

    public function users(Request $request)
    {
        $this->guard($request);
        $users = User::withCount('orders')
            ->orderByDesc('created_at')
            ->get();
        return response()->json($users);
    }

    public function toggleAdmin(Request $request, User $user)
    {
        $this->guard($request);
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot change your own admin status'], 422);
        }
        $user->update(['is_admin' => !$user->is_admin]);
        return response()->json($user);
    }

    public function riders(Request $request)
    {
        $this->guard($request);
        $riders = User::where('is_rider', true)->withCount('assignedOrders')->orderByDesc('created_at')->get();
        return response()->json($riders);
    }

    public function createRider(Request $request)
    {
        $this->guard($request);
        $request->validate([
            'name'      => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email',
            'phone'     => 'required|string|max:20',
            'address'   => 'required|string',
            'birthdate' => 'required|date|before:-18 years',
        ]);

        $tempPassword = strtolower($request->last_name) . date('Y');

        $rider = User::create([
            'name'      => $request->name,
            'last_name' => $request->last_name,
            'email'     => $request->email,
            'password'  => $tempPassword,
            'phone'     => $request->phone,
            'address'   => $request->address,
            'birthdate' => $request->birthdate,
            'is_rider'  => true,
        ]);

        return response()->json([
            'rider'          => $rider,
            'temp_password'  => $tempPassword,
        ], 201);
    }

    public function assignRider(Request $request, Order $order)
    {
        $this->guard($request);
        $request->validate(['rider_id' => 'nullable|exists:users,id']);

        $riderId = $request->rider_id;
        $deliveryStatus = $riderId ? 'assigned' : 'unassigned';

        $order->update(['rider_id' => $riderId, 'delivery_status' => $deliveryStatus]);
        return response()->json($order->load('user', 'items.product', 'payment', 'rider'));
    }
}
