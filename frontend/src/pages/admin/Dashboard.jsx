import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Briefcase, FileText, LayoutDashboard, LogOut, Mail, Settings, User } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ContentManager from './ContentManager';
import BlogManager from './BlogManager';
import ProjectManager from './ProjectManager';
import SkillsManager from './SkillsManager';
import MessagesManager from './MessagesManager';

function Overview() {
    const navigate = useNavigate();
    const metrics = [
        ['Total Views', '1,204'],
        ['Active Projects', '12'],
        ['Unread Messages', '3'],
    ];

    return (
        <div>
            <p className="section-kicker">Dashboard</p>
            <h2 className="section-title mt-3">Overview</h2>
            <div className="mt-8 grid md:grid-cols-3 gap-5">
                {metrics.map(([metric, value]) => (
                    <div key={metric} className="surface rounded-2xl p-6">
                        <div className="text-sm font-extrabold uppercase tracking-[0.18em] text-slate-500">{metric}</div>
                        <div className="mt-5 text-5xl font-extrabold text-slate-950">{value}</div>
                    </div>
                ))}
            </div>

            <div className="mt-10 surface rounded-2xl p-6">
                <h3 className="text-xl font-extrabold text-slate-950">Quick Actions</h3>
                <div className="mt-5 flex flex-wrap gap-3">
                    <button onClick={() => navigate('/joel/dashboard/blog')} className="rounded-xl bg-accent px-5 py-3 font-extrabold text-white shadow-sm hover:bg-slate-950 transition-colors">New Post</button>
                    <button onClick={() => navigate('/joel/dashboard/projects')} className="rounded-xl border border-slate-200 bg-stone-50 px-5 py-3 font-extrabold text-slate-700 hover:border-accent hover:text-accent transition-colors">Add Project</button>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const navItems = [
        { name: 'Overview', path: '/joel/dashboard', icon: LayoutDashboard },
        { name: 'Site Content', path: '/joel/dashboard/content', icon: Settings },
        { name: 'Blog Posts', path: '/joel/dashboard/blog', icon: FileText },
        { name: 'Projects', path: '/joel/dashboard/projects', icon: Briefcase },
        { name: 'Skills', path: '/joel/dashboard/skills', icon: User },
        { name: 'Messages', path: '/joel/dashboard/messages', icon: Mail },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-stone-50 selection:bg-amber-200 selection:text-slate-950 lg:flex">
            <aside className="lg:sticky lg:top-0 lg:h-screen lg:w-72 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white p-5 lg:p-6 shadow-sm">
                <div className="flex lg:block items-center justify-between gap-4">
                    <div>
                        <div className="text-2xl font-heading font-extrabold text-slate-950">Joel Admin</div>
                        <a href="/" target="_blank" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-accent transition-colors"><ArrowUpRight size={14} /> View Public Site</a>
                    </div>
                    <button onClick={handleLogout} className="lg:hidden grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-600">
                        <LogOut size={20} />
                    </button>
                </div>

                <nav className="mt-6 lg:mt-10 flex lg:flex-col gap-2 overflow-x-auto pb-1">
                    {navItems.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.name} to={item.path} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 font-extrabold transition-all ${isActive ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:bg-stone-100 hover:text-slate-950'}`}>
                                <item.icon size={19} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <button onClick={handleLogout} className="mt-10 hidden lg:flex w-full items-center gap-3 rounded-xl px-4 py-3 font-extrabold text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            <main className="flex-grow p-5 md:p-8 lg:p-10 overflow-x-hidden">
                <div className="mx-auto w-full max-w-6xl">
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/content" element={<ContentManager />} />
                        <Route path="/blog" element={<BlogManager />} />
                        <Route path="/projects" element={<ProjectManager />} />
                        <Route path="/skills" element={<SkillsManager />} />
                        <Route path="/messages" element={<MessagesManager />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}
