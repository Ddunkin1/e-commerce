import React, { useEffect, useState } from 'react';
import { Shield, ShieldOff, Users } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { getUser } from '../../lib/auth';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const me = getUser();

    const load = () => api.get('/admin/users').then(r => { setUsers(r.data); setLoading(false); });
    useEffect(() => { load(); }, []);

    const toggleAdmin = async (user) => {
        const action = user.is_admin ? 'Remove admin from' : 'Make admin';
        if (!confirm(`${action} "${user.name}"?`)) return;
        try {
            await api.patch(`/admin/users/${user.id}/toggle-admin`);
            toast.success(`${user.name} is now ${user.is_admin ? 'a regular user' : 'an admin'}`);
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Users</h1>
                <p className="text-slate-500 text-sm mt-0.5">{users.length} registered users</p>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">#</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Name</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Email</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Orders</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Role</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Joined</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                                    <td className="px-5 py-3 text-slate-400 text-xs">{user.id}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-bold text-slate-600">{user.name[0].toUpperCase()}</span>
                                            </div>
                                            <span className="font-medium text-slate-700">{user.name}</span>
                                            {user.id === me?.id && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-medium">You</span>}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-slate-500">{user.email}</td>
                                    <td className="px-5 py-3 text-slate-600">{user.orders_count}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                            user.is_admin ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {user.is_admin ? <><Shield size={11} /> Admin</> : <><Users size={11} /> Customer</>}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-slate-400 text-xs">
                                        {new Date(user.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-5 py-3">
                                        {user.id !== me?.id && (
                                            <button onClick={() => toggleAdmin(user)}
                                                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                                                    user.is_admin
                                                        ? 'text-red-500 hover:bg-red-50 border border-red-100'
                                                        : 'text-indigo-600 hover:bg-indigo-50 border border-indigo-100'
                                                }`}>
                                                {user.is_admin ? <><ShieldOff size={12} /> Revoke Admin</> : <><Shield size={12} /> Make Admin</>}
                                            </button>
                                        )}
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
