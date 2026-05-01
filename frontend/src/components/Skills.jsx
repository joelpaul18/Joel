import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Cloud, Code2, Database, Server } from 'lucide-react';
import axios from 'axios';

const defaultSkills = [
    { name: 'React', category: 'Frontend', icon: '' },
    { name: 'TailwindCSS', category: 'Frontend', icon: '' },
    { name: 'Framer Motion', category: 'Frontend', icon: '' },
    { name: 'Node.js', category: 'Backend', icon: '' },
    { name: 'Express', category: 'Backend', icon: '' },
    { name: 'MongoDB', category: 'Database', icon: '' },
    { name: 'Docker', category: 'Cloud/DevOps', icon: '' },
];

const categoryIcons = {
    Frontend: Code2,
    Backend: Server,
    Database: Database,
    'Cloud/DevOps': Cloud,
};

export default function Skills() {
    const [skills, setSkills] = useState(defaultSkills);

    useEffect(() => {
        axios.get('/api/public/skills')
            .then(res => {
                if (res.data?.length) setSkills(res.data);
            })
            .catch(() => setSkills(defaultSkills));
    }, []);

    const categories = [...new Set(skills.map(skill => skill.category).filter(Boolean))];

    const renderSkillIcon = (skill) => {
        if (skill.icon?.startsWith('data:image') || skill.icon?.startsWith('http://') || skill.icon?.startsWith('https://')) {
            return <img src={skill.icon} alt={`${skill.name} icon`} className="h-full w-full rounded-full object-cover" />;
        }

        return <span className="text-[11px] font-extrabold text-accent">{skill.name?.charAt(0) || '?'}</span>;
    };

    return (
        <section id="skills" className="py-24 md:py-32 bg-white/70 border-y border-slate-200/80">
            <div className="section-shell">
                <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl">
                    <p className="section-kicker">Skills</p>
                    <h2 className="section-title mt-3">A focused stack for full-stack work.</h2>
                </motion.div>

                <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {categories.map((cat, i) => {
                        const catSkills = skills.filter(s => s.category === cat);
                        const Icon = categoryIcons[cat] || Code2;
                        if (catSkills.length === 0) return null;

                        return (
                            <motion.div
                                key={cat}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                viewport={{ once: true }}
                                className="surface rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-xl font-extrabold text-slate-950">{cat}</h3>
                                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-100 text-amber-700">
                                        <Icon size={22} />
                                    </span>
                                </div>
                                <div className="mt-7 flex flex-wrap gap-2">
                                    {catSkills.map(skill => (
                                        <span key={skill.name} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-stone-50 py-1.5 pl-1.5 pr-3 text-sm font-bold text-slate-700">
                                            <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
                                                {renderSkillIcon(skill)}
                                            </span>
                                            <span>{skill.name}</span>
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
