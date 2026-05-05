<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Electronics',
            'Clothing & Fashion',
            'Food & Beverages',
            'Home & Living',
            'Beauty & Care',
            'Sports & Outdoors',
            'Books & Stationery',
            'Toys & Games',
        ];

        foreach ($categories as $name) {
            DB::table('categories')->updateOrInsert(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'slug' => Str::slug($name), 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
