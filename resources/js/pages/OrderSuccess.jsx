import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Package } from 'lucide-react';
import api from '../lib/axios';

const methodEmoji = { cash: '💵', gcash: '📱', card: '💳' };

export default function OrderSuccess() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        api.get(`/orders/${id}`).then(r => setOrder(r.data)).catch(() => {});
    }, [id]);

    return (
        <div className="max-w-lg mx-auto px-5 py-16 text-center">
            {/* Icon */}
            <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center shadow-lg shadow-green-100">
                    <CheckCircle2 size={52} className="text-green-500" />
                </div>
            </div>

            <h1 className="text-3xl font-bold text-stone-800 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Order Placed!
            </h1>
            <p className="text-stone-400 mb-1">Thank you for shopping with us.</p>
            {id && <p className="text-sm text-stone-400 mb-8">Order <span className="font-semibold text-stone-600">#{id}</span></p>}

            {/* Order summary */}
            {order && (
                <div className="bg-white rounded-3xl border border-pink-50 shadow-sm overflow-hidden mb-8 text-left">
                    <div className="px-6 py-4 border-b border-pink-50 flex items-center justify-between">
                        <h2 className="font-semibold text-stone-700 text-sm">Order Summary</h2>
                        {order.payment && (
                            <span className="text-xs text-stone-400">
                                {methodEmoji[order.payment.method]} {order.payment.method}
                            </span>
                        )}
                    </div>

                    <div className="divide-y divide-pink-50">
                        {order.items?.map(item => (
                            <div key={item.id} className="flex items-center gap-3 px-6 py-3.5">
                                <div className="w-10 h-10 rounded-xl bg-pink-50 overflow-hidden flex-shrink-0">
                                    {item.product?.image
                                        ? <img src={item.product.image} className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={16} className="text-pink-200" /></div>
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-stone-700 truncate">{item.product?.name}</p>
                                    <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-semibold text-stone-700">₱{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    <div className="px-6 py-4 bg-pink-50/40 flex items-center justify-between">
                        <span className="font-bold text-stone-700">Total</span>
                        <span className="font-bold text-pink-500 text-lg">₱{Number(order.total_amount).toLocaleString()}</span>
                    </div>
                </div>
            )}

            {/* Estimated delivery note */}
            <div className="flex items-center justify-center gap-2 text-sm text-stone-400 mb-8">
                <Package size={16} className="text-pink-300" />
                <span>Estimated delivery: <span className="font-medium text-stone-600">3–5 business days</span></span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Link to="/orders" className="flex-1 border-2 border-pink-500 text-pink-500 hover:bg-pink-50 font-semibold py-3 rounded-2xl transition text-sm">
                    View My Orders
                </Link>
                <Link to="/products" className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-2xl shadow-md shadow-pink-200 transition text-sm">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}
