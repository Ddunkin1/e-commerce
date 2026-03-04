<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    private function getCart(Request $request)
    {
        return Cart::firstOrCreate(['user_id' => $request->user()->id]);
    }

    public function index(Request $request)
    {
        $cart = $this->getCart($request)->load('items.product');
        return response()->json($cart);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'integer|min:1',
        ]);

        $cart = $this->getCart($request);
        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($item) {
            $item->increment('quantity', $request->quantity ?? 1);
        } else {
            CartItem::create([
                'cart_id'    => $cart->id,
                'product_id' => $request->product_id,
                'quantity'   => $request->quantity ?? 1,
            ]);
        }

        return response()->json($cart->load('items.product'));
    }

    public function remove(Request $request, CartItem $item)
    {
        $item->delete();
        return response()->json($this->getCart($request)->load('items.product'));
    }

    public function clear(Request $request)
    {
        $cart = $this->getCart($request);
        $cart->items()->delete();
        return response()->json(['message' => 'Cart cleared']);
    }
}
