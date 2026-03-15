<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Product $product)
    {
        $reviews = $product->reviews()->with('user:id,name')->latest()->get();
        $avg = $reviews->count() > 0 ? round($reviews->avg('rating'), 1) : null;
        return response()->json(['reviews' => $reviews, 'average' => $avg, 'count' => $reviews->count()]);
    }

    public function eligibility(Request $request, Product $product)
    {
        $hasPurchased = Order::where('user_id', $request->user()->id)
            ->whereHas('items', fn($q) => $q->where('product_id', $product->id))
            ->where('status', 'completed')
            ->exists();

        $hasReviewed = Review::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)->exists();

        return response()->json([
            'can_review' => $hasPurchased && !$hasReviewed,
            'purchased'  => $hasPurchased,
            'reviewed'   => $hasReviewed,
        ]);
    }

    public function store(Request $request, Product $product)
    {
        $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        $hasPurchased = Order::where('user_id', $request->user()->id)
            ->whereHas('items', fn($q) => $q->where('product_id', $product->id))
            ->where('status', 'completed')
            ->exists();

        if (!$hasPurchased) {
            return response()->json(['message' => 'You can only review products you have purchased and received.'], 403);
        }

        $review = Review::updateOrCreate(
            ['user_id' => $request->user()->id, 'product_id' => $product->id],
            ['rating' => $request->rating, 'comment' => $request->comment]
        );

        return response()->json($review->load('user:id,name'), 201);
    }
}
