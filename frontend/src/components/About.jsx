import { motion } from 'framer-motion';
import { useContext } from 'react';
import { SiteContext } from '../context/SiteContext';
import { Compass, Target } from 'lucide-react';
import heroImage from '../assets/hero.png';
import { getImageUrl } from '../lib/api';

export default function About() {
    const { siteContent } = useContext(SiteContext);

    const cards = [
        {
            icon: Compass,
            title: 'Currently Doing',
            text: siteContent?.aboutDoing || 'Exploring cloud-native architectures, mastering Docker, and refining my eye for frontend design animations.',
        },
        {
            icon: Target,
            title: 'Looking For',
            text: siteContent?.aboutLookingFor || 'Exciting opportunities to build impactful software with passionate teams that care about both code quality and user experience.',
        },
    ];

    return (
        <section id="about" className="py-24 md:py-32">
            <div className="section-shell">
                <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -28 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative hidden lg:block"
                    >
                        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-xl">
                            <img
                                src={getImageUrl(siteContent?.aboutImage) || heroImage}
                                alt="Portrait style workspace visual"
                                className="aspect-square w-full rounded-[1.35rem] object-cover"
                                width="720"
                                height="720"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-4 rounded-2xl bg-slate-950 px-5 py-4 text-white shadow-xl">
                            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-200">Focus</p>
                            <p className="font-heading text-2xl font-extrabold">Clean builds</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 28 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="section-kicker">About</p>
                        <h2 className="section-title mt-3">{siteContent?.aboutHeading || "Useful software, carefully shaped."}</h2>
                        <p className="mt-7 text-xl leading-9 text-slate-600">
                            {siteContent?.aboutDescription || "I'm a full-stack developer obsessed with creating clean, user-friendly experiences backed by robust, scalable architectures."}
                        </p>

                        <div className="mt-10 grid sm:grid-cols-2 gap-5">
                            {cards.map(({ icon: Icon, title, text }) => (
                                <div key={title} className="surface rounded-2xl p-6">
                                    <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-accent">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="text-lg font-extrabold text-slate-950">{title}</h3>
                                    <p className="mt-3 leading-7 text-slate-600">{text}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
