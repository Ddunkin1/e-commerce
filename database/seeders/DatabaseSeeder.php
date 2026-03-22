<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Accounts ───────────────────────────────────────────────
        $admin = User::create([
            'name'     => 'Admin',
            'email'    => 'admin@shopease.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);

        $rider1 = User::create([
            'name'     => 'Carlo Reyes',
            'email'    => 'carlo@rider.com',
            'password' => Hash::make('password'),
            'is_rider' => true,
        ]);

        $rider2 = User::create([
            'name'     => 'Miko Santos',
            'email'    => 'miko@rider.com',
            'password' => Hash::make('password'),
            'is_rider' => true,
        ]);

        $juan  = User::create(['name' => 'Juan dela Cruz',  'email' => 'juan@example.com',  'password' => Hash::make('password')]);
        $maria = User::create(['name' => 'Maria Santos',    'email' => 'maria@example.com', 'password' => Hash::make('password')]);
        $pedro = User::create(['name' => 'Pedro Garcia',    'email' => 'pedro@example.com', 'password' => Hash::make('password')]);
        $ana   = User::create(['name' => 'Ana Reyes',       'email' => 'ana@example.com',   'password' => Hash::make('password')]);

        // ─── Categories ─────────────────────────────────────────────
        $cats = [];
        foreach (['Electronics', 'Clothing', 'Food & Beverage', 'Home & Living', 'Beauty & Care'] as $name) {
            $cats[$name] = Category::create(['name' => $name, 'slug' => Str::slug($name)]);
        }

        // ─── Products ───────────────────────────────────────────────
        $productData = [
            ['Electronics',     'Wireless Earbuds',      'Premium sound with active noise cancellation and 24hr battery life.',    1299.00, 50,  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80'],
            ['Electronics',     'USB-C Hub 7-in-1',      'Multiport adapter with HDMI, USB 3.0, SD card, and PD charging.',        899.00,  30,  'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400&q=80'],
            ['Electronics',     'Adjustable Phone Stand', 'Aluminum desktop holder, foldable and angle-adjustable.',               499.00,  100, 'https://images.unsplash.com/photo-1586920740099-f0ce8a853a42?w=400&q=80'],
            ['Electronics',     'Bluetooth Speaker',     'Portable IPX7 waterproof speaker with 12hr playtime.',                  1199.00, 35,  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80'],
            ['Electronics',     'Mechanical Keyboard',   'TKL layout, blue switches, RGB backlight.',                             2499.00, 20,  'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80'],
            ['Clothing',        'White Polo Shirt',      'Classic fit, 100% breathable premium cotton.',                           599.00,  80,  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'],
            ['Clothing',        'Jogger Pants',          'Slim tapered joggers, soft fleece interior.',                            799.00,  60,  'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80'],
            ['Clothing',        'Casual Sneakers',       'Lightweight EVA sole, breathable mesh upper.',                          1499.00, 5,   'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'],
            ['Clothing',        'Oversized Hoodie',      'Heavyweight 380gsm cotton, dropped shoulders.',                         1199.00, 45,  'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80'],
            ['Food & Beverage', 'Premium Arabica Coffee','250g medium roast, single origin, ground or whole bean.',                350.00,  200, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80'],
            ['Food & Beverage', 'Organic Green Tea',     '20 sachets, ceremonial grade, no artificial flavors.',                   180.00,  150, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80'],
            ['Food & Beverage', 'Dark Chocolate Bar',   '72% cacao, single origin Ecuador, 100g.',                                220.00,  120, 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&q=80'],
            ['Home & Living',   'Lavender Scented Candle','Soy wax, 40hr burn time, hand-poured.',                                320.00,  75,  'https://images.unsplash.com/photo-1608181831718-c9e53b3b3e2a?w=400&q=80'],
            ['Home & Living',   'Bamboo Desk Organizer', 'Multi-compartment, pen holder, phone slot, eco-friendly.',              650.00,  45,  'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80'],
            ['Home & Living',   'Knit Throw Pillow',     'Cotton blend, 45×45cm, machine washable.',                              450.00,  90,  'https://images.unsplash.com/photo-1592789705501-f9ae4287c4cf?w=400&q=80'],
            ['Beauty & Care',   'Vitamin C Serum',       '20% L-ascorbic acid, brightening + anti-aging, 30ml.',                  899.00,  60,  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80'],
            ['Beauty & Care',   'Facial Sunscreen SPF50','Lightweight, non-greasy, PA++++, 50ml.',                                 499.00,  80,  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80'],
            ['Beauty & Care',   'Moisturizing Lip Balm', 'Shea butter + vitamin E, SPF15, set of 3.',                             150.00,  200, 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=400&q=80'],
        ];

        $products = [];
        foreach ($productData as [$catName, $name, $desc, $price, $stock, $image]) {
            $products[] = Product::create([
                'category_id' => $cats[$catName]->id,
                'name'        => $name,
                'slug'        => Str::slug($name) . '-' . Str::random(4),
                'description' => $desc,
                'price'       => $price,
                'stock'       => $stock,
                'image'       => $image,
            ]);
        }

        // ─── Orders ─────────────────────────────────────────────────
        // Completed + delivered (with rider + reviews)
        $o1 = $this->createOrder($juan,  [$products[0], $products[5]],  [1, 2], 'Brgy. Poblacion, Makati City',      'gcash', 'completed', 'delivered', $rider1);
        $o2 = $this->createOrder($maria, [$products[9], $products[10]], [2, 1], 'Quezon City, Metro Manila',         'cash',  'completed', 'delivered', $rider1);
        $o3 = $this->createOrder($pedro, [$products[3], $products[12]], [1, 1], 'Taguig City, BGC',                  'card',  'completed', 'delivered', $rider2);
        $o4 = $this->createOrder($ana,   [$products[7], $products[15]], [1, 1], 'Pasig City, Metro Manila',          'gcash', 'completed', 'delivered', $rider2);
        $o5 = $this->createOrder($juan,  [$products[15],$products[16]], [1, 2], 'Mandaluyong City',                  'cash',  'completed', 'delivered', $rider1);

        // Processing + picked_up (rider on the way)
        $o6 = $this->createOrder($maria, [$products[4], $products[13]], [1, 1], 'Caloocan City, Metro Manila',       'card',  'processing', 'picked_up', $rider2);
        $o7 = $this->createOrder($pedro, [$products[1], $products[2]],  [1, 2], 'Las Piñas City',                   'gcash', 'processing', 'picked_up', $rider1);

        // Processing + assigned (rider hasn't picked up yet)
        $o8 = $this->createOrder($ana,   [$products[8], $products[6]],  [1, 1], 'Muntinlupa City, Alabang',         'cash',  'processing', 'assigned',  $rider2);

        // Pending (no rider yet)
        $o9  = $this->createOrder($juan,  [$products[11],$products[17]], [2, 3], 'Malabon City, Metro Manila',       'gcash', 'pending', 'unassigned', null);
        $o10 = $this->createOrder($maria, [$products[0], $products[3]], [1, 1],  'Navotas City, Metro Manila',       'cash',  'pending', 'unassigned', null);
        $o11 = $this->createOrder($pedro, [$products[14],$products[12]], [2, 1], 'Valenzuela City',                  'card',  'pending', 'unassigned', null);

        // Cancelled
        $this->createOrder($ana, [$products[6]], [1], 'Parañaque City', 'gcash', 'cancelled', 'unassigned', null);

        // ─── Reviews (only for completed orders) ────────────────────
        $reviewData = [
            [$juan,  $products[0],  5, 'Amazing earbuds! Sound quality is crystal clear and the noise cancellation works great.'],
            [$juan,  $products[5],  4, 'Good quality polo, fits true to size. Very comfortable for everyday wear.'],
            [$maria, $products[9],  5, 'Best coffee I\'ve tried! Rich flavor, perfect for morning brew.'],
            [$maria, $products[10], 4, 'Good tea, love that it\'s organic. Will buy again.'],
            [$pedro, $products[3],  5, 'Sound quality is outstanding for the price. Waterproofing works too!'],
            [$pedro, $products[12], 4, 'Smells wonderful, burns evenly. Great for relaxing evenings.'],
            [$ana,   $products[7],  5, 'Super comfortable and lightweight. Got a lot of compliments!'],
            [$ana,   $products[15], 5, 'My skin looks brighter after just 2 weeks. Highly recommend!'],
            [$juan,  $products[15], 4, 'Love this serum, no irritation at all. Great value for money.'],
            [$juan,  $products[16], 5, 'Lightweight and non-greasy! Finally a sunscreen I enjoy wearing daily.'],
        ];

        foreach ($reviewData as [$user, $product, $rating, $comment]) {
            Review::firstOrCreate(
                ['user_id' => $user->id, 'product_id' => $product->id],
                ['rating' => $rating, 'comment' => $comment]
            );
        }
    }

    private function createOrder(
        User $user,
        array $products,
        array $quantities,
        string $address,
        string $method,
        string $status,
        string $deliveryStatus = 'unassigned',
        ?User $rider = null
    ): Order {
        $total = 0;
        foreach ($products as $i => $product) {
            $total += $product->price * ($quantities[$i] ?? 1);
        }

        $order = Order::create([
            'user_id'          => $user->id,
            'rider_id'         => $rider?->id,
            'total_amount'     => $total,
            'status'           => $status,
            'delivery_status'  => $deliveryStatus,
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

        return $order;
    }
}
