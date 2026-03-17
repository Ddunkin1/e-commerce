import React, { useEffect, useState } from 'react';
import { Plus, Bike, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

function CreateRiderModal({ onClose, onCreated }) {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/admin/riders', form);
            toast.success('Rider account created');
            onCreated();
            onClose();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to create rider';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-slate-800 text-lg">Add Rider</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                        <input required className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
                            placeholder="Juan Dela Cruz"
                            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                        <input required type="email" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
                            placeholder="rider@example.com"
                            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Password</label>
                        <input required type="password" minLength={6} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
                            placeholder="••••••••"
                            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    </div>
                    <button disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition disabled:opacity-60 mt-1">
                        {loading ? 'Creating...' : 'Create Rider Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function AdminRiders() {
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const load = () => {
        setLoading(true);
        api.get('/admin/riders').then(r => { setRiders(r.data); setLoading(false); });
    };

    useEffect(() => { load(); }, []);

    return (
        <AdminLayout>
            {showModal && <CreateRiderModal onClose={() => setShowModal(false)} onCreated={load} />}

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Riders</h1>
                    <p className="text-slate-500 text-sm mt-0.5">{riders.length} rider{riders.length !== 1 ? 's' : ''}</p>
                </div>
                <button onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition shadow-sm">
                    <Plus size={16} /> Add Rider
                </button>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
                </div>
            ) : riders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                    <Bike size={32} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-400">No riders yet. Add one to get started.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Name</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Email</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Total Deliveries</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {riders.map(rider => (
                                <tr key={rider.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-600">
                                                {rider.name?.[0]?.toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-slate-700">{rider.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-slate-500">{rider.email}</td>
                                    <td className="px-5 py-3 text-slate-600">{rider.assigned_orders_count ?? 0}</td>
                                    <td className="px-5 py-3">
                                        <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">Active</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
