import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api from '../lib/axios';
import ProductCard from '../components/ProductCard';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.get('/products'), api.get('/categories')]).then(([p, c]) => {
            setProducts(Array.isArray(p.data) ? p.data : []);
            setCategories(Array.isArray(c.data) ? c.data : []);
            setLoading(false);
        });
    }, []);

    const filtered = products
        .filter(p => selected === 'all' || p.category_id == selected)
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="max-w-6xl mx-auto px-5 py-10">
            <div className="mb-8">
                <p className="text-xs text-pink-400 font-semibold uppercase tracking-widest mb-1">Browse</p>
                <h1 className="text-3xl font-bold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>All Products</h1>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-pink-100 rounded-2xl text-sm text-stone-600 placeholder-stone-300 focus:outline-none focus:border-pink-300 shadow-sm"
                />
            </div>

            {/* Category filters */}
            <div className="flex gap-2 flex-wrap mb-8">
                {['all', ...categories.map(c => c.id)].map((id, i) => {
                    const label = id === 'all' ? 'All' : categories.find(c => c.id === id)?.name;
                    return (
                        <button
                            key={id}
                            onClick={() => setSelected(id)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                selected == id
                                    ? 'bg-pink-500 text-white shadow-sm shadow-pink-200'
                                    : 'bg-white text-stone-500 border border-pink-100 hover:border-pink-300'
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-64" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="text-stone-400">No products found</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filtered.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            )}
        </div>
    );
}
