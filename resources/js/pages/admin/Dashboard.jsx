import React, { useEffect, useState } from 'react';
import { Package, ShoppingBag, Users, TrendingUp, Clock } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../lib/axios';

export default function Dashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/admin/stats').then(r => setStats(r.data));
    }, []);

    const cards = stats ? [
        { label: 'Total Revenue', value: `₱${Number(stats.total_revenue).toLocaleString()}`, icon: TrendingUp, color: 'bg-pink-500', light: 'bg-pink-50', text: 'text-pink-500' },
        { label: 'Total Orders', value: stats.total_orders, icon: ShoppingBag, color: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-500' },
        { label: 'Total Products', value: stats.total_products, icon: Package, color: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-500' },
        { label: 'Total Users', value: stats.total_users, icon: Users, color: 'bg-fuchsia-500', light: 'bg-fuchsia-50', text: 'text-fuchsia-500' },
    ] : [];

    return (
        <AdminLayout>
            <div className="mb-8">
                <p className="text-xs text-pink-400 font-semibold uppercase tracking-widest mb-1">Overview</p>
                <h1 className="text-2xl font-bold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>Dashboard</h1>
            </div>

            {!stats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {cards.map(({ label, value, icon: Icon, light, text }) => (
                        <div key={label} className="bg-white rounded-2xl p-5 border border-pink-50 shadow-sm">
                            <div className={`w-10 h-10 ${light} rounded-xl flex items-center justify-center mb-3`}>
                                <Icon size={18} className={text} />
                            </div>
                            <p className="text-xl font-bold text-stone-800">{value}</p>
                            <p className="text-xs text-stone-400 mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>
            )}

            {stats?.pending_orders > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-3">
                    <Clock size={18} className="text-yellow-500 flex-shrink-0" />
                    <p className="text-sm text-yellow-700 font-medium">
                        You have <span className="font-bold">{stats.pending_orders}</span> pending {stats.pending_orders === 1 ? 'order' : 'orders'} waiting for action.
                    </p>
                </div>
            )}
        </AdminLayout>
    );
}
