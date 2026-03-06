<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name'     => 'Admin',
            'email'    => 'admin@shopease.com',
            'password' => Hash::make('password'),
        ]);

        $juan = User::create([
            'name'     => 'Juan dela Cruz',
            'email'    => 'juan@example.com',
            'password' => Hash::make('password'),
        ]);

        $maria = User::create([
            'name'     => 'Maria Santos',
            'email'    => 'maria@example.com',
            'password' => Hash::make('password'),
        ]);

        $categories = ['Electronics', 'Clothing', 'Food & Beverage', 'Home & Living'];
        $cats = [];
        foreach ($categories as $name) {
            $cats[$name] = Category::create(['name' => $name, 'slug' => Str::slug($name)]);
        }

        $productData = [
            ['Electronics',     'Wireless Earbuds',    'High quality sound with noise cancellation', 1299.00, 50,  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80'],
            ['Electronics',     'USB-C Hub',           '7-in-1 multiport adapter',                   899.00,  30,  'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400&q=80'],
            ['Electronics',     'Phone Stand',         'Adjustable aluminum phone holder',            499.00,  100, 'https://images.unsplash.com/photo-1586920740099-f0ce8a853a42?w=400&q=80'],
            ['Electronics',     'Bluetooth Speaker',   'Portable waterproof speaker',                1199.00, 35,  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80'],
            ['Clothing',        'White Polo Shirt',    'Classic fit, breathable cotton',              599.00,  80,  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'],
            ['Clothing',        'Jogger Pants',        'Comfortable everyday joggers',                799.00,  60,  'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80'],
            ['Clothing',        'Rubber Shoes',        'Lightweight casual sneakers',                1499.00, 5,   'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'],
            ['Food & Beverage', 'Premium Coffee',      '250g arabica ground coffee',                  350.00,  200, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80'],
            ['Food & Beverage', 'Green Tea Pack',      '20 sachets organic green tea',                180.00,  150, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80'],
            ['Home & Living',   'Scented Candle',      'Lavender soy wax candle 200g',                320.00,  75,  'https://images.unsplash.com/photo-1608181831718-c9e53b3b3e2a?w=400&q=80'],
            ['Home & Living',   'Desk Organizer',      'Bamboo multi-compartment organizer',          650.00,  45,  'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80'],
            ['Home & Living',   'Throw Pillow',        'Cotton knit decorative pillow',               450.00,  90,  'https://images.unsplash.com/photo-1592789705501-f9ae4287c4cf?w=400&q=80'],
        ];

        $products = [];
        foreach ($productData as [$catName, $name, $desc, $price, $stock, $image]) {
            $products[] = Product::create([
                'category_id' => $cats[$catName]->id,
                'name'        => $name,
                'slug'        => Str::slug($name),
                'description' => $desc,
                'price'       => $price,
                'stock'       => $stock,
                'image'       => $image,
            ]);
        }

        $this->createOrder($juan, [$products[0], $products[4]], [1, 2], 'Brgy. Poblacion, Makati City', 'gcash', 'completed');
        $this->createOrder($maria, [$products[7], $products[8]], [2, 1], 'Quezon City, Metro Manila', 'cash', 'completed');
        $this->createOrder($juan, [$products[3], $products[9]], [1, 1], 'Taguig City, BGC', 'card', 'processing');
        $this->createOrder($maria, [$products[6], $products[10]], [1, 2], 'Pasig City, Metro Manila', 'gcash', 'pending');
        $this->createOrder($juan, [$products[1], $products[2]], [1, 1], 'Mandaluyong City', 'cash', 'pending');
    }

    private function createOrder(User $user, array $products, array $quantities, string $address, string $method, string $status): void
    {
        $total = collect($products)->sum(fn($p, $i) => $p->price * $quantities[$i] ?? 1);

        $order = Order::create([
            'user_id'          => $user->id,
            'total_amount'     => $total,
            'status'           => $status,
            'shipping_address' => $address,
        ]);

        foreach ($products as $i => $product) {
            OrderItem::create([
                'order_id'   => $order->id,
                'product_id' => $product->id,
                'quantity'   => $quantities[$i] ?? 1,
                'price'      => $product->price,
            ]);
        }

        Payment::create([
            'order_id' => $order->id,
            'amount'   => $total,
            'method'   => $method,
            'status'   => $status === 'completed' ? 'paid' : 'pending',
        ]);
    }
}
