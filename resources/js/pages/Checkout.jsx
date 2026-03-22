import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const methods = [
    { value: 'cash', label: 'Cash on Delivery', emoji: '💵' },
    { value: 'gcash', label: 'GCash', emoji: '📱' },
    { value: 'card', label: 'Credit / Debit Card', emoji: '💳' },
];

export default function Checkout() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ shipping_address: '', payment_method: 'cash' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/cart').then(r => {
            if (!r.data.items?.length) {
                toast.error('Your cart is empty');
                navigate('/cart');
            }
        }).catch(() => {});
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/orders', form);
            navigate(`/order-success/${res.data.id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto px-5 py-10">
            <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-pink-500 mb-8 transition">
                <ArrowLeft size={16} /> Back to Cart
            </Link>

            <h1 className="text-3xl font-bold text-stone-800 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>Checkout ✨</h1>

            <form onSubmit={submit} className="flex flex-col gap-5">
                <div className="bg-white rounded-2xl p-6 border border-pink-50 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin size={16} className="text-pink-400" />
                        <h2 className="font-semibold text-stone-700">Shipping Address</h2>
                    </div>
                    <textarea required rows={3} placeholder="Enter your full address..."
                        className="w-full border border-pink-100 rounded-2xl px-4 py-3 text-sm text-stone-600 placeholder-stone-300 focus:outline-none focus:border-pink-300 bg-pink-50/30 resize-none"
                        value={form.shipping_address}
                        onChange={e => setForm({ ...form, shipping_address: e.target.value })}
                    />
                </div>

                <div className="bg-white rounded-2xl p-6 border border-pink-50 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <CreditCard size={16} className="text-pink-400" />
                        <h2 className="font-semibold text-stone-700">Payment Method</h2>
                    </div>
                    <div className="flex flex-col gap-2">
                        {methods.map(m => (
                            <label key={m.value} className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition ${form.payment_method === m.value ? 'border-pink-300 bg-pink-50' : 'border-pink-100 hover:border-pink-200'}`}>
                                <input type="radio" name="payment" value={m.value} checked={form.payment_method === m.value}
                                    onChange={() => setForm({ ...form, payment_method: m.value })} className="accent-pink-500" />
                                <span className="text-lg">{m.emoji}</span>
                                <span className="text-sm font-medium text-stone-600">{m.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button disabled={loading}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-pink-200 transition disabled:opacity-50 text-base">
                    {loading ? 'Placing order...' : 'Place Order 🎀'}
                </button>
            </form>
        </div>
    );
}
