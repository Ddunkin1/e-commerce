import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Zap } from 'lucide-react';
import api from '../lib/axios';
import { isLoggedIn } from '../lib/auth';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);
    const [adding, setAdding] = useState(false);

    const addToCart = async (e) => {
        e.preventDefault();
        if (!isLoggedIn()) { toast.error('Please login first'); navigate('/login'); return; }
        setAdding(true);
        try {
            await api.post('/cart', { product_id: product.id, quantity: 1 });
            toast.success(`Added to cart!`);
        } finally {
            setAdding(false);
        }
    };

    const buyNow = async (e) => {
        e.preventDefault();
        if (!isLoggedIn()) { toast.error('Please login first'); navigate('/login'); return; }
        await api.post('/cart', { product_id: product.id, quantity: 1 });
        navigate('/checkout');
    };

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-pink-50 animate-fade-up flex flex-col">
            {/* Image — clickable */}
            <Link to={`/products/${product.id}`} className="relative block overflow-hidden" style={{ height: '200px' }}>
                <div className="w-full h-full bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
                    {product.image
                        ? <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <ShoppingBag size={40} className="text-pink-200" />
                    }
                </div>

                {/* Badges */}
                <span className="absolute top-3 left-3 bg-white/85 backdrop-blur text-pink-500 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {product.category?.name}
                </span>
                <button
                    onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
                    className="absolute top-3 right-3 p-1.5 bg-white/85 backdrop-blur rounded-full shadow-sm hover:scale-110 transition-transform"
                >
                    <Heart size={14} className={`transition ${liked ? 'fill-pink-400 text-pink-400' : 'text-pink-300'}`} />
                </button>
                {product.stock === 0 && (
                    <span className="absolute bottom-3 left-3 bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Out of Stock</span>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                    <span className="absolute bottom-3 left-3 bg-orange-400 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Only {product.stock} left!</span>
                )}

                {/* Hover action overlay */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-1.5 p-2 bg-gradient-to-t from-black/40 to-transparent pt-8">
                    <button
                        onClick={addToCart}
                        disabled={adding || product.stock === 0}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-white text-pink-500 text-xs font-semibold py-2 rounded-xl hover:bg-pink-50 transition disabled:opacity-50"
                    >
                        <ShoppingBag size={12} />
                        {adding ? '...' : 'Add to Cart'}
                    </button>
                    <button
                        onClick={buyNow}
                        disabled={product.stock === 0}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-pink-500 text-white text-xs font-semibold py-2 rounded-xl hover:bg-pink-600 transition disabled:opacity-50"
                    >
                        <Zap size={12} />
                        Buy Now
                    </button>
                </div>
            </Link>

            {/* Card body */}
            <div className="p-4 flex flex-col gap-1.5 flex-1">
                <Link to={`/products/${product.id}`}>
                    <p className="font-semibold text-stone-700 text-sm leading-snug hover:text-pink-500 transition">{product.name}</p>
                </Link>
                <p className="text-xs text-stone-400 line-clamp-1">{product.description}</p>
                <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-pink-500 font-bold text-sm">₱{Number(product.price).toLocaleString()}</span>
                    <span className="text-[11px] text-stone-400">
                        {product.sold_count > 0 ? `${product.sold_count} sold` : product.stock > 0 ? 'In stock' : 'Sold out'}
                    </span>
                </div>
            </div>
        </div>
    );
}
