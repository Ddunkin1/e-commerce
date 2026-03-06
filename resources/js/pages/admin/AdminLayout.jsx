import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingBag, LogOut, Menu, X, Heart } from 'lucide-react';
import { clearAuth } from '../../lib/auth';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const nav = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/categories', icon: Tag, label: 'Categories' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
];

export default function AdminLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const logout = async () => {
        await api.post('/logout').catch(() => {});
        clearAuth();
        toast.success('Logged out');
        navigate('/login');
    };

    const Sidebar = () => (
        <aside className="w-56 bg-white border-r border-pink-100 flex flex-col min-h-screen">
            <div className="flex items-center gap-2 px-5 py-5 border-b border-pink-50">
                <Heart size={16} className="text-pink-400 fill-pink-300" />
                <span className="font-bold text-pink-500 text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>ShopEase Admin</span>
            </div>
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                {nav.map(({ to, icon: Icon, label }) => {
                    const active = location.pathname === to;
                    return (
                        <Link key={to} to={to}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-pink-500 text-white shadow-sm shadow-pink-200' : 'text-stone-500 hover:bg-pink-50 hover:text-pink-500'}`}>
                            <Icon size={16} />
                            {label}
                        </Link>
                    );
                })}
            </nav>
            <div className="px-3 py-4 border-t border-pink-50">
                <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-400 hover:bg-pink-50 hover:text-pink-500 transition mb-1">
                    ← Back to Store
                </Link>
                <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-red-50 transition">
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </aside>
    );

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#fff8fa' }}>
            <div className="hidden md:flex">
                <Sidebar />
            </div>
            <div className="flex-1 flex flex-col">
                <header className="md:hidden bg-white border-b border-pink-100 px-4 py-3 flex justify-between items-center">
                    <span className="font-bold text-pink-500 text-sm">ShopEase Admin</span>
                    <button onClick={() => setOpen(!open)}>{open ? <X size={20} className="text-pink-500" /> : <Menu size={20} className="text-pink-500" />}</button>
                </header>
                {open && <div className="md:hidden fixed inset-0 z-50 bg-white"><Sidebar /></div>}
                <main className="flex-1 p-6 max-w-5xl w-full mx-auto">{children}</main>
            </div>
        </div>
    );
}
