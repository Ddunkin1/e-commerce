import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, ArrowLeft, Minus, Plus, Zap, Star } from 'lucide-react';
import api from '../lib/axios';
import { isLoggedIn } from '../lib/auth';
import toast from 'react-hot-toast';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

function StarRating({ value, onChange, readonly = false }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-0.5">
            {[1,2,3,4,5].map(n => (
                <button key={n} type="button"
                    disabled={readonly}
                    onClick={() => onChange?.(n)}
                    onMouseEnter={() => !readonly && setHover(n)}
                    onMouseLeave={() => !readonly && setHover(0)}
                    className={readonly ? 'cursor-default' : 'cursor-pointer'}>
                    <Star size={readonly ? 14 : 20}
                        className={`transition ${(hover || value) >= n ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`} />
                </button>
            ))}
        </div>
    );
}

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [size, setSize] = useState('M');
    const [liked, setLiked] = useState(false);
    const [adding, setAdding] = useState(false);
    const [buying, setBuying] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(null);
    const [reviewCount, setReviewCount] = useState(0);
    const [myRating, setMyRating] = useState(0);
    const [myComment, setMyComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [eligibility, setEligibility] = useState(null);

    const loadReviews = () =>
        api.get(`/products/${id}/reviews`).then(r => {
            setReviews(r.data.reviews);
            setAvgRating(r.data.average);
            setReviewCount(r.data.count);
        });

    const loadEligibility = () => {
        if (!isLoggedIn()) return;
        api.get(`/products/${id}/reviews/eligibility`).then(r => setEligibility(r.data)).catch(() => {});
    };

    useEffect(() => {
        api.get(`/products/${id}`).then(r => setProduct(r.data));
        loadReviews();
        loadEligibility();
    }, [id]);

    const addToCart = async () => {
        if (!isLoggedIn()) { toast.error('Please login first'); navigate('/login'); return; }
        setAdding(true);
        try {
            await api.post('/cart', { product_id: product.id, quantity: qty, size });
            toast.success('Added to cart!');
        } finally {
            setAdding(false);
        }
    };

    const buyNow = async () => {
        if (!isLoggedIn()) { toast.error('Please login first'); navigate('/login'); return; }
        setBuying(true);
        try {
            await api.post('/cart', { product_id: product.id, quantity: qty, size });
            navigate('/checkout');
        } finally {
            setBuying(false);
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!myRating) { toast.error('Please select a star rating'); return; }
        setSubmitting(true);
        try {
            await api.post(`/products/${id}/reviews`, { rating: myRating, comment: myComment });
            toast.success('Review submitted!');
            setMyRating(0);
            setMyComment('');
            loadReviews();
            loadEligibility();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (!product) return (
        <div className="max-w-5xl mx-auto px-5 py-20">
            <div className="grid md:grid-cols-2 gap-10">
                <div className="skeleton h-96 rounded-3xl" />
                <div className="flex flex-col gap-4">
                    <div className="skeleton h-6 w-24 rounded-full" />
                    <div className="skeleton h-10 w-3/4 rounded-xl" />
                    <div className="skeleton h-20 rounded-xl" />
                    <div className="skeleton h-12 rounded-2xl" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-5 py-10">
            <Link to="/products" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-pink-500 mb-8 transition">
                <ArrowLeft size={16} /> Back to Shop
            </Link>

            <div className="grid md:grid-cols-2 gap-10">
                {/* Image */}
                <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl overflow-hidden" style={{ minHeight: '380px' }}>
                    {product.image
                        ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" style={{ minHeight: '380px' }} />
                        : <div className="flex items-center justify-center h-96"><ShoppingBag size={64} className="text-pink-200" /></div>
                    }
                    <button onClick={() => setLiked(!liked)} className="absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-md">
                        <Heart size={18} className={`transition ${liked ? 'fill-pink-400 text-pink-400' : 'text-pink-300'}`} />
                    </button>
                    {product.stock === 0 && (
                        <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Out of Stock</span>
                    )}
                    {product.stock > 0 && product.stock <= 5 && (
                        <span className="absolute top-4 left-4 bg-orange-400 text-white text-xs font-semibold px-3 py-1 rounded-full">Only {product.stock} left!</span>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-5">
                    <span className="inline-block bg-pink-100 text-pink-500 text-xs font-semibold px-3 py-1 rounded-full w-fit">
                        {product.category?.name}
                    </span>
                    <h1 className="text-2xl font-bold text-stone-800 leading-snug" style={{ fontFamily: 'Playfair Display, serif' }}>{product.name}</h1>

                    {/* Rating summary */}
                    {reviewCount > 0 && (
                        <div className="flex items-center gap-2">
                            <StarRating value={Math.round(avgRating)} readonly />
                            <span className="text-sm font-semibold text-stone-700">{avgRating}</span>
                            <span className="text-xs text-stone-400">({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
                        </div>
                    )}

                    <span className="text-3xl font-bold text-pink-500">₱{Number(product.price).toLocaleString()}</span>
                    <p className="text-stone-400 text-sm leading-relaxed">{product.description}</p>
                    <div className="text-xs text-stone-400">{product.stock} items in stock</div>

                    {/* Size */}
                    <div>
                        <p className="text-xs font-semibold text-stone-500 mb-2">SIZE</p>
                        <div className="flex gap-2 flex-wrap">
                            {SIZES.map(s => (
                                <button key={s} onClick={() => setSize(s)}
                                    className={`w-11 h-11 rounded-xl text-sm font-semibold border-2 transition-all ${
                                        size === s ? 'border-pink-500 bg-pink-500 text-white shadow-md shadow-pink-200' : 'border-pink-100 text-stone-500 hover:border-pink-300 bg-white'
                                    }`}>{s}</button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-3">
                        <p className="text-xs font-semibold text-stone-500">QTY</p>
                        <div className="flex items-center gap-2 bg-pink-50 rounded-full px-3 py-1.5">
                            <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1 hover:text-pink-500 transition"><Minus size={14} /></button>
                            <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                            <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-1 hover:text-pink-500 transition"><Plus size={14} /></button>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-1">
                        <button onClick={addToCart} disabled={adding || product.stock === 0}
                            className="flex-1 flex items-center justify-center gap-2 border-2 border-pink-500 text-pink-500 hover:bg-pink-50 font-semibold py-3 rounded-2xl transition disabled:opacity-40">
                            <ShoppingBag size={16} />
                            {adding ? 'Adding...' : 'Add to Cart'}
                        </button>
                        <button onClick={buyNow} disabled={buying || product.stock === 0}
                            className="flex-1 flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-2xl shadow-md shadow-pink-200 transition disabled:opacity-40">
                            <Zap size={16} />
                            {buying ? 'Processing...' : 'Buy Now'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews section */}
            <div className="mt-14">
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl font-bold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>Customer Reviews</h2>
                    {reviewCount > 0 && (
                        <span className="text-sm text-stone-400">({reviewCount})</span>
                    )}
                </div>

                {/* Submit review form — only for eligible users */}
                {isLoggedIn() && eligibility?.can_review && (
                    <form onSubmit={submitReview} className="bg-white rounded-2xl border border-pink-100 p-5 mb-6 shadow-sm">
                        <p className="text-sm font-semibold text-stone-700 mb-3">Write a Review</p>
                        <div className="mb-3">
                            <StarRating value={myRating} onChange={setMyRating} />
                        </div>
                        <textarea
                            placeholder="Share your experience with this product... (optional)"
                            rows={3}
                            value={myComment}
                            onChange={e => setMyComment(e.target.value)}
                            className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm text-stone-600 placeholder-stone-300 focus:outline-none focus:border-pink-300 bg-pink-50/30 resize-none mb-3"
                        />
                        <button disabled={submitting}
                            className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition disabled:opacity-50">
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                )}
                {isLoggedIn() && eligibility?.reviewed && (
                    <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-3.5 mb-6 text-sm text-green-600 font-medium">
                        You have already reviewed this product.
                    </div>
                )}
                {isLoggedIn() && eligibility !== null && !eligibility.purchased && (
                    <div className="bg-stone-50 border border-stone-100 rounded-2xl px-5 py-3.5 mb-6 text-sm text-stone-400">
                        Purchase and receive this product to leave a review.
                    </div>
                )}

                {/* Reviews list */}
                {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-pink-50">
                        <Star size={32} className="text-pink-100 mx-auto mb-3" />
                        <p className="text-stone-400 text-sm">No reviews yet. Be the first!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {reviews.map(r => (
                            <div key={r.id} className="bg-white rounded-2xl border border-pink-50 p-5 shadow-sm">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold text-pink-500">{r.user?.name?.[0]?.toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-stone-700">{r.user?.name}</p>
                                            <p className="text-xs text-stone-400">{new Date(r.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <StarRating value={r.rating} readonly />
                                </div>
                                {r.comment && <p className="text-sm text-stone-600 leading-relaxed mt-2">{r.comment}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
