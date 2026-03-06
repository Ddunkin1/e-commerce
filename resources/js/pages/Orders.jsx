import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import api from '../lib/axios';

const statusStyle = {
    pending:    { bg: 'bg-yellow-50',  text: 'text-yellow-600',  dot: 'bg-yellow-400',  label: 'Pending' },
    processing: { bg: 'bg-blue-50',    text: 'text-blue-600',    dot: 'bg-blue-400',    label: 'Processing' },
    completed:  { bg: 'bg-green-50',   text: 'text-green-600',   dot: 'bg-green-400',   label: 'Completed' },
    cancelled:  { bg: 'bg-red-50',     text: 'text-red-500',     dot: 'bg-red-400',     label: 'Cancelled' },
};

const methodEmoji = { cash: '💵', gcash: '📱', card: '💳' };

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/orders').then(r => { setOrders(r.data); setLoading(false); });
    }, []);

    if (loading) return (
        <div className="max-w-3xl mx-auto px-5 py-20 flex flex-col gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto px-5 py-10">
            <div className="mb-8">
                <p className="text-xs text-pink-400 font-semibold uppercase tracking-widest mb-1">History</p>
                <h1 className="text-3xl font-bold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>My Orders</h1>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-pink-50">
                    <Package size={48} className="text-pink-200 mx-auto mb-4" />
                    <p className="text-stone-400 mb-2">No orders yet</p>
                    <Link to="/products" className="text-pink-500 font-medium hover:text-pink-600 text-sm">Start shopping →</Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map(order => {
                        const s = statusStyle[order.status] || statusStyle.pending;
                        return (
                            <div key={order.id} className="bg-white rounded-2xl border border-pink-50 shadow-sm overflow-hidden animate-fade-up">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-pink-50">
                                    <div>
                                        <span className="text-xs text-stone-400">Order</span>
                                        <span className="text-sm font-bold text-stone-700 ml-1">#{order.id}</span>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${s.bg} ${s.text}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                        {s.label}
                                    </span>
                                </div>
                                <div className="px-5 py-3">
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-dashed border-pink-50 last:border-0">
                                            <span className="text-stone-600">{item.product.name} <span className="text-stone-400">×{item.quantity}</span></span>
                                            <span className="text-stone-600">₱{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between px-5 py-4 bg-pink-50/40">
                                    <div className="flex items-center gap-1.5 text-xs text-stone-400">
                                        <span>{methodEmoji[order.payment?.method]}</span>
                                        <span className="capitalize">{order.payment?.method}</span>
                                        <span className="text-stone-300">·</span>
                                        <span className="capitalize">{order.payment?.status}</span>
                                    </div>
                                    <span className="font-bold text-pink-500">₱{Number(order.total_amount).toLocaleString()}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
