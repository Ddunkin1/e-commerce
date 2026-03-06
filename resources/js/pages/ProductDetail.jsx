import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, ArrowLeft, Minus, Plus } from 'lucide-react';
import api from '../lib/axios';
import { isLoggedIn } from '../lib/auth';
import toast from 'react-hot-toast';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [liked, setLiked] = useState(false);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        api.get(`/products/${id}`).then(r => setProduct(r.data));
    }, [id]);

    const addToCart = async () => {
        if (!isLoggedIn()) { toast.error('Please login first 🔐'); return; }
        setAdding(true);
        await api.post('/cart', { product_id: product.id, quantity: qty });
        setAdding(false);
        toast.success(`Added to cart! 🛍️`);
    };

    if (!product) return (
        <div className="max-w-4xl mx-auto px-5 py-20">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="skeleton h-80 rounded-3xl" />
                <div className="flex flex-col gap-4">
                    <div className="skeleton h-6 w-24 rounded-full" />
                    <div className="skeleton h-10 w-3/4 rounded-xl" />
                    <div className="skeleton h-20 rounded-xl" />
                    <div className="skeleton h-12 rounded-2xl" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-5 py-10">
            <Link to="/products" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-pink-500 mb-8 transition">
                <ArrowLeft size={16} /> Back to Shop
            </Link>

            <div className="grid md:grid-cols-2 gap-10">
                <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl h-80 flex items-center justify-center overflow-hidden">
                    {product.image
                        ? <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-3xl" />
                        : <ShoppingBag size={64} className="text-pink-200" />
                    }
                    <button
                        onClick={() => setLiked(!liked)}
                        className="absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-md"
                    >
                        <Heart size={18} className={`transition ${liked ? 'fill-pink-400 text-pink-400' : 'text-pink-300'}`} />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <span className="inline-block bg-pink-100 text-pink-500 text-xs font-semibold px-3 py-1 rounded-full w-fit">
                        {product.category?.name}
                    </span>
                    <h1 className="text-2xl font-bold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>{product.name}</h1>
                    <p className="text-stone-400 text-sm leading-relaxed">{product.description}</p>

                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-pink-500">₱{Number(product.price).toLocaleString()}</span>
                    </div>

                    <p className="text-xs text-stone-400">{product.stock} items in stock</p>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-pink-50 rounded-full px-3 py-1.5">
                            <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1 hover:text-pink-500 transition">
                                <Minus size={14} />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                            <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-1 hover:text-pink-500 transition">
                                <Plus size={14} />
                            </button>
                        </div>
                        <button
                            onClick={addToCart}
                            disabled={adding}
                            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-full shadow-md shadow-pink-200 transition disabled:opacity-50"
                        >
                            {adding ? 'Adding...' : 'Add to Cart 🛍️'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
