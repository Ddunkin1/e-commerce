import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-pink-100 mt-16">
            <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <div className="flex items-center gap-1.5 mb-3">
                        <Heart size={16} className="text-pink-400 fill-pink-300" />
                        <span className="font-bold text-pink-500" style={{ fontFamily: 'Playfair Display, serif' }}>ShopEase</span>
                    </div>
                    <p className="text-sm text-stone-400">Your go-to online shop for everything cute and lovely.</p>
                </div>
                <div>
                    <p className="font-semibold text-stone-600 mb-3 text-sm">Quick Links</p>
                    <div className="flex flex-col gap-2">
                        <Link to="/" className="text-sm text-stone-400 hover:text-pink-500 transition">Home</Link>
                        <Link to="/products" className="text-sm text-stone-400 hover:text-pink-500 transition">Shop</Link>
                        <Link to="/orders" className="text-sm text-stone-400 hover:text-pink-500 transition">My Orders</Link>
                    </div>
                </div>
                <div>
                    <p className="font-semibold text-stone-600 mb-3 text-sm">Contact</p>
                    <p className="text-sm text-stone-400">shopease@example.com</p>
                    <p className="text-sm text-stone-400 mt-1">Philippines</p>
                </div>
            </div>
            <div className="border-t border-pink-50 py-4 text-center text-xs text-stone-300">
                © 2026 ShopEase. Made with <Heart size={10} className="inline fill-pink-300 text-pink-300 mx-0.5" /> for everyone.
            </div>
        </footer>
    );
}
