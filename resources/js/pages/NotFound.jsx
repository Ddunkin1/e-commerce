import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center px-5" style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf4ff 100%)' }}>
            <div className="text-center">
                <p className="text-8xl font-bold text-pink-200 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>404</p>
                <div className="flex items-center justify-center mb-6">
                    <SearchX size={40} className="text-pink-300" />
                </div>
                <h1 className="text-2xl font-bold text-stone-800 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Page not found
                </h1>
                <p className="text-stone-400 text-sm mb-8 max-w-xs mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 border border-pink-200 text-pink-500 font-medium px-5 py-2.5 rounded-full hover:bg-pink-50 transition text-sm"
                    >
                        <ArrowLeft size={15} /> Go Back
                    </button>
                    <Link
                        to="/"
                        className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-5 py-2.5 rounded-full shadow-md shadow-pink-200 transition text-sm"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
