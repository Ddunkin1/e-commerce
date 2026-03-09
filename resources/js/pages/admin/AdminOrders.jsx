import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const STATUSES = ['all', 'pending', 'processing', 'completed', 'cancelled'];
const statusBadge = {
    pending:    'bg-yellow-100 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-100 text-blue-700 border-blue-200',
    completed:  'bg-green-100 text-green-700 border-green-200',
    cancelled:  'bg-red-100 text-red-600 border-red-200',
};
const methodEmoji = { cash: '💵', gcash: '📱', card: '💳' };

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [expanded, setExpanded] = useState(null);

    const load = (status) => {
        setLoading(true);
        const params = status !== 'all' ? `?status=${status}` : '';
        api.get(`/admin/orders${params}`).then(r => { setOrders(r.data); setLoading(false); });
    };

    useEffect(() => { load(filter); }, [filter]);

    const updateStatus = async (orderId, status) => {
        await api.patch(`/admin/orders/${orderId}/status`, { status });
        toast.success(`Order #${orderId} → ${status}`);
        load(filter);
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
                    <p className="text-slate-500 text-sm mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
                {STATUSES.map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${filter === s ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        {s}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                    <p className="text-slate-400">No orders found</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Order</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Customer</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Payment</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Total</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Status</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <React.Fragment key={order.id}>
                                    <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                                        <td className="px-5 py-3 font-semibold text-slate-700">#{order.id}</td>
                                        <td className="px-5 py-3 text-slate-600">{order.user?.name}</td>
                                        <td className="px-5 py-3 text-slate-500">
                                            {methodEmoji[order.payment?.method]} <span className="capitalize">{order.payment?.method}</span>
                                        </td>
                                        <td className="px-5 py-3 font-semibold text-slate-700">₱{Number(order.total_amount).toLocaleString()}</td>
                                        <td className="px-5 py-3">
                                            <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                                                className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${statusBadge[order.status]}`}>
                                                {STATUSES.filter(s => s !== 'all').map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-5 py-3">
                                            <button onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                                                className="text-slate-400 hover:text-slate-600 transition">
                                                {expanded === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                        </td>
                                    </tr>
                                    {expanded === order.id && (
                                        <tr className="bg-slate-50/60">
                                            <td colSpan={6} className="px-5 py-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Items</p>
                                                        {order.items?.map(item => (
                                                            <div key={item.id} className="flex justify-between text-xs text-slate-600 py-1 border-b border-slate-100 last:border-0">
                                                                <span>{item.product?.name} × {item.quantity}</span>
                                                                <span className="font-medium">₱{(item.price * item.quantity).toLocaleString()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Shipping</p>
                                                        <p className="text-xs text-slate-600">{order.shipping_address}</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
