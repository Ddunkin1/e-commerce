import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const load = () => api.get('/categories').then(r => setCategories(Array.isArray(r.data) ? r.data : []));
    useEffect(() => { load(); }, []);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/categories', { name });
            setName('');
            toast.success('Category added');
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        } finally {
            setLoading(false);
        }
    };

    const destroy = async (id, name) => {
        if (!confirm(`Delete "${name}"? This may affect products.`)) return;
        await api.delete(`/categories/${id}`);
        toast.success('Deleted');
        load();
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <p className="text-xs text-pink-400 font-semibold uppercase tracking-widest mb-1">Manage</p>
                <h1 className="text-2xl font-bold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>Categories</h1>
            </div>

            <form onSubmit={submit} className="flex gap-3 mb-6">
                <input type="text" required placeholder="New category name..."
                    value={name} onChange={e => setName(e.target.value)}
                    className="flex-1 border border-pink-100 rounded-xl px-4 py-2.5 text-sm text-stone-600 focus:outline-none focus:border-pink-300 bg-white shadow-sm" />
                <button disabled={loading} className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-sm shadow-pink-200 transition disabled:opacity-50">
                    <Plus size={16} /> Add
                </button>
            </form>

            <div className="bg-white rounded-2xl border border-pink-50 shadow-sm overflow-hidden">
                {categories.length === 0 ? (
                    <p className="text-center text-stone-400 py-12 text-sm">No categories yet</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-pink-50 bg-pink-50/40">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500">#</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500">Name</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500">Slug</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(c => (
                                <tr key={c.id} className="border-b border-pink-50 last:border-0 hover:bg-pink-50/20 transition">
                                    <td className="px-4 py-3 text-stone-400">{c.id}</td>
                                    <td className="px-4 py-3 font-medium text-stone-700">{c.name}</td>
                                    <td className="px-4 py-3 text-stone-400 text-xs">{c.slug}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => destroy(c.id, c.name)} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
}
