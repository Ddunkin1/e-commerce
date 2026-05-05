<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $items = Wishlist::where('user_id', $request->user()->id)
            ->with(['product.category'])
            ->latest()
            ->get()
            ->map(fn($w) => $w->product)
            ->filter();

        return response()->json($items->values());
    }

    public function toggle(Request $request, Product $product)
    {
        $userId = $request->user()->id;
        $existing = Wishlist::where('user_id', $userId)->where('product_id', $product->id)->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['wishlisted' => false]);
        }

        Wishlist::create(['user_id' => $userId, 'product_id' => $product->id]);
        return response()->json(['wishlisted' => true]);
    }

    public function check(Request $request, Product $product)
    {
        $wishlisted = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->exists();

        return response()->json(['wishlisted' => $wishlisted]);
    }
}
