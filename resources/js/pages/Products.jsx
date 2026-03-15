import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import api from '../lib/axios';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
    { value: 'default',   label: 'Default' },
    { value: 'price_asc', label: 'Price: Low → High' },
    { value: 'price_desc',label: 'Price: High → Low' },
    { value: 'name_asc',  label: 'Name A → Z' },
];

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState(searchParams.get('category') || 'all');
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [sort, setSort] = useState('default');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.get('/products'), api.get('/categories')]).then(([p, c]) => {
            setProducts(Array.isArray(p.data) ? p.data : []);
            setCategories(Array.isArray(c.data) ? c.data : []);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const q = searchParams.get('search');
        if (q !== null) setSearch(q);
    }, [searchParams]);

    const filtered = products
        .filter(p => selected === 'all' || p.category_id == selected)
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sort === 'price_asc')  return a.price - b.price;
            if (sort === 'price_desc') return b.price - a.price;
            if (sort === 'name_asc')   return a.name.localeCompare(b.name);
            return 0;
        });

    return (
        <div className="max-w-6xl mx-auto px-5 py-10">
            <div className="mb-8">
                <p className="text-xs text-pink-400 font-semibold uppercase tracking-widest mb-1">Browse</p>
                <h1 className="text-3xl font-bold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>All Products</h1>
            </div>

            {/* Search + Sort row */}
            <div className="flex gap-3 mb-5">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-pink-100 rounded-2xl text-sm text-stone-600 placeholder-stone-300 focus:outline-none focus:border-pink-300 shadow-sm"
                    />
                </div>
                <div className="relative">
                    <SlidersHorizontal size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-300 pointer-events-none" />
                    <select
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                        className="pl-9 pr-4 py-3 bg-white border border-pink-100 rounded-2xl text-sm text-stone-600 focus:outline-none focus:border-pink-300 shadow-sm appearance-none cursor-pointer"
                    >
                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
            </div>

            {/* Category filters */}
            <div className="flex gap-2 flex-wrap mb-8">
                {['all', ...categories.map(c => c.id)].map(id => {
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
                <>
                    <p className="text-xs text-stone-400 mb-4">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                </>
            )}
        </div>
    );
}
