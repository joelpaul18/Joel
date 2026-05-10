import { motion } from 'framer-motion';
import { useState } from 'react';
import { Loader2, Mail, Send } from 'lucide-react';
import axios from 'axios';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await axios.post('/api/public/contact', formData);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.error('Failed to send message', error);
            setStatus('idle');
            alert('Failed to send message. Please try again.');
        }
    };

    return (
        <section id="contact" className="py-24 md:py-32">
            <div className="section-shell grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">
                <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <p className="section-kicker">Contact</p>
                    <h2 className="section-title mt-3">Have a build in mind?</h2>
                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Send the shape of the idea, the problem, or the opportunity. I will get back to you shortly.
                    </p>
                    <div className="mt-10 rounded-2xl bg-amber-100 p-6 text-slate-900">
                        <Mail size={28} className="mb-4 text-amber-700" />
                        <p className="font-heading text-2xl font-extrabold">Clear context helps.</p>
                        <p className="mt-2 leading-7 text-slate-700">A timeline, goal, or rough scope is enough to start a useful conversation.</p>
                    </div>
                    
                    <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Or email directly</p>
                            <a href="mailto:joelpaulvilangu@gmail.com" className="font-bold text-slate-900 hover:text-accent transition-colors">
                                joelpaulvilangu@gmail.com
                            </a>
                        </div>
                    </div>
                </motion.div>

                <div className="surface relative overflow-hidden rounded-2xl p-6 md:p-8">
                    {status === 'success' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/92 p-8 text-center backdrop-blur-sm">
                            <Mail size={54} className="mb-4 text-accent" />
                            <h3 className="text-3xl font-extrabold text-slate-950">Message sent</h3>
                            <p className="mt-2 font-bold text-slate-600">I will get back to you shortly.</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-5">
                            <label className="block">
                                <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">Your name</span>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="focus-ring mt-2 w-full rounded-xl border border-slate-200 bg-stone-50 px-4 py-4 font-bold text-slate-900 transition-all" placeholder="John Doe" />
                            </label>
                            <label className="block">
                                <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">Your email</span>
                                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="focus-ring mt-2 w-full rounded-xl border border-slate-200 bg-stone-50 px-4 py-4 font-bold text-slate-900 transition-all" placeholder="john@example.com" />
                            </label>
                        </div>
                        <label className="block">
                            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">Your message</span>
                            <textarea required rows="6" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="focus-ring mt-2 w-full resize-none rounded-xl border border-slate-200 bg-stone-50 px-4 py-4 font-bold text-slate-900 transition-all" placeholder="How can I help you?" />
                        </label>

                        <button disabled={status === 'loading'} type="submit" className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-accent px-6 py-4 text-lg font-extrabold text-white shadow-sm transition-colors hover:bg-slate-950 disabled:opacity-70">
                            {status === 'loading' ? <Loader2 className="animate-spin" /> : <><Send size={22} /> Send Message</>}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
