import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BlogPost() {
    const { slug } = useParams();

    return (
        <div className="min-h-screen text-slate-800 selection:bg-amber-200 selection:text-slate-950 pt-20 flex flex-col">
            <Navbar />
            <main className="section-shell w-full flex-grow py-16">
                <div className="max-w-3xl">
                    <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-extrabold text-accent shadow-sm hover:border-accent transition-colors">
                        <ArrowLeft size={18} /> Back to Home
                    </Link>
                    <p className="section-kicker mt-12">Blog</p>
                    <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-950">Mock Blog Post for "{slug}"</h1>
                    <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.18em] text-slate-500">Published on {new Date().toLocaleDateString()}</p>
                </div>

                <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-xl">
                    <img src="https://via.placeholder.com/1200x600" alt="Blog cover" className="aspect-video w-full rounded-[1.35rem] object-cover" />
                </div>

                <article className="prose prose-slate prose-lg max-w-3xl mt-12 prose-a:text-accent prose-headings:font-heading prose-headings:font-extrabold prose-p:text-slate-600 prose-p:leading-8">
                    <p>This is a simulated rich text body for the blog post.</p>
                    <p>In the real app, this body will be an HTML string rendered from TipTap editor injected via <code>dangerouslySetInnerHTML</code>.</p>
                    <h2>An Example Subheading</h2>
                    <p>We can render beautiful HTML directly here.</p>
                </article>
            </main>
            <Footer />
        </div>
    );
}
