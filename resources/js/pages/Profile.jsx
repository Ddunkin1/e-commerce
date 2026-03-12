import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, Eye, EyeOff, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { setAuth, getUser } from '../lib/auth';
import toast from 'react-hot-toast';

export default function Profile() {
    const stored = getUser();
    const [form, setForm] = useState({ name: stored?.name || '', email: stored?.email || '' });
    const [pw, setPw] = useState({ current_password: '', password: '', password_confirmation: '' });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [savingInfo, setSavingInfo] = useState(false);
    const [savingPw, setSavingPw] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        api.get('/me').then(r => setForm({ name: r.data.name, email: r.data.email }));
        api.get('/orders').then(r => setOrders(r.data.slice(0, 3)));
    }, []);

    const saveInfo = async (e) => {
        e.preventDefault();
        setSavingInfo(true);
        try {
            const res = await api.patch('/profile', form);
            setAuth(null, res.data);
            toast.success('Profile updated!');
        } catch (err) {
            const msg = err.response?.data?.errors?.email?.[0] || err.response?.data?.message || 'Update failed';
            toast.error(msg);
        } finally {
            setSavingInfo(false);
        }
    };

    const savePw = async (e) => {
        e.preventDefault();
        if (pw.password !== pw.password_confirmation) { toast.error('Passwords do not match'); return; }
        setSavingPw(true);
        try {
            await api.patch('/profile', { ...form, ...pw });
            setPw({ current_password: '', password: '', password_confirmation: '' });
            toast.success('Password changed!');
        } catch (err) {
            const msg = err.response?.data?.errors?.current_password?.[0] || err.response?.data?.message || 'Failed';
            toast.error(msg);
        } finally {
            setSavingPw(false);
        }
    };

    const initials = form.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
    const statusColor = { pending: 'text-yellow-500', processing: 'text-blue-500', completed: 'text-green-500', cancelled: 'text-red-400' };

    const inputClass = "w-full border border-pink-100 rounded-2xl px-4 py-3 text-sm text-stone-600 placeholder-stone-300 focus:outline-none focus:border-pink-300 bg-pink-50/30";

    return (
        <div className="max-w-2xl mx-auto px-5 py-10">
            {/* Avatar + name */}
            <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-pink-200">
                    {initials}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>{form.name}</h1>
                    <p className="text-sm text-stone-400">{form.email}</p>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* Personal info */}
                <div className="bg-white rounded-3xl border border-pink-50 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-pink-50 flex items-center gap-2">
                        <User size={15} className="text-pink-400" />
                        <h2 className="font-semibold text-stone-700 text-sm">Personal Information</h2>
                    </div>
                    <form onSubmit={saveInfo} className="px-6 py-5 flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Full Name</label>
                            <input type="text" required className={inputClass} value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Email</label>
                            <input type="email" required className={inputClass} value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <button disabled={savingInfo}
                            className="self-end flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md shadow-pink-200 transition disabled:opacity-50">
                            <Save size={14} />
                            {savingInfo ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Change password */}
                <div className="bg-white rounded-3xl border border-pink-50 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-pink-50 flex items-center gap-2">
                        <Lock size={15} className="text-pink-400" />
                        <h2 className="font-semibold text-stone-700 text-sm">Change Password</h2>
                    </div>
                    <form onSubmit={savePw} className="px-6 py-5 flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Current Password</label>
                            <div className="relative">
                                <input type={showCurrent ? 'text' : 'password'} required placeholder="••••••••"
                                    className={`${inputClass} pr-11`} value={pw.current_password}
                                    onChange={e => setPw({ ...pw, current_password: e.target.value })} />
                                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-pink-400 transition">
                                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-stone-500 mb-1.5">New Password</label>
                            <div className="relative">
                                <input type={showNew ? 'text' : 'password'} required placeholder="••••••••" minLength={6}
                                    className={`${inputClass} pr-11`} value={pw.password}
                                    onChange={e => setPw({ ...pw, password: e.target.value })} />
                                <button type="button" onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-pink-400 transition">
                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Confirm New Password</label>
                            <input type="password" required placeholder="••••••••" minLength={6}
                                className={inputClass} value={pw.password_confirmation}
                                onChange={e => setPw({ ...pw, password_confirmation: e.target.value })} />
                        </div>
                        <button disabled={savingPw}
                            className="self-end flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md shadow-pink-200 transition disabled:opacity-50">
                            <Save size={14} />
                            {savingPw ? 'Saving...' : 'Update Password'}
                        </button>
                    </form>
                </div>

                {/* Recent orders */}
                {orders.length > 0 && (
                    <div className="bg-white rounded-3xl border border-pink-50 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-pink-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Package size={15} className="text-pink-400" />
                                <h2 className="font-semibold text-stone-700 text-sm">Recent Orders</h2>
                            </div>
                            <Link to="/orders" className="text-xs text-pink-500 hover:text-pink-600 font-medium">View all →</Link>
                        </div>
                        <div className="divide-y divide-pink-50">
                            {orders.map(o => (
                                <Link to={`/orders/${o.id}`} key={o.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-pink-50/40 transition">
                                    <div>
                                        <span className="text-sm font-medium text-stone-700">Order #{o.id}</span>
                                        <p className="text-xs text-stone-400 mt-0.5">{o.items?.length} item{o.items?.length !== 1 ? 's' : ''}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-pink-500">₱{Number(o.total_amount).toLocaleString()}</p>
                                        <p className={`text-xs font-medium capitalize ${statusColor[o.status] || 'text-stone-400'}`}>{o.status}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
