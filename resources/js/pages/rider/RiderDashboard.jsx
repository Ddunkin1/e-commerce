import React, { useEffect, useState } from 'react';
import { MapPin, Package, CheckCircle2, Truck, Clock, ChevronDown, ChevronUp, History } from 'lucide-react';
import RiderLayout from './RiderLayout';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const deliveryBadge = {
    assigned:  { label: 'Assigned',   bg: 'bg-blue-100 text-blue-700' },
    picked_up: { label: 'Picked Up',  bg: 'bg-amber-100 text-amber-700' },
    delivered: { label: 'Delivered',  bg: 'bg-emerald-100 text-emerald-700' },
};

function OrderCard({ order, onUpdate, active }) {
    const [expanded, setExpanded] = useState(active);
    const [loading, setLoading] = useState(false);

    const updateStatus = async (status) => {
        setLoading(true);
        try {
            await api.patch(`/rider/orders/${order.id}/delivery-status`, { delivery_status: status });
            toast.success(status === 'picked_up' ? 'Marked as Picked Up!' : 'Order Delivered!');
            onUpdate();
        } catch {
            toast.error('Failed to update');
        } finally {
            setLoading(false);
        }
    };

    const badge = deliveryBadge[order.delivery_status] || deliveryBadge.assigned;
    const methodEmoji = { cash: '💵', gcash: '📱', card: '💳' };

    return (
        <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition ${active ? 'border-emerald-200 shadow-emerald-100' : 'border-slate-100'}`}>
            {active && (
                <div className="bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 flex items-center gap-1.5">
                    <Truck size={12} /> ACTIVE DELIVERY
                </div>
            )}
            <div className="px-4 pt-4 pb-3">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Order</p>
                        <p className="text-xl font-bold text-slate-800">#{order.id}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.bg}`}>{badge.label}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">
                        {order.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium">{order.user?.name}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-400">{methodEmoji[order.payment?.method]} {order.payment?.method}</span>
                </div>

                <div className="flex items-start gap-2 text-sm bg-slate-50 rounded-xl px-3 py-2.5 mb-3">
                    <MapPin size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-slate-600 text-xs leading-relaxed">{order.shipping_address}</p>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-800">₱{Number(order.total_amount).toLocaleString()}</p>
                    <button onClick={() => setExpanded(!expanded)} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
                        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                    </button>
                </div>

                {expanded && (
                    <div className="mt-3 border-t border-slate-100 pt-3 space-y-1.5">
                        {order.items?.map(item => (
                            <div key={item.id} className="flex justify-between text-xs text-slate-500">
                                <span>{item.product?.name} × {item.quantity}</span>
                                <span className="font-medium text-slate-700">₱{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="px-4 pb-4 flex gap-2">
                {order.delivery_status === 'assigned' && (
                    <button disabled={loading} onClick={() => updateStatus('picked_up')}
                        className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-sm transition disabled:opacity-60 shadow-sm">
                        <Package size={16} />
                        {loading ? 'Updating...' : 'Mark as Picked Up'}
                    </button>
                )}
                {order.delivery_status === 'picked_up' && (
                    <button disabled={loading} onClick={() => updateStatus('delivered')}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition disabled:opacity-60 shadow-sm">
                        <CheckCircle2 size={16} />
                        {loading ? 'Updating...' : 'Mark as Delivered'}
                    </button>
                )}
            </div>
        </div>
    );
}

function HistoryCard({ order }) {
    return (
        <div className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center justify-between">
            <div>
                <p className="font-bold text-slate-700 text-sm">#{order.id}</p>
                <p className="text-xs text-slate-400">{order.user?.name} · {order.shipping_address?.slice(0, 30)}...</p>
            </div>
            <div className="text-right">
                <p className="text-sm font-bold text-slate-700">₱{Number(order.total_amount).toLocaleString()}</p>
                <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Delivered</span>
            </div>
        </div>
    );
}

export default function RiderDashboard() {
    const [orders, setOrders] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('active');

    const load = async () => {
        setLoading(true);
        try {
            const [activeRes, histRes] = await Promise.all([
                api.get('/rider/orders'),
                api.get('/rider/history'),
            ]);
            setOrders(activeRes.data);
            setHistory(histRes.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const activeOrder = orders.find(o => o.delivery_status === 'picked_up');
    const queuedOrders = orders.filter(o => o.delivery_status === 'assigned');

    return (
        <RiderLayout>
            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-white rounded-2xl border border-slate-100 p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-emerald-600">{orders.length}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Active</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-amber-500">{activeOrder ? 1 : 0}</p>
                    <p className="text-xs text-slate-400 mt-0.5">In Transit</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-slate-700">{history.length}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Delivered</p>
                </div>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-5">
                <button onClick={() => setTab('active')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${tab === 'active' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
                    Active Orders
                </button>
                <button onClick={() => setTab('history')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${tab === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
                    <History size={12} /> History
                </button>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2].map(i => <div key={i} className="h-44 bg-white rounded-2xl animate-pulse border border-slate-100" />)}
                </div>
            ) : tab === 'active' ? (
                <div className="space-y-4">
                    {activeOrder && (
                        <OrderCard key={activeOrder.id} order={activeOrder} onUpdate={load} active={true} />
                    )}
                    {queuedOrders.length > 0 && (
                        <>
                            {queuedOrders.length > 0 && (
                                <div className="flex items-center gap-2 mt-2">
                                    <Clock size={13} className="text-slate-400" />
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Queue ({queuedOrders.length})</p>
                                </div>
                            )}
                            {queuedOrders.map(order => (
                                <OrderCard key={order.id} order={order} onUpdate={load} active={false} />
                            ))}
                        </>
                    )}
                    {orders.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Truck size={24} className="text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-medium">No active deliveries</p>
                            <p className="text-slate-300 text-sm mt-1">You'll see orders here once assigned</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-2">
                    {history.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-slate-400 font-medium">No deliveries yet</p>
                        </div>
                    ) : (
                        history.map(order => <HistoryCard key={order.id} order={order} />)
                    )}
                </div>
            )}
        </RiderLayout>
    );
}
