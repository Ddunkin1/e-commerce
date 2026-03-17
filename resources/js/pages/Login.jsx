import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, EyeOff } from 'lucide-react';
import api from '../lib/axios';
import { setAuth } from '../lib/auth';
import toast from 'react-hot-toast';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/login', form);
            setAuth(res.data.token, res.data.user);
            toast.success(`Welcome back, ${res.data.user.name}! 💕`);
            if (res.data.user.is_admin) navigate('/admin');
            else if (res.data.user.is_rider) navigate('/rider');
            else navigate('/');
        } catch {
            toast.error('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-5" style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf4ff 100%)' }}>
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-1.5 mb-4">
                        <Heart size={20} className="text-pink-400 fill-pink-300" />
                        <span className="text-xl font-bold text-pink-500" style={{ fontFamily: 'Playfair Display, serif' }}>ShopEase</span>
                    </div>
                    <h1 className="text-2xl font-bold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>Welcome back!</h1>
                    <p className="text-stone-400 text-sm mt-1">Sign in to continue shopping</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-pink-100 p-8 border border-pink-50">
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Email</label>
                            <input type="email" required placeholder="you@example.com"
                                className="w-full border border-pink-100 rounded-2xl px-4 py-3 text-sm text-stone-600 placeholder-stone-300 focus:outline-none focus:border-pink-300 bg-pink-50/30"
                                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Password</label>
                            <div className="relative">
                                <input type={showPw ? 'text' : 'password'} required placeholder="••••••••"
                                    className="w-full border border-pink-100 rounded-2xl px-4 py-3 pr-11 text-sm text-stone-600 placeholder-stone-300 focus:outline-none focus:border-pink-300 bg-pink-50/30"
                                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-pink-400 transition">
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button disabled={loading}
                            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-2xl shadow-md shadow-pink-200 transition mt-2 disabled:opacity-50">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-stone-400 mt-5">
                        No account? <Link to="/register" className="text-pink-500 font-medium hover:text-pink-600">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
