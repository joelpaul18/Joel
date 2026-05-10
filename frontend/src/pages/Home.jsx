import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Blog from '../components/Blog';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            // Use a small timeout to ensure the DOM is fully rendered before scrolling
            setTimeout(() => {
                const element = document.getElementById(hash.substring(1));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [hash]);

    return (
        <div className="text-slate-800 min-h-screen selection:bg-amber-200 selection:text-slate-950">
            <Navbar />
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Blog />
            <Contact />
            <Footer />
        </div>
    );
}
