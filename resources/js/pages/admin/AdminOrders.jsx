import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const statuses = ['pending', 'processing', 'completed', 'cancelled'];
const statusStyle = {
    pending:    'bg-yellow-50 text-yellow-600 border-yellow-200',
    processing: 'bg-blue-50 text-blue-600 border-blue-200',
    completed:  'bg-green-50 text-green-600 border-green-200',
    cancelled:  'bg-red-50 text-red-500 border-red-200',
};
const methodEmoji = { cash: '💵', gcash: '📱', card: '💳' };

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    const load = () => api.get('/admin/orders').then(r => { setOrders(r.data); setLoading(false); });
    useEffect(() => { load(); }, []);

    const updateStatus = async (orderId, status) => {
        await api.patch(`/admin/orders/${orderId}/status`, { status });
        toast.success(`Order #${orderId} marked as ${status}`);
        load();
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <p className="text-xs text-pink-400 font-semibold uppercase tracking-widest mb-1">Manage</p>
                <h1 className="text-2xl font-bold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>All Orders</h1>
            </div>

            {loading ? (
                <div className="flex flex-col gap-3">
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-pink-50">
                    <p className="text-stone-400">No orders yet</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-2xl border border-pink-50 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-4 px-5 py-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="font-bold text-stone-700 text-sm">Order #{order.id}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyle[order.status]}`}>{order.status}</span>
                                    </div>
                                    <p className="text-xs text-stone-400">{order.user?.name} · {methodEmoji[order.payment?.method]} {order.payment?.method}</p>
                                </div>
                                <span className="font-bold text-pink-500 text-sm">₱{Number(order.total_amount).toLocaleString()}</span>
                                <select
                                    value={order.status}
                                    onChange={e => updateStatus(order.id, e.target.value)}
                                    className="border border-pink-100 rounded-xl px-2 py-1.5 text-xs text-stone-600 focus:outline-none focus:border-pink-300 bg-pink-50/30"
                                >
                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <button onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                                    className="text-xs text-pink-400 hover:text-pink-600 font-medium whitespace-nowrap">
                                    {expanded === order.id ? 'Hide' : 'View'}
                                </button>
                            </div>

                            {expanded === order.id && (
                                <div className="border-t border-pink-50 px-5 py-4 bg-pink-50/20">
                                    <p className="text-xs font-semibold text-stone-500 mb-2">Items</p>
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex justify-between text-xs text-stone-600 py-1 border-b border-dashed border-pink-100 last:border-0">
                                            <span>{item.product?.name} × {item.quantity}</span>
                                            <span>₱{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <p className="text-xs text-stone-400 mt-3">📍 {order.shipping_address}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
