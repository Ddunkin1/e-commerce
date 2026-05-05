import React, { useEffect, useState } from 'react';
import { Plus, Bike, X, ChevronDown, ChevronUp, Phone, MapPin, Calendar, Mail } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const field = (label, value, icon) => (
    <div className="flex items-start gap-2">
        <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
        <div>
            <p className="text-xs text-slate-400">{label}</p>
            <p className="text-sm text-slate-700 font-medium">{value || '—'}</p>
        </div>
    </div>
);

function CreateRiderModal({ onClose, onCreated }) {
    const [form, setForm] = useState({
        name: '', last_name: '', email: '', password: '',
        phone: '', address: '', birthdate: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setErrors(e => ({ ...e, [key]: null })); };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await api.post('/admin/riders', form);
            toast.success('Rider account created');
            onCreated();
            onClose();
        } catch (err) {
            if (err.response?.data?.errors) setErrors(err.response.data.errors);
            else toast.error(err.response?.data?.message || 'Failed to create rider');
        } finally {
            setLoading(false);
        }
    };

    const inp = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400";
    const err = (key) => errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key][0]}</p>;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 my-4">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="font-bold text-slate-800 text-lg">Add Rider</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Complete profile required for verification</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    {/* Name row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">First Name</label>
                            <input required className={inp} placeholder="Juan"
                                value={form.name} onChange={e => set('name', e.target.value)} />
                            {err('name')}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Last Name</label>
                            <input required className={inp} placeholder="Dela Cruz"
                                value={form.last_name} onChange={e => set('last_name', e.target.value)} />
                            {err('last_name')}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                            <input required type="email" className={inp} placeholder="rider@email.com"
                                value={form.email} onChange={e => set('email', e.target.value)} />
                            {err('email')}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
                            <input required className={inp} placeholder="09XX XXX XXXX"
                                value={form.phone} onChange={e => set('phone', e.target.value)} />
                            {err('phone')}
                        </div>
                    </div>

                    {/* Birthdate */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Date of Birth <span className="text-slate-400 font-normal">(must be 18+)</span></label>
                        <input required type="date" className={inp}
                            value={form.birthdate} onChange={e => set('birthdate', e.target.value)} />
                        {err('birthdate')}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Home Address</label>
                        <textarea required rows={2} className={`${inp} resize-none`} placeholder="House No., Street, Barangay, City, Province"
                            value={form.address} onChange={e => set('address', e.target.value)} />
                        {err('address')}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Temporary Password</label>
                        <input required type="password" minLength={6} className={inp} placeholder="Min. 6 characters"
                            value={form.password} onChange={e => set('password', e.target.value)} />
                        {err('password')}
                    </div>

                    <button disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition disabled:opacity-60">
                        {loading ? 'Creating...' : 'Create Rider Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}

function age(birthdate) {
    if (!birthdate) return null;
    const diff = Date.now() - new Date(birthdate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export default function AdminRiders() {
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [expanded, setExpanded] = useState(null);

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
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Rider</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Contact</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Age</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Deliveries</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Status</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {riders.map(rider => (
                                <React.Fragment key={rider.id}>
                                    <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-600 shrink-0">
                                                    {rider.name?.[0]?.toUpperCase()}{rider.last_name?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-700">{rider.name} {rider.last_name}</p>
                                                    <p className="text-xs text-slate-400">{rider.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-slate-500 text-xs">{rider.phone || '—'}</td>
                                        <td className="px-5 py-3 text-slate-600 text-xs">
                                            {rider.birthdate ? `${age(rider.birthdate)} yrs` : '—'}
                                        </td>
                                        <td className="px-5 py-3 text-slate-600">{rider.assigned_orders_count ?? 0}</td>
                                        <td className="px-5 py-3">
                                            <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">Active</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <button onClick={() => setExpanded(expanded === rider.id ? null : rider.id)}
                                                className="text-slate-400 hover:text-slate-600 transition">
                                                {expanded === rider.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                        </td>
                                    </tr>

                                    {expanded === rider.id && (
                                        <tr className="bg-slate-50/60 border-b border-slate-50">
                                            <td colSpan={6} className="px-5 py-4">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {field('Full Name', `${rider.name} ${rider.last_name}`, <Bike size={13} />)}
                                                    {field('Email', rider.email, <Mail size={13} />)}
                                                    {field('Phone', rider.phone, <Phone size={13} />)}
                                                    {field('Date of Birth', rider.birthdate
                                                        ? `${new Date(rider.birthdate).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })} (${age(rider.birthdate)} y/o)`
                                                        : null, <Calendar size={13} />)}
                                                    <div className="col-span-2 md:col-span-4">
                                                        {field('Home Address', rider.address, <MapPin size={13} />)}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
