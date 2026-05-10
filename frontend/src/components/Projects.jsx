import { motion } from 'framer-motion';
import { useEffect, useState, useContext } from 'react';
import { Code2, ExternalLink, Star } from 'lucide-react';
import axios from 'axios';
import { SiteContext } from '../context/SiteContext';



export default function Projects() {
    const [projects, setProjects] = useState([]);
    const { siteContent } = useContext(SiteContext);

    useEffect(() => {
        axios.get('/api/public/projects')
            .then(res => {
                if (res.data?.length) setProjects(res.data);
            })
            .catch(() => setProjects([]));
    }, []);

    return (
        <section id="projects" className="py-24 md:py-32">
            <div className="section-shell">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl">
                        <p className="section-kicker">{siteContent?.projectsKicker || "Projects"}</p>
                        <h2 className="section-title mt-3">{siteContent?.projectsHeading || "Selected builds with working details."}</h2>
                    </motion.div>

                </div>

                <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, i) => (
                        <motion.article
                            key={project._id}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            viewport={{ once: true }}
                            className={`surface group overflow-hidden rounded-2xl ${project.isFeatured ? 'md:col-span-2 lg:col-span-2' : ''}`}
                        >
                            <div className="relative aspect-video overflow-hidden bg-slate-100">
                                <img src={project.thumbnail} alt={project.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent opacity-80" />
                                <div className="absolute left-5 right-5 bottom-5 flex items-center justify-between gap-4">
                                    {project.isFeatured && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-3 py-1 text-xs font-extrabold text-slate-950">
                                            <Star size={14} fill="currentColor" /> Featured
                                        </span>
                                    )}
                                    <div className="ml-auto flex gap-2">
                                        {project.githubUrl && (
                                            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-900 shadow-sm hover:bg-accent hover:text-white transition-colors" aria-label={`${project.name} source code`}>
                                                <Code2 size={18} />
                                            </a>
                                        )}
                                        {project.liveUrl && (
                                            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-900 shadow-sm hover:bg-accent hover:text-white transition-colors" aria-label={`${project.name} live site`}>
                                                <ExternalLink size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 md:p-8">
                                <h3 className="text-2xl font-extrabold text-slate-950">{project.name}</h3>
                                <p className="mt-3 leading-7 text-slate-600">{project.description}</p>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {project.techStack.map(tech => (
                                        <span key={tech} className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-extrabold text-teal-800">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
