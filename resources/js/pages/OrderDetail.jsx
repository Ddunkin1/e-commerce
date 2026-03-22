import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, ShoppingBag, CheckCircle2, Clock, Truck, PackageCheck, Bike, XCircle } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const STEPS = [
    { key: 'placed',     label: 'Order Placed',    icon: Clock },
    { key: 'processing', label: 'Processing',       icon: PackageCheck },
    { key: 'assigned',   label: 'Rider Assigned',   icon: Bike },
    { key: 'picked_up',  label: 'Out for Delivery', icon: Truck },
    { key: 'delivered',  label: 'Delivered',        icon: CheckCircle2 },
];

function getStepIndex(order) {
    if (order.status === 'cancelled') return -1;
    if (order.status === 'completed' || order.delivery_status === 'delivered') return 4;
    if (order.delivery_status === 'picked_up') return 3;
    if (order.delivery_status === 'assigned') return 2;
    if (order.status === 'processing') return 1;
    return 0;
}

const methodEmoji = { cash: '💵', gcash: '📱', card: '💳' };
const methodLabel = { cash: 'Cash on Delivery', gcash: 'GCash', card: 'Credit / Debit Card' };

const statusBadge = {
    pending:    'bg-yellow-50 text-yellow-600',
    processing: 'bg-blue-50 text-blue-600',
    completed:  'bg-green-50 text-green-600',
    cancelled:  'bg-red-50 text-red-500',
};

export default function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    const load = () => api.get(`/orders/${id}`).then(r => setOrder(r.data));

    useEffect(() => { load(); }, [id]);

    const cancelOrder = async () => {
        if (!confirm('Cancel this order?')) return;
        setCancelling(true);
        try {
            await api.patch(`/orders/${id}/cancel`);
            toast.success('Order cancelled');
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not cancel order');
        } finally {
            setCancelling(false);
        }
    };

    if (!order) return (
        <div className="max-w-2xl mx-auto px-5 py-20 flex flex-col gap-4">
            <div className="skeleton h-8 w-48 rounded-xl" />
            <div className="skeleton h-32 rounded-2xl" />
            <div className="skeleton h-48 rounded-2xl" />
        </div>
    );

    const stepIndex = getStepIndex(order);
    const cancelled = order.status === 'cancelled';
    const canCancel = order.status === 'pending';

    return (
        <div className="max-w-2xl mx-auto px-5 py-10">
            <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-pink-500 mb-8 transition">
                <ArrowLeft size={16} /> Back to Orders
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-xs text-stone-400 mb-1">Order</p>
                    <h1 className="text-2xl font-bold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>#{order.id}</h1>
                    <p className="text-xs text-stone-400 mt-1">{new Date(order.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${statusBadge[order.status] || 'bg-stone-100 text-stone-500'}`}>
                        {order.status}
                    </span>
                    {canCancel && (
                        <button onClick={cancelOrder} disabled={cancelling}
                            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 font-medium transition disabled:opacity-50">
                            <XCircle size={13} />
                            {cancelling ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                    )}
                </div>
            </div>

            {/* Delivery tracker */}
            {!cancelled ? (
                <div className="bg-white rounded-3xl border border-pink-50 shadow-sm p-6 mb-5">
                    <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-5">Delivery Status</h2>
                    <div className="flex items-start justify-between relative">
                        <div className="absolute left-5 right-5 top-5 h-0.5 bg-pink-100" />
                        <div
                            className="absolute left-5 top-5 h-0.5 bg-pink-400 transition-all duration-700"
                            style={{ width: stepIndex <= 0 ? 0 : `${(stepIndex / (STEPS.length - 1)) * 90}%` }}
                        />
                        {STEPS.map((step, i) => {
                            const done = i <= stepIndex;
                            const Icon = step.icon;
                            return (
                                <div key={step.key} className="flex flex-col items-center gap-2 relative z-10 w-16">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${done ? 'bg-pink-500 border-pink-500 shadow-md shadow-pink-200' : 'bg-white border-pink-100'}`}>
                                        <Icon size={15} className={done ? 'text-white' : 'text-stone-300'} />
                                    </div>
                                    <span className={`text-[10px] font-medium text-center leading-tight ${done ? 'text-pink-500' : 'text-stone-400'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Rider info */}
                    {order.rider && (
                        <div className="mt-5 pt-4 border-t border-pink-50 flex items-center gap-3">
                            <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bike size={15} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs text-stone-400">Your Rider</p>
                                <p className="text-sm font-semibold text-stone-700">{order.rider.name}</p>
                            </div>
                            <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                                order.delivery_status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                                order.delivery_status === 'picked_up' ? 'bg-amber-100 text-amber-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                                {order.delivery_status?.replace('_', ' ')}
                            </span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 mb-5 text-sm text-red-500 font-medium flex items-center gap-2">
                    <XCircle size={16} /> This order has been cancelled.
                </div>
            )}

            {/* Items */}
            <div className="bg-white rounded-3xl border border-pink-50 shadow-sm overflow-hidden mb-5">
                <div className="px-6 py-4 border-b border-pink-50">
                    <h2 className="font-semibold text-stone-700 text-sm">Items Ordered</h2>
                </div>
                <div className="divide-y divide-pink-50">
                    {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 overflow-hidden flex-shrink-0">
                                {item.product?.image
                                    ? <img src={item.product.image} className="w-full h-full object-cover" alt={item.product.name} />
                                    : <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={20} className="text-pink-200" /></div>
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-stone-700 truncate">{item.product?.name}</p>
                                <p className="text-xs text-stone-400 mt-0.5">Qty: {item.quantity} · ₱{Number(item.price).toLocaleString()} each</p>
                            </div>
                            <p className="font-bold text-stone-700 text-sm flex-shrink-0">₱{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-3xl border border-pink-50 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-pink-50">
                    <h2 className="font-semibold text-stone-700 text-sm">Order Details</h2>
                </div>
                <div className="px-6 py-5 flex flex-col gap-3">
                    {order.shipping_address && (
                        <div className="flex items-start gap-3 pb-3 border-b border-dashed border-pink-100">
                            <MapPin size={15} className="text-pink-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-stone-500 mb-0.5">Shipping Address</p>
                                <p className="text-sm text-stone-600">{order.shipping_address}</p>
                            </div>
                        </div>
                    )}
                    {order.payment && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-stone-500">Payment</span>
                            <span className="font-medium text-stone-700">
                                {methodEmoji[order.payment.method]} {methodLabel[order.payment.method] || order.payment.method}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-stone-500">Subtotal</span>
                        <span className="font-medium text-stone-700">₱{Number(order.total_amount).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-stone-500">Shipping</span>
                        <span className={Number(order.total_amount) >= 999 ? 'text-green-500 font-medium' : 'font-medium text-stone-700'}>
                            {Number(order.total_amount) >= 999 ? 'Free' : '₱99'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-dashed border-pink-100 pt-3">
                        <span className="font-bold text-stone-700">Total</span>
                        <span className="font-bold text-pink-500 text-lg">₱{Number(order.total_amount).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
