import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            login(res.data.token);
            navigate('/joel/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Network error or Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white grid lg:grid-cols-[0.95fr_1.05fr] selection:bg-amber-200 selection:text-slate-950">
            <aside className="hidden lg:flex flex-col justify-between p-12 bg-[linear-gradient(135deg,rgba(15,118,110,0.9),rgba(15,23,42,0.9))]">
                <a href="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-white/80 hover:text-white">
                    <ArrowLeft size={17} /> Public site
                </a>
                <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-amber-200">Joel Admin</p>
                    <h1 className="mt-4 max-w-lg text-5xl font-extrabold tracking-tight text-white">Manage content without losing the craft.</h1>
                    <p className="mt-6 max-w-md text-lg leading-8 text-white/75">Update writing, projects, skills, messages, and site copy from one focused workspace.</p>
                </div>
                <p className="text-sm font-bold text-white/60">Authorized access only</p>
            </aside>

            <main className="flex items-center justify-center p-5">
                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-6 md:p-8 text-slate-900 shadow-2xl">
                    <div className="mb-8">
                        <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-accent">
                            <Lock size={26} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-950">Admin Login</h2>
                        <p className="mt-2 font-medium text-slate-500">Sign in to continue to the dashboard.</p>
                    </div>

                    {error && <div className="mb-6 rounded-xl bg-red-50 p-4 text-center text-sm font-bold text-red-700">{error}</div>}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <label className="block">
                            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">Email address</span>
                            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="focus-ring mt-2 w-full rounded-xl border border-slate-200 bg-stone-50 px-4 py-4 font-bold text-slate-900 transition-all" />
                        </label>
                        <label className="block">
                            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">Password</span>
                            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="focus-ring mt-2 w-full rounded-xl border border-slate-200 bg-stone-50 px-4 py-4 font-bold text-slate-900 transition-all" />
                        </label>
                        <button type="submit" className="w-full rounded-xl bg-accent py-4 text-lg font-extrabold text-white shadow-sm transition-colors hover:bg-slate-950">
                            Authorize Access
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
