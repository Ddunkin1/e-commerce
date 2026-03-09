import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowLeft, Plus, Minus } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [selected, setSelected] = useState([]);
    const navigate = useNavigate();

    const load = () => api.get('/cart').then(r => {
        setCart(r.data);
        setSelected(prev => prev.filter(id => r.data.items?.some(i => i.id === id)));
    });

    useEffect(() => { load(); }, []);

    const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const toggleAll = () => {
        if (!cart?.items) return;
        setSelected(selected.length === cart.items.length ? [] : cart.items.map(i => i.id));
    };

    const remove = async (id) => {
        await api.delete(`/cart/${id}`);
        toast.success('Item removed');
        load();
    };

    const removeSelected = async () => {
        await Promise.all(selected.map(id => api.delete(`/cart/${id}`)));
        toast.success('Items removed');
        load();
    };

    const updateQty = async (id, qty) => {
        if (qty < 1) return;
        await api.patch(`/cart/${id}`, { quantity: qty });
        load();
    };

    const selectedItems = cart?.items?.filter(i => selected.includes(i.id)) || [];
    const subtotal = selectedItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const shipping = subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 99;
    const total = subtotal + shipping;

    if (!cart) return (
        <div className="max-w-6xl mx-auto px-5 py-20">
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
                </div>
                <div className="skeleton h-64 rounded-2xl" />
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-5 py-8">
            <Link to="/products" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-pink-500 mb-6 transition">
                <ArrowLeft size={16} /> Continue Shopping
            </Link>

            <h1 className="text-2xl font-bold text-stone-800 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Shopping Cart</h1>

            {!cart.items?.length ? (
                <div className="text-center py-32 bg-white rounded-3xl border border-pink-50">
                    <ShoppingBag size={56} className="text-pink-200 mx-auto mb-4" />
                    <p className="text-stone-500 font-medium mb-1">Your cart is empty</p>
                    <p className="text-stone-400 text-sm mb-6">Looks like you haven't added anything yet.</p>
                    <Link to="/products" className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2.5 rounded-full transition text-sm">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Items list */}
                    <div className="flex-1 min-w-0">
                        {/* Select all bar */}
                        <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-3.5 border border-pink-50 mb-3 shadow-sm">
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={selected.length === cart.items.length}
                                    onChange={toggleAll}
                                    className="w-4 h-4 accent-pink-500 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-stone-600">
                                    Select All ({cart.items.length} item{cart.items.length !== 1 ? 's' : ''})
                                </span>
                            </label>
                            {selected.length > 0 && (
                                <button onClick={removeSelected} className="text-xs text-red-400 hover:text-red-500 font-medium transition">
                                    Delete Selected ({selected.length})
                                </button>
                            )}
                        </div>

                        {/* Cart items */}
                        <div className="flex flex-col gap-3">
                            {cart.items.map(item => (
                                <div key={item.id} className={`flex items-center gap-4 bg-white rounded-2xl p-4 border shadow-sm transition-all ${selected.includes(item.id) ? 'border-pink-300' : 'border-pink-50'}`}>
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(item.id)}
                                        onChange={() => toggleSelect(item.id)}
                                        className="w-4 h-4 accent-pink-500 cursor-pointer flex-shrink-0"
                                    />

                                    {/* Image */}
                                    <Link to={`/products/${item.product.id}`} className="flex-shrink-0">
                                        <div className="w-20 h-20 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl overflow-hidden">
                                            {item.product.image
                                                ? <img src={item.product.image} className="w-full h-full object-cover" alt={item.product.name} />
                                                : <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={24} className="text-pink-200" /></div>
                                            }
                                        </div>
                                    </Link>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/products/${item.product.id}`} className="font-semibold text-stone-700 text-sm hover:text-pink-500 transition line-clamp-2 leading-snug">
                                            {item.product.name}
                                        </Link>
                                        {item.size && (
                                            <span className="inline-block mt-1 text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                                                Size: {item.size}
                                            </span>
                                        )}
                                        <p className="text-pink-500 font-bold text-sm mt-1.5">₱{Number(item.product.price).toLocaleString()}</p>
                                    </div>

                                    {/* Qty stepper */}
                                    <div className="flex items-center gap-1 bg-pink-50 rounded-full px-2 py-1 flex-shrink-0">
                                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-pink-200 text-pink-500 transition">
                                            <Minus size={12} />
                                        </button>
                                        <span className="w-6 text-center text-sm font-semibold text-stone-700">{item.quantity}</span>
                                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-pink-200 text-pink-500 transition">
                                            <Plus size={12} />
                                        </button>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="text-right flex-shrink-0 min-w-[70px]">
                                        <p className="font-bold text-stone-700 text-sm">₱{(item.product.price * item.quantity).toLocaleString()}</p>
                                    </div>

                                    {/* Delete */}
                                    <button onClick={() => remove(item.id)} className="p-2 text-stone-300 hover:text-red-400 transition rounded-full hover:bg-red-50 flex-shrink-0">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order summary — sticky */}
                    <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-24">
                        <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-pink-50">
                                <h2 className="font-bold text-stone-700">Order Summary</h2>
                                <p className="text-xs text-stone-400 mt-0.5">{selected.length} item{selected.length !== 1 ? 's' : ''} selected</p>
                            </div>
                            <div className="px-6 py-4 flex flex-col gap-3">
                                <div className="flex justify-between text-sm text-stone-500">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-stone-700">₱{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-stone-500">
                                    <span>Shipping</span>
                                    {subtotal === 0
                                        ? <span className="text-stone-400">—</span>
                                        : <span className={shipping === 0 ? 'text-green-500 font-medium' : 'font-medium text-stone-700'}>
                                            {shipping === 0 ? 'Free' : `₱${shipping}`}
                                        </span>
                                    }
                                </div>
                                {subtotal > 0 && subtotal < 999 && (
                                    <p className="text-[11px] text-stone-400 bg-stone-50 rounded-xl px-3 py-2">
                                        Add ₱{(999 - subtotal).toLocaleString()} more for free shipping!
                                    </p>
                                )}
                                <div className="border-t border-dashed border-pink-100 pt-3 flex justify-between">
                                    <span className="font-bold text-stone-700">Total</span>
                                    <span className="font-bold text-pink-500 text-lg">₱{total.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="px-6 pb-5">
                                <button
                                    onClick={() => navigate('/checkout')}
                                    disabled={selected.length === 0}
                                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3.5 rounded-2xl shadow-md shadow-pink-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {selected.length === 0 ? 'Select items to checkout' : `Checkout (${selected.length})`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
