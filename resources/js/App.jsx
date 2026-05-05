import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRiders from './pages/admin/AdminRiders';
import RiderDashboard from './pages/rider/RiderDashboard';
import NotFound from './pages/NotFound';
import { isLoggedIn, isAdmin, isRider } from './lib/auth';

function Protected({ children }) {
    return isLoggedIn() ? children : <Navigate to="/login" />;
}

function AdminOnly({ children }) {
    if (!isLoggedIn()) return <Navigate to="/login" />;
    if (!isAdmin()) return <Navigate to="/" />;
    return children;
}

function RiderOnly({ children }) {
    if (!isLoggedIn()) return <Navigate to="/login" />;
    if (!isRider()) return <Navigate to="/" />;
    return children;
}

function StoreLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fff8fa' }}>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-center" toastOptions={{
                style: { background: '#fff0f3', color: '#9d174d', border: '1px solid #fbcfe8', borderRadius: '12px', fontFamily: 'DM Sans' }
            }} />
            <Routes>
                {/* Store */}
                <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
                <Route path="/products" element={<StoreLayout><Products /></StoreLayout>} />
                <Route path="/products/:id" element={<StoreLayout><ProductDetail /></StoreLayout>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Protected><StoreLayout><Cart /></StoreLayout></Protected>} />
                <Route path="/checkout" element={<Protected><StoreLayout><Checkout /></StoreLayout></Protected>} />
                <Route path="/orders" element={<Protected><StoreLayout><Orders /></StoreLayout></Protected>} />
                <Route path="/orders/:id" element={<Protected><StoreLayout><OrderDetail /></StoreLayout></Protected>} />
                <Route path="/order-success/:id" element={<Protected><StoreLayout><OrderSuccess /></StoreLayout></Protected>} />
                <Route path="/profile" element={<Protected><StoreLayout><Profile /></StoreLayout></Protected>} />
                <Route path="/wishlist" element={<Protected><StoreLayout><Wishlist /></StoreLayout></Protected>} />

                {/* Admin */}
                <Route path="/admin" element={<AdminOnly><Dashboard /></AdminOnly>} />
                <Route path="/admin/products" element={<AdminOnly><AdminProducts /></AdminOnly>} />
                <Route path="/admin/categories" element={<AdminOnly><AdminCategories /></AdminOnly>} />
                <Route path="/admin/orders" element={<AdminOnly><AdminOrders /></AdminOnly>} />
                <Route path="/admin/users" element={<AdminOnly><AdminUsers /></AdminOnly>} />
                <Route path="/admin/riders" element={<AdminOnly><AdminRiders /></AdminOnly>} />

                {/* Rider */}
                <Route path="/rider" element={<RiderOnly><RiderDashboard /></RiderOnly>} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
