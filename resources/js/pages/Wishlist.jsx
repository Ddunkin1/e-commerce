import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export default function Wishlist() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () =>
        api.get('/wishlist').then(r => setItems(Array.isArray(r.data) ? r.data : [])).finally(() => setLoading(false));

    useEffect(() => { load(); }, []);

    const remove = async (product) => {
        await api.post(`/wishlist/${product.id}`);
        setItems(prev => prev.filter(p => p.id !== product.id));
        toast.success('Removed from wishlist');
    };

    const addToCart = async (product) => {
        try {
            await api.post('/cart', { product_id: product.id, quantity: 1 });
            toast.success('Added to cart!');
        } catch {
            toast.error('Failed to add to cart');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-5 py-10">
            <Link to="/products" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-pink-500 mb-8 transition">
                <ArrowLeft size={16} /> Back to Shop
            </Link>

            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center">
                    <Heart size={18} className="text-pink-400 fill-pink-300" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>My Wishlist</h1>
                    {!loading && <p className="text-xs text-stone-400">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>}
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-pink-50 rounded-2xl animate-pulse" />)}
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-pink-50">
                    <Heart size={48} className="text-pink-100 mx-auto mb-4" />
                    <p className="text-stone-500 font-medium mb-1">Your wishlist is empty</p>
                    <p className="text-stone-400 text-sm mb-6">Save products you love by clicking the heart icon.</p>
                    <Link to="/products" className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition shadow-md shadow-pink-200">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {items.map(product => (
                        <div key={product.id} className="bg-white rounded-2xl border border-pink-50 shadow-sm p-4 flex items-center gap-4">
                            <Link to={`/products/${product.id}`} className="w-20 h-20 rounded-xl overflow-hidden bg-pink-50 flex-shrink-0">
                                {product.image
                                    ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={24} className="text-pink-200" /></div>
                                }
                            </Link>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-pink-400 font-medium mb-0.5">{product.category?.name}</p>
                                <Link to={`/products/${product.id}`}>
                                    <p className="font-semibold text-stone-700 text-sm hover:text-pink-500 transition line-clamp-1">{product.name}</p>
                                </Link>
                                <p className="text-pink-500 font-bold text-sm mt-1">₱{Number(product.price).toLocaleString()}</p>
                                <p className="text-xs text-stone-400 mt-0.5">
                                    {product.stock === 0 ? <span className="text-red-400">Out of stock</span> : `${product.stock} in stock`}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 flex-shrink-0">
                                <button
                                    onClick={() => addToCart(product)}
                                    disabled={product.stock === 0}
                                    className="flex items-center gap-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition disabled:opacity-40"
                                >
                                    <ShoppingBag size={12} /> Add to Cart
                                </button>
                                <button
                                    onClick={() => remove(product)}
                                    className="flex items-center gap-1.5 border border-pink-100 text-stone-400 hover:text-red-400 hover:border-red-200 text-xs font-medium px-4 py-2 rounded-xl transition"
                                >
                                    <Trash2 size={12} /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
