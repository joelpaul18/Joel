import { useState } from 'react';
import { Download, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const navItems = [
        ['About', '#about'],
        ['Skills', '#skills'],
        ['Projects', '#projects'],
        ['Blog', '#blog'],
        ['Contact', '#contact'],
    ];

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-slate-200/80 bg-stone-50/88 backdrop-blur-xl">
            <div className="section-shell h-20 flex items-center justify-between">
                <a href="/" className="flex items-center gap-3" aria-label="Joel home">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white font-heading font-extrabold shadow-sm">JP</span>
                    <span className="font-heading font-extrabold text-2xl tracking-tight text-slate-950">Joel Paul</span>
                </a>

                <div className="hidden md:flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm">
                    {navItems.map(([label, href]) => (
                        <a key={label} href={href} className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-950 hover:text-white transition-colors">
                            {label}
                        </a>
                    ))}
                </div>

                <a href="/resume.pdf" className="hidden md:inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-slate-950 transition-colors">
                    <Download size={17} /> Resume
                </a>

                <button onClick={() => setOpen(!open)} className="md:hidden grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm" aria-label="Toggle navigation">
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {open && (
                <div className="md:hidden border-t border-slate-200 bg-white">
                    <div className="section-shell py-4 grid gap-2">
                        {navItems.map(([label, href]) => (
                            <a key={label} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-stone-100">
                                {label}
                            </a>
                        ))}
                        <a href="/resume.pdf" className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-extrabold text-white">
                            <Download size={18} /> Resume
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
