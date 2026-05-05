import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import api from '../lib/axios';
import { isLoggedIn } from '../lib/auth';

const features = [
    { icon: Truck, label: 'Free Delivery', sub: 'On orders over ₱999' },
    { icon: RotateCcw, label: 'Easy Returns', sub: '7-day return policy' },
    { icon: ShieldCheck, label: 'Secure Payment', sub: '100% protected' },
    { icon: Sparkles, label: 'Best Quality', sub: 'Curated products' },
];

const CATEGORY_COLORS = [
    'from-pink-100 to-rose-100 text-pink-600',
    'from-violet-100 to-purple-100 text-violet-600',
    'from-sky-100 to-blue-100 text-sky-600',
    'from-amber-100 to-yellow-100 text-amber-600',
    'from-emerald-100 to-green-100 text-emerald-600',
    'from-orange-100 to-red-100 text-orange-600',
];

export default function Home() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        api.get('/categories').then(r => setCategories(Array.isArray(r.data) ? r.data : []));
    }, []);

    return (
        <div>
            {/* Hero */}
            <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fce7f3 50%, #fdf4ff 100%)' }}>
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f9a8d4 0%, transparent 50%), radial-gradient(circle at 80% 20%, #e879f9 0%, transparent 40%)' }} />
                <div className="relative max-w-6xl mx-auto px-5 py-24 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                        <span className="inline-block bg-pink-100 text-pink-500 text-xs font-semibold px-3 py-1 rounded-full mb-4">✨ New Arrivals are here</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-stone-800 leading-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Shop What You<br />
                            <span className="text-pink-500">Love</span>
                        </h1>
                        <p className="text-stone-500 mb-8 max-w-md">Discover curated products that bring joy to your everyday life. From fashion to home essentials — all in one place.</p>
                        <div className="flex gap-3 justify-center md:justify-start">
                            <Link to="/products" className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-7 py-3 rounded-full shadow-lg shadow-pink-200 transition">
                                Shop Now
                            </Link>
                            {!isLoggedIn() && (
                                <Link to="/register" className="border border-pink-300 text-pink-500 font-semibold px-7 py-3 rounded-full hover:bg-pink-50 transition">
                                    Join Us
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="relative w-64 h-64 md:w-80 md:h-80">
                            <div className="absolute inset-0 bg-pink-200 rounded-full opacity-20 animate-pulse" />
                            <div className="absolute inset-8 bg-pink-300 rounded-full opacity-20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-9xl">🛍️</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-white border-y border-pink-50">
                <div className="max-w-6xl mx-auto px-5 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {features.map(({ icon: Icon, label, sub }) => (
                        <div key={label} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Icon size={18} className="text-pink-400" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-stone-700">{label}</p>
                                <p className="text-xs text-stone-400">{sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="max-w-6xl mx-auto px-5 py-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-xs text-pink-400 font-semibold uppercase tracking-widest mb-1">Browse by</p>
                            <h2 className="text-2xl font-bold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>Categories</h2>
                        </div>
                        <Link to="/products" className="text-sm text-pink-500 hover:text-pink-600 font-medium">View all →</Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {categories.map((cat, i) => (
                            <Link
                                key={cat.id}
                                to={`/products?category=${cat.id}`}
                                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} hover:scale-105 transition-transform duration-200 font-semibold text-sm text-center`}
                            >
                                <span className="text-2xl">🏷️</span>
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* CTA Banner — only for guests */}
            {!isLoggedIn() && (
                <section className="max-w-6xl mx-auto px-5 pb-14">
                    <div className="rounded-3xl p-10 text-center text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)' }}>
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 0%, transparent 60%)' }} />
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 relative" style={{ fontFamily: 'Playfair Display, serif' }}>Ready to start shopping?</h2>
                        <p className="text-pink-100 mb-6 relative">Create an account and get access to exclusive deals.</p>
                        <Link to="/register" className="bg-white text-pink-500 font-semibold px-7 py-3 rounded-full hover:bg-pink-50 transition shadow-lg relative">
                            Create Account
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}
