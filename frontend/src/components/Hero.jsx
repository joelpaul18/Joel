import { motion } from 'framer-motion';
import { useState, useEffect, useContext } from 'react';
import { SiteContext } from '../context/SiteContext';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import heroImage from '../assets/hero.png';

export default function Hero() {
    const { siteContent } = useContext(SiteContext);
    const [roleIndex, setRoleIndex] = useState(0);

    const roles = siteContent?.heroSubtitles?.length ? siteContent.heroSubtitles : ['Frontend Developer', 'Cloud Enthusiast', 'Problem Solver'];

    useEffect(() => {
        const interval = setInterval(() => {
            setRoleIndex((prev) => (prev + 1) % roles.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [roles.length]);

    return (
        <section id="hero" className="min-h-screen pt-28 md:pt-32 pb-16 overflow-hidden">
            <div className="section-shell grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-sm font-extrabold text-teal-800 shadow-sm">
                        <Sparkles size={16} /> Available for thoughtful builds
                    </div>

                    <h1 className="mt-7 max-w-4xl text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                        {siteContent?.heroTitle?.replace('ðŸ‘‹', '').trim() || "Hi, I'm Joel"}
                    </h1>

                    <div className="mt-6 min-h-12">
                        <motion.div
                            key={roleIndex}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -14 }}
                            className="font-heading text-2xl md:text-4xl font-bold text-accent"
                        >
                            {roles[roleIndex]}
                        </motion.div>
                    </div>

                    <p className="mt-7 max-w-2xl text-lg md:text-xl leading-8 text-slate-600">
                        {siteContent?.heroDescription || 'Building aesthetic frontends, solid backends, and full-stack solutions with modern tech.'}
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                        <a href="#projects" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-4 font-extrabold text-white shadow-sm hover:bg-accent transition-colors">
                            View Projects <ArrowDown size={18} />
                        </a>
                        <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-4 font-extrabold text-slate-800 shadow-sm hover:border-accent hover:text-accent transition-colors">
                            Contact Me <ArrowUpRight size={18} />
                        </a>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.55 }} className="relative">
                    <div className="absolute -inset-5 rotate-3 rounded-[2rem] bg-amber-300/30" />
                    <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-2xl">
                        <img src={heroImage} alt="Joel working on software projects" className="aspect-[4/5] w-full rounded-[1.35rem] object-cover" />
                        <div className="absolute bottom-7 left-7 right-7 grid grid-cols-3 gap-2 rounded-2xl border border-white/40 bg-slate-950/82 p-3 text-white backdrop-blur-md">
                            {['React', 'Node', 'Cloud'].map((item) => (
                                <span key={item} className="rounded-xl bg-white/10 px-3 py-2 text-center text-xs font-extrabold">{item}</span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
