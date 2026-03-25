<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')
            ->withSum('orderItems', 'quantity')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->get()
            ->map(function ($p) {
                $p->sold_count  = (int) ($p->order_items_sum_quantity ?? 0);
                $p->avg_rating  = $p->reviews_avg_rating ? round($p->reviews_avg_rating, 1) : null;
                $p->review_count = (int) ($p->reviews_count ?? 0);
                return $p;
            });

        return response()->json($products);
    }

    public function show(Product $product)
    {
        $product->loadSum('orderItems', 'quantity');
        $product->sold_count = (int) ($product->order_items_sum_quantity ?? 0);
        return response()->json($product->load('category'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'image'       => 'nullable|string',
        ]);

        $product = Product::create([
            ...$request->only('category_id', 'name', 'description', 'price', 'stock', 'image'),
            'slug' => Str::slug($request->name),
        ]);

        return response()->json($product->load('category'), 201);
    }

    public function update(Request $request, Product $product)
    {
        $product->update($request->only('category_id', 'name', 'description', 'price', 'stock', 'image'));
        return response()->json($product->load('category'));
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
