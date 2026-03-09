import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingBag, Users, LogOut, Menu, X, Store, ChevronRight } from 'lucide-react';
import { clearAuth, getUser } from '../../lib/auth';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const nav = [
    { to: '/admin',             icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/orders',      icon: ShoppingBag,     label: 'Orders' },
    { to: '/admin/products',    icon: Package,         label: 'Products' },
    { to: '/admin/categories',  icon: Tag,             label: 'Categories' },
    { to: '/admin/users',       icon: Users,           label: 'Users' },
];

function SidebarContent({ onClose }) {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getUser();

    const logout = async () => {
        await api.post('/logout').catch(() => {});
        clearAuth();
        toast.success('Logged out');
        navigate('/login');
    };

    return (
        <div className="flex flex-col h-full">
            <div className="px-6 py-5 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">ShopEase</p>
                        <h1 className="text-white font-bold text-lg leading-tight">Admin Panel</h1>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="text-slate-400 hover:text-white md:hidden">
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            <nav className="flex-1 px-3 py-5 space-y-0.5">
                {nav.map(({ to, icon: Icon, label }) => {
                    const active = location.pathname === to;
                    return (
                        <Link key={to} to={to} onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                                active
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                            }`}>
                            <Icon size={16} className={active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                            {label}
                            {active && <ChevronRight size={14} className="ml-auto text-indigo-300" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-3 py-4 border-t border-slate-700/50 space-y-1">
                <div className="px-3 py-2 mb-2">
                    <p className="text-xs text-slate-500">Logged in as</p>
                    <p className="text-sm text-slate-300 font-medium truncate">{user?.name}</p>
                </div>
                <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-700/50 hover:text-white transition">
                    <Store size={16} /> View Store
                </Link>
                <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition">
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Desktop sidebar */}
            <aside className="hidden md:flex flex-col w-60 bg-slate-900 min-h-screen fixed top-0 left-0 z-30">
                <SidebarContent />
            </aside>

            {/* Mobile drawer */}
            {open && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
                    <aside className="relative w-60 bg-slate-900 h-full">
                        <SidebarContent onClose={() => setOpen(false)} />
                    </aside>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
                {/* Mobile top bar */}
                <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
                    <button onClick={() => setOpen(true)} className="text-slate-600">
                        <Menu size={20} />
                    </button>
                    <span className="font-bold text-slate-800">Admin Panel</span>
                </header>

                <main className="flex-1 p-6 max-w-6xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
