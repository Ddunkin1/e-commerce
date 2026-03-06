import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export default function Cart() {
    const [cart, setCart] = useState(null);
    const navigate = useNavigate();

    const load = () => api.get('/cart').then(r => setCart(r.data));
    useEffect(() => { load(); }, []);

    const remove = async (id) => {
        await api.delete(`/cart/${id}`);
        toast.success('Item removed');
        load();
    };

    const total = cart?.items?.reduce((sum, i) => sum + i.product.price * i.quantity, 0) || 0;

    if (!cart) return (
        <div className="max-w-3xl mx-auto px-5 py-20">
            <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
            </div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto px-5 py-10">
            <Link to="/products" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-pink-500 mb-8 transition">
                <ArrowLeft size={16} /> Continue Shopping
            </Link>

            <h1 className="text-3xl font-bold text-stone-800 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>Your Cart 🛍️</h1>

            {cart.items?.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-pink-50">
                    <ShoppingBag size={48} className="text-pink-200 mx-auto mb-4" />
                    <p className="text-stone-400 mb-2">Your cart is empty</p>
                    <Link to="/products" className="text-pink-500 font-medium hover:text-pink-600 text-sm">Start shopping →</Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {cart.items.map(item => (
                        <div key={item.id} className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-pink-50 shadow-sm animate-fade-up">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {item.product.image
                                    ? <img src={item.product.image} className="h-full w-full object-cover rounded-xl" />
                                    : <ShoppingBag size={20} className="text-pink-200" />
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-stone-700 text-sm truncate">{item.product.name}</p>
                                <p className="text-xs text-stone-400 mt-0.5">Qty: {item.quantity}</p>
                            </div>
                            <span className="font-bold text-pink-500 text-sm">₱{(item.product.price * item.quantity).toLocaleString()}</span>
                            <button onClick={() => remove(item.id)} className="p-2 text-stone-300 hover:text-red-400 transition rounded-full hover:bg-red-50">
                                <Trash2 size={15} />
                            </button>
                        </div>
                    ))}

                    <div className="bg-white rounded-2xl p-6 border border-pink-100 mt-2">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-stone-500">Subtotal</span>
                            <span className="font-bold text-stone-700">₱{total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashed border-pink-100">
                            <span className="text-stone-500">Shipping</span>
                            <span className="text-green-500 text-sm font-medium">{total >= 999 ? 'Free' : '₱99'}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-stone-700">Total</span>
                            <span className="font-bold text-pink-500 text-xl">₱{(total >= 999 ? total : total + 99).toLocaleString()}</span>
                        </div>
                        <button onClick={() => navigate('/checkout')}
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3.5 rounded-2xl shadow-md shadow-pink-200 transition">
                            Proceed to Checkout →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
