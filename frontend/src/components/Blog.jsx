import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock } from 'lucide-react';
import axios from 'axios';

const defaultBlogs = [
    {
        _id: '1',
        title: 'Why I switched to Vite and never looked back',
        slug: 'why-vite',
        coverImage: 'https://via.placeholder.com/800x400',
        tags: ['React', 'Tooling'],
        createdAt: new Date().toISOString(),
    },
    {
        _id: '2',
        title: 'Understanding JWTs in a modern MERN stack',
        slug: 'understanding-jwts',
        coverImage: 'https://via.placeholder.com/800x400',
        tags: ['Security', 'Node.js'],
        createdAt: new Date().toISOString(),
    },
];

export default function Blog() {
    const [blogs, setBlogs] = useState(defaultBlogs);

    useEffect(() => {
        axios.get('/api/public/blogs')
            .then(res => {
                if (res.data?.length) setBlogs(res.data);
            })
            .catch(() => setBlogs(defaultBlogs));
    }, []);
    return (
        <section id="blog" className="py-24 md:py-32 bg-slate-950 text-white">
            <div className="section-shell">
                <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl">
                    <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-amber-300">Notes</p>
                    <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight text-white">Latest writing from the workbench.</h2>
                </motion.div>

                <div className="mt-12 grid md:grid-cols-2 gap-6">
                    {blogs.map((blog, i) => (
                        <motion.div
                            key={blog._id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            viewport={{ once: true }}
                        >
                            <Link to={`/blog/${blog.slug}`} className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08] transition-all hover:-translate-y-1 hover:bg-white/[0.12]">
                                <div className="aspect-video overflow-hidden bg-white/10">
                                    <img src={blog.coverImage} alt={blog.title} className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" />
                                </div>
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-wrap gap-2">
                                        {blog.tags.map(t => (
                                            <span key={t} className="rounded-full bg-amber-300/15 px-3 py-1 text-xs font-extrabold text-amber-200">{t}</span>
                                        ))}
                                    </div>
                                    <h3 className="mt-6 text-2xl font-extrabold leading-snug text-white group-hover:text-amber-200 transition-colors">{blog.title}</h3>
                                    <div className="mt-6 flex items-center justify-between gap-4 text-sm font-bold text-slate-300">
                                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                        <span className="inline-flex items-center gap-2"><Clock size={16} /> 5 min read</span>
                                    </div>
                                    <div className="mt-7 inline-flex items-center gap-2 font-extrabold text-amber-200">
                                        Read note <ArrowUpRight size={18} />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
