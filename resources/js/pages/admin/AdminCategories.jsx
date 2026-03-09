import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(null);
    const [editName, setEditName] = useState('');

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

    const saveEdit = async (id) => {
        try {
            await api.put(`/categories/${id}`, { name: editName });
            toast.success('Category updated');
            setEditing(null);
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    const destroy = async (id, catName) => {
        if (!confirm(`Delete "${catName}"? This may affect products in this category.`)) return;
        await api.delete(`/categories/${id}`);
        toast.success('Deleted');
        load();
    };

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
                <p className="text-slate-500 text-sm mt-0.5">{categories.length} categories</p>
            </div>

            <form onSubmit={submit} className="flex gap-3 mb-6">
                <input type="text" required placeholder="New category name..."
                    value={name} onChange={e => setName(e.target.value)}
                    className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 bg-white shadow-sm" />
                <button disabled={loading} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition disabled:opacity-50 shadow-sm">
                    <Plus size={16} /> Add
                </button>
            </form>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {categories.length === 0 ? (
                    <p className="text-center text-slate-400 py-12 text-sm">No categories yet</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">#</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Name</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Slug</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(c => (
                                <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                                    <td className="px-5 py-3 text-slate-400 text-xs">{c.id}</td>
                                    <td className="px-5 py-3 font-medium text-slate-700">
                                        {editing === c.id ? (
                                            <input autoFocus value={editName} onChange={e => setEditName(e.target.value)}
                                                onKeyDown={e => { if (e.key === 'Enter') saveEdit(c.id); if (e.key === 'Escape') setEditing(null); }}
                                                className="border border-indigo-300 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 w-full max-w-xs" />
                                        ) : c.name}
                                    </td>
                                    <td className="px-5 py-3 text-slate-400 text-xs">{c.slug}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-1.5 justify-end">
                                            {editing === c.id ? (
                                                <>
                                                    <button onClick={() => saveEdit(c.id)} className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition"><Check size={14} /></button>
                                                    <button onClick={() => setEditing(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition"><X size={14} /></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => { setEditing(c.id); setEditName(c.name); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><Pencil size={14} /></button>
                                                    <button onClick={() => destroy(c.id, c.name)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={14} /></button>
                                                </>
                                            )}
                                        </div>
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
