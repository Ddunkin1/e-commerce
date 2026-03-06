import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const empty = { category_id: '', name: '', description: '', price: '', stock: '', image: '' };

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const load = () => Promise.all([api.get('/products'), api.get('/categories')]).then(([p, c]) => {
        setProducts(Array.isArray(p.data) ? p.data : []);
        setCategories(Array.isArray(c.data) ? c.data : []);
    });

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(empty); setEditing(null); setShowForm(true); };
    const openEdit = (p) => {
        setForm({ category_id: p.category_id, name: p.name, description: p.description || '', price: p.price, stock: p.stock, image: p.image || '' });
        setEditing(p.id);
        setShowForm(true);
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editing) {
                await api.put(`/products/${editing}`, form);
                toast.success('Product updated');
            } else {
                await api.post('/products', form);
                toast.success('Product added');
            }
            setShowForm(false);
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        } finally {
            setLoading(false);
        }
    };

    const destroy = async (id, name) => {
        if (!confirm(`Delete "${name}"?`)) return;
        await api.delete(`/products/${id}`);
        toast.success('Deleted');
        load();
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="text-xs text-pink-400 font-semibold uppercase tracking-widest mb-1">Manage</p>
                    <h1 className="text-2xl font-bold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>Products</h1>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-sm shadow-pink-200 transition">
                    <Plus size={16} /> Add Product
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 border border-pink-50">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="font-bold text-stone-700">{editing ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setShowForm(false)}><X size={18} className="text-stone-400 hover:text-stone-600" /></button>
                        </div>
                        <form onSubmit={submit} className="flex flex-col gap-3">
                            <select required value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
                                className="border border-pink-100 rounded-xl px-3 py-2.5 text-sm text-stone-600 focus:outline-none focus:border-pink-300 bg-pink-50/30">
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {[['name', 'Product Name', 'text'], ['price', 'Price (₱)', 'number'], ['stock', 'Stock', 'number'], ['image', 'Image URL (optional)', 'text']].map(([key, placeholder, type]) => (
                                <input key={key} type={type} placeholder={placeholder} value={form[key]}
                                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                                    required={key !== 'image'}
                                    className="border border-pink-100 rounded-xl px-3 py-2.5 text-sm text-stone-600 focus:outline-none focus:border-pink-300 bg-pink-50/30" />
                            ))}
                            <textarea placeholder="Description (optional)" rows={2} value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="border border-pink-100 rounded-xl px-3 py-2.5 text-sm text-stone-600 focus:outline-none focus:border-pink-300 bg-pink-50/30 resize-none" />
                            <button disabled={loading} className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 mt-1">
                                {loading ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-pink-50 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-pink-50 bg-pink-50/40">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500">Product</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500">Category</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500">Price</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500">Stock</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="border-b border-pink-50 last:border-0 hover:bg-pink-50/20 transition">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-pink-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {p.image ? <img src={p.image} className="w-full h-full object-cover rounded-lg" /> : <span className="text-xs">📦</span>}
                                        </div>
                                        <span className="font-medium text-stone-700">{p.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-stone-400">{p.category?.name}</td>
                                <td className="px-4 py-3 text-pink-500 font-semibold">₱{Number(p.price).toLocaleString()}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.stock === 0 ? 'bg-red-100 text-red-500' : p.stock <= 10 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                                        {p.stock === 0 ? 'Out of stock' : p.stock <= 10 ? `Low (${p.stock})` : p.stock}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2 justify-end">
                                        <button onClick={() => openEdit(p)} className="p-1.5 text-stone-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition"><Pencil size={14} /></button>
                                        <button onClick={() => destroy(p.id, p.name)} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
