import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import api from '../lib/axios';
import { isLoggedIn } from '../lib/auth';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
    const [liked, setLiked] = useState(false);
    const [adding, setAdding] = useState(false);

    const addToCart = async (e) => {
        e.preventDefault();
        if (!isLoggedIn()) { toast.error('Please login first 🔐'); return; }
        setAdding(true);
        await api.post('/cart', { product_id: product.id, quantity: 1 });
        setAdding(false);
        toast.success(`${product.name} added to cart! 🛍️`);
    };

    return (
        <Link to={`/products/${product.id}`} className="group block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-pink-50 animate-fade-up">
            <div className="relative h-44 bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center overflow-hidden">
                {product.image
                    ? <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <ShoppingBag size={40} className="text-pink-200" />
                }
                <button
                    onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
                    className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur rounded-full shadow-sm"
                >
                    <Heart size={14} className={`transition ${liked ? 'fill-pink-400 text-pink-400' : 'text-pink-300'}`} />
                </button>
                <span className="absolute top-3 left-3 bg-white/80 backdrop-blur text-pink-500 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {product.category?.name}
                </span>
                {product.stock === 0 && (
                    <span className="absolute bottom-3 left-3 bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Out of Stock</span>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                    <span className="absolute bottom-3 left-3 bg-orange-400 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Only {product.stock} left!</span>
                )}
            </div>
            <div className="p-4">
                <p className="font-semibold text-stone-700 text-sm leading-snug mb-1 group-hover:text-pink-500 transition">{product.name}</p>
                <p className="text-xs text-stone-400 mb-3 line-clamp-1">{product.description}</p>
                <div className="flex items-center justify-between">
                    <span className="text-pink-500 font-bold text-sm">₱{Number(product.price).toLocaleString()}</span>
                    <button
                        onClick={addToCart}
                        disabled={adding}
                        className="bg-pink-100 hover:bg-pink-500 hover:text-white text-pink-500 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 disabled:opacity-50"
                    >
                        {adding ? '...' : 'Add'}
                    </button>
                </div>
            </div>
        </Link>
    );
}
