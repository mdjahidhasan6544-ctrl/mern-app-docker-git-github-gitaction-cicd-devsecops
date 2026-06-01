import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const { register, userInfo, error, loading, clearError } = useAuthStore();
    const navigate = useNavigate();
    const { search } = useLocation();
    
    const redirect = new URLSearchParams(search).get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
        return () => clearError();
    }, [userInfo, navigate, redirect, clearError]);

    const submitHandler = async (e) => {
        e.preventDefault();
        await register(name, email, password);
    };

    return (
        <div className="min-h-[78vh] grid grid-cols-1 lg:grid-cols-2 fade-in">
            <div className="hidden lg:block relative overflow-hidden order-2 lg:order-1">
                <img src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80" alt="Craftweave" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714] via-[#1A1714]/20 to-transparent" />
                <div className="absolute bottom-12 left-12 max-w-md text-white">
                    <p className="section-label text-[var(--accent-light)] mb-3">Join the atelier</p>
                    <h2 className="font-serif text-5xl font-light leading-tight">Create an account and shop with intention.</h2>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center py-12 px-6 order-1 lg:order-2">
            <div className="w-full max-w-md bg-[var(--bg-card)] p-8 md:p-12 border border-[var(--border)]">
                <h1 className="text-4xl font-serif mb-2 text-[var(--fg)] text-center">Create Profile</h1>
                <p className="text-center text-[var(--fg-muted)] font-light text-sm mb-8 tracking-wide">Join the exclusive world of Craftweave.</p>
                
                {error && <div className="bg-[var(--error-bg)] text-[var(--error-fg)] p-3 text-xs tracking-widest uppercase mb-6 text-center">{error}</div>}

                <form onSubmit={submitHandler} className="flex flex-col gap-6">
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="input-field" 
                    />
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-field" 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field" 
                    />
                    
                    <button 
                        disabled={loading}
                        className="btn-primary mt-4"
                    >
                        {loading ? 'Creating...' : 'Register'}
                    </button>
                </form>

                <p className="mt-8 text-center text-[var(--fg-muted)] font-light text-sm">
                    Already registered?{' '}
                    <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-[var(--accent)] border-b border-[var(--accent)] pb-1 hover:opacity-70">
                        Sign In
                    </Link>
                </p>
            </div>
            </div>
        </div>
    );
};

export default Register;
