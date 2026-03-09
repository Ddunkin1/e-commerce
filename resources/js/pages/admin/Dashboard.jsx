import React, { useEffect, useState } from 'react';
import { Package, ShoppingBag, Users, TrendingUp, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../lib/axios';

const statusBadge = {
    pending:    'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    completed:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-600',
};

export default function Dashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/admin/stats').then(r => setStats(r.data));
    }, []);

    const cards = stats ? [
        { label: 'Total Revenue',   value: `₱${Number(stats.total_revenue).toLocaleString()}`,  icon: TrendingUp,  color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Total Orders',    value: stats.total_orders,   icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Total Products',  value: stats.total_products, icon: Package,     color: 'text-violet-600',  bg: 'bg-violet-50' },
        { label: 'Total Users',     value: stats.total_users,    icon: Users,       color: 'text-sky-600',     bg: 'bg-sky-50' },
    ] : [];

    return (
        <AdminLayout>
            <div className="mb-7">
                <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-slate-500 text-sm mt-0.5">Welcome back. Here's what's happening.</p>
            </div>

            {/* Stat cards */}
            {!stats ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
                    {cards.map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                                <Icon size={18} className={color} />
                            </div>
                            <p className="text-2xl font-bold text-slate-800">{value}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>
            )}

            {stats?.pending_orders > 0 && (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-7">
                    <Clock size={16} className="text-amber-500 flex-shrink-0" />
                    <p className="text-sm text-amber-700 font-medium">
                        {stats.pending_orders} pending {stats.pending_orders === 1 ? 'order' : 'orders'} waiting for action.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-800 text-sm">Recent Orders</h2>
                        <a href="/admin/orders" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">View all →</a>
                    </div>
                    {!stats ? (
                        <div className="p-5 space-y-3">
                            {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />)}
                        </div>
                    ) : stats.recent_orders?.length === 0 ? (
                        <p className="text-center text-slate-400 py-10 text-sm">No orders yet</p>
                    ) : (
                        <table className="w-full text-sm">
                            <tbody>
                                {stats.recent_orders?.map(order => (
                                    <tr key={order.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                        <td className="px-5 py-3">
                                            <span className="font-medium text-slate-700">#{order.id}</span>
                                            <p className="text-xs text-slate-400">{order.user?.name}</p>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right font-semibold text-slate-700">
                                            ₱{Number(order.total_amount).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Low Stock */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                        <AlertTriangle size={15} className="text-amber-500" />
                        <h2 className="font-semibold text-slate-800 text-sm">Low Stock Alerts</h2>
                    </div>
                    {!stats ? (
                        <div className="p-5 space-y-3">
                            {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />)}
                        </div>
                    ) : stats.low_stock?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2">
                            <CheckCircle size={28} className="text-emerald-400" />
                            <p className="text-slate-400 text-sm">All products well stocked</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <tbody>
                                {stats.low_stock?.map(p => (
                                    <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                        <td className="px-5 py-3">
                                            <span className="font-medium text-slate-700">{p.name}</span>
                                            <p className="text-xs text-slate-400">{p.category?.name}</p>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
                                                {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
