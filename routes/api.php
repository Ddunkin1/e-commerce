<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\RiderController;
use Illuminate\Support\Facades\Route;

// Public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/products/{product}/reviews', [ReviewController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);

// Protected
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::patch('/profile', [AuthController::class, 'updateProfile']);

    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'add']);
    Route::patch('/cart/{item}', [CartController::class, 'update']);
    Route::delete('/cart/{item}', [CartController::class, 'remove']);
    Route::delete('/cart', [CartController::class, 'clear']);

    // Reviews
    Route::get('/products/{product}/reviews/eligibility', [ReviewController::class, 'eligibility']);
    Route::post('/products/{product}/reviews', [ReviewController::class, 'store']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::patch('/orders/{order}/cancel', [OrderController::class, 'cancel']);

    // Products & Categories CRUD
    Route::post('/products/image', [ProductController::class, 'uploadImage']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    // Admin
    Route::get('/admin/stats', [AdminController::class, 'stats']);
    Route::get('/admin/orders', [AdminController::class, 'orders']);
    Route::patch('/admin/orders/{order}/status', [AdminController::class, 'updateStatus']);
    Route::patch('/admin/orders/{order}/assign-rider', [AdminController::class, 'assignRider']);
    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::patch('/admin/users/{user}/toggle-admin', [AdminController::class, 'toggleAdmin']);
    Route::get('/admin/riders', [AdminController::class, 'riders']);
    Route::post('/admin/riders', [AdminController::class, 'createRider']);

    // Rider
    Route::get('/rider/orders', [RiderController::class, 'myOrders']);
    Route::get('/rider/history', [RiderController::class, 'history']);
    Route::patch('/rider/orders/{order}/delivery-status', [RiderController::class, 'updateDeliveryStatus']);
});
