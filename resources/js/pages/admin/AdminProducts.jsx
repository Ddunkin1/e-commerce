import React, { useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, X, Search, Upload, ChevronDown, ChevronRight } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const empty = { category_id: '', name: '', description: '', price: '', stock: '', image: '' };

function ProductRow({ p, onEdit, onDelete }) {
    return (
        <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
            <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {p.image ? <img src={p.image} className="w-full h-full object-cover rounded-lg" /> : <span className="text-sm">📦</span>}
                    </div>
                    <span className="font-medium text-slate-700">{p.name}</span>
                </div>
            </td>
            <td className="px-5 py-3 font-semibold text-slate-700">₱{Number(p.price).toLocaleString()}</td>
            <td className="px-5 py-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    p.stock === 0 ? 'bg-red-100 text-red-600' :
                    p.stock <= 10 ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                }`}>
                    {p.stock === 0 ? 'Out of stock' : p.stock <= 10 ? `Low (${p.stock})` : p.stock}
                </span>
            </td>
            <td className="px-5 py-3">
                <div className="flex items-center gap-1.5 justify-end">
                    <button onClick={() => onEdit(p)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                        <Pencil size={14} />
                    </button>
                    <button onClick={() => onDelete(p.id, p.name)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={14} />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function CategoryGroup({ name, products, onEdit, onDelete, forceOpen }) {
    const [open, setOpen] = useState(true);
    const isOpen = forceOpen || open;

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-50 hover:bg-slate-100 transition"
            >
                <div className="flex items-center gap-2.5">
                    {isOpen ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
                    <span className="font-semibold text-slate-700 text-sm">{name}</span>
                    <span className="bg-indigo-100 text-indigo-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {products.length} {products.length === 1 ? 'product' : 'products'}
                    </span>
                </div>
            </button>
            {isOpen && (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-400">Product</th>
                            <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-400">Price</th>
                            <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-400">Stock</th>
                            <th className="px-5 py-2.5" />
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <ProductRow key={p.id} p={p} onEdit={onEdit} onDelete={onDelete} />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef(null);

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

    const handleImageFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const data = new FormData();
        data.append('image', file);
        setUploading(true);
        try {
            const res = await api.post('/products/image', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            setForm(f => ({ ...f, image: res.data.url }));
            toast.success('Image uploaded');
        } catch {
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            editing ? await api.put(`/products/${editing}`, form) : await api.post('/products', form);
            toast.success(editing ? 'Product updated' : 'Product added');
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

    const q = search.toLowerCase();
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q)
    );
    const isSearching = search.trim().length > 0;

    // Group filtered products by category
    const grouped = filtered.reduce((acc, p) => {
        const cat = p.category?.name || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(p);
        return acc;
    }, {});

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Products</h1>
                    <p className="text-slate-500 text-sm mt-0.5">{products.length} total products</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-sm">
                    <Plus size={16} /> Add Product
                </button>
            </div>

            <div className="relative mb-5">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search products or categories..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-400 bg-white shadow-sm" />
            </div>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-100">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="font-bold text-slate-800">{editing ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={submit} className="flex flex-col gap-3">
                            <select required value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
                                className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 bg-white">
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {[['name','Product Name','text',true],['price','Price (₱)','number',true],['stock','Stock','number',true]].map(([key,label,type,req]) => (
                                <input key={key} type={type} placeholder={label} value={form[key]}
                                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                                    required={req} min={type === 'number' ? 0 : undefined}
                                    className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400" />
                            ))}
                            <div>
                                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageFile} />
                                <button type="button" onClick={() => fileRef.current.click()} disabled={uploading}
                                    className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-lg py-2.5 text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-500 transition disabled:opacity-50">
                                    <Upload size={14} />
                                    {uploading ? 'Uploading...' : form.image ? 'Change Photo' : 'Upload Photo'}
                                </button>
                                {form.image && (
                                    <img src={form.image} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg border border-slate-100" />
                                )}
                            </div>
                            <textarea placeholder="Description (optional)" rows={2} value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 resize-none" />
                            <button disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 mt-1">
                                {loading ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Grouped by category */}
            {Object.keys(grouped).length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm py-12 text-center text-slate-400 text-sm">
                    No products found
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {Object.entries(grouped).map(([catName, items]) => (
                        <CategoryGroup
                            key={catName}
                            name={catName}
                            products={items}
                            onEdit={openEdit}
                            onDelete={destroy}
                            forceOpen={isSearching}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
