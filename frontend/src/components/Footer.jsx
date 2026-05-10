import { Briefcase, Code2, Mail } from 'lucide-react';
import { useContext } from 'react';
import { SiteContext } from '../context/SiteContext';

export default function Footer() {
    const { siteContent } = useContext(SiteContext);

    return (
        <footer className="border-t border-slate-200 bg-white py-10">
            <div className="section-shell flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white font-heading font-extrabold">JP</span>
                    <span className="text-2xl font-heading font-extrabold text-slate-950">Joel Paul</span>
                </div>

                <p className="text-center font-bold text-slate-500">
                    {siteContent?.footerText || `Copyright ${new Date().getFullYear()} Joel Paul. All rights reserved.`}
                </p>

                <div className="flex gap-3">
                    <a href="mailto:joelpaulvilangu@gmail.com" className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-stone-50 text-slate-600 hover:bg-accent hover:text-white transition-colors" aria-label="Email directly"><Mail size={20} /></a>
                    <a href="#" className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-stone-50 text-slate-600 hover:bg-accent hover:text-white transition-colors" aria-label="Code profile"><Code2 size={20} /></a>
                    <a href="https://www.linkedin.com/in/joel-paul-kochi" target="_blank" rel="noopener noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-stone-50 text-slate-600 hover:bg-accent hover:text-white transition-colors" aria-label="Work profile"><Briefcase size={20} /></a>
                </div>
            </div>
        </footer>
    );
}
