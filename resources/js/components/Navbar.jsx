import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, LogOut, User, Menu, X, Search } from 'lucide-react';
import { clearAuth, getUser, isLoggedIn, isAdmin } from '../lib/auth';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getUser();
    const [cartCount, setCartCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [searchQ, setSearchQ] = useState('');

    const submitSearch = (e) => {
        e.preventDefault();
        if (!searchQ.trim()) return;
        navigate(`/products?search=${encodeURIComponent(searchQ.trim())}`);
        setSearchQ('');
        setOpen(false);
    };

    useEffect(() => {
        if (isLoggedIn()) {
            api.get('/cart').then(r => setCartCount(r.data.items?.length || 0)).catch(() => {});
        }
    }, [location]);

    const logout = async () => {
        await api.post('/logout').catch(() => {});
        clearAuth();
        toast.success('See you soon! 👋');
        navigate('/login');
    };

    const link = (to, label) => (
        <Link
            to={to}
            onClick={() => setOpen(false)}
            className={`text-sm font-medium transition-colors hover:text-pink-500 ${location.pathname === to ? 'text-pink-500' : 'text-stone-500'}`}
        >
            {label}
        </Link>
    );

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-1.5">
                    <Heart size={18} className="text-pink-400 fill-pink-300" />
                    <span className="text-lg font-bold text-pink-500" style={{ fontFamily: 'Playfair Display, serif' }}>ShopEase</span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    {link('/', 'Home')}
                    {link('/products', 'Shop')}
                    {isLoggedIn() && link('/orders', 'My Orders')}
                </div>

                {/* Search */}
                <form onSubmit={submitSearch} className="hidden md:flex items-center bg-pink-50 rounded-full px-3 py-1.5 gap-2 w-44 focus-within:ring-2 focus-within:ring-pink-200 transition">
                    <Search size={14} className="text-pink-300 flex-shrink-0" />
                    <input
                        type="text"
                        value={searchQ}
                        onChange={e => setSearchQ(e.target.value)}
                        placeholder="Search..."
                        className="bg-transparent text-xs text-stone-600 placeholder-stone-300 focus:outline-none w-full"
                    />
                </form>

                <div className="hidden md:flex items-center gap-3">
                    {isLoggedIn() ? (
                        <>
                            <Link to="/wishlist" className="p-2 rounded-full hover:bg-pink-50 transition" title="Wishlist">
                                <Heart size={20} className="text-pink-400" />
                            </Link>
                            <Link to="/cart" className="relative p-2 rounded-full hover:bg-pink-50 transition">
                                <ShoppingBag size={20} className="text-pink-400" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-pink-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            {isAdmin() && (
                                <Link to="/admin" className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition">
                                    Admin Panel
                                </Link>
                            )}
                            <Link to="/profile" className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 rounded-full px-3 py-1.5 transition">
                                <User size={14} className="text-pink-400" />
                                <span className="text-xs font-medium text-pink-600">{user?.name?.split(' ')[0]}</span>
                            </Link>
                            <button onClick={logout} className="p-2 rounded-full hover:bg-red-50 transition">
                                <LogOut size={16} className="text-rose-400" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-stone-500 hover:text-pink-500 transition">Login</Link>
                            <Link to="/register" className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-4 py-2 rounded-full transition shadow-sm shadow-pink-200">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
                    {open ? <X size={20} className="text-pink-500" /> : <Menu size={20} className="text-pink-500" />}
                </button>
            </div>

            {open && (
                <div className="md:hidden px-5 pb-4 flex flex-col gap-3 border-t border-pink-50 pt-3">
                    {link('/', 'Home')}
                    {link('/products', 'Shop')}
                    {isLoggedIn() && link('/orders', 'My Orders')}
                    {isLoggedIn() && link('/wishlist', 'Wishlist')}
                    {isLoggedIn() && link('/cart', 'Cart')}
                    {isLoggedIn() && link('/profile', 'Profile')}
                    {isAdmin() && link('/admin', 'Admin Panel')}
                    {isLoggedIn()
                        ? <button onClick={logout} className="text-sm text-left text-rose-400">Logout</button>
                        : <Link to="/login" className="text-sm text-pink-500">Login / Register</Link>
                    }
                </div>
            )}
        </nav>
    );
}
