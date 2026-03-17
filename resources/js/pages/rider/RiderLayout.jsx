import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike, LogOut } from 'lucide-react';
import { clearAuth, getUser } from '../../lib/auth';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function RiderLayout({ children }) {
    const navigate = useNavigate();
    const user = getUser();

    const logout = async () => {
        await api.post('/logout').catch(() => {});
        clearAuth();
        toast.success('Logged out');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
                <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                            <Bike size={16} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 leading-none">Rider Portal</p>
                            <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition px-3 py-1.5 rounded-lg hover:bg-red-50">
                        <LogOut size={14} />
                        Logout
                    </button>
                </div>
            </header>
            <main className="max-w-lg mx-auto px-4 py-5">
                {children}
            </main>
        </div>
    );
}
