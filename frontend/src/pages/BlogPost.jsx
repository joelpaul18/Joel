import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`/api/public/blogs/${slug}`);
                setPost(res.data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    // TipTap stores HTML; plain-text old posts are wrapped in <p> blocks
    const renderBody = (body) => {
        if (!body) return '';
        const isHtml = /<[a-z][\s\S]*>/i.test(body);
        if (isHtml) {
            // Replace empty paragraphs with a `<br>` so they render as an empty line
            return body.replace(/<p>\s*<\/p>/g, '<p><br></p>');
        }
        // Legacy plain-text fallback
        return body
            .split(/\n{2,}/)
            .map(para => `<p>${para.trim().replace(/\n/g, '<br />')}</p>`)
            .join('');
    };

    return (
        <div className="min-h-screen text-slate-800 selection:bg-amber-200 selection:text-slate-950 pt-20 flex flex-col">
            <Navbar />
            <main className="section-shell w-full flex-grow py-16">
                <div className="max-w-3xl">
                    <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-extrabold text-accent shadow-sm hover:border-accent transition-colors">
                        <ArrowLeft size={18} /> Back to Home
                    </Link>

                    {loading && (
                        <div className="mt-16 text-center text-slate-500 font-bold">Loading post...</div>
                    )}

                    {error && (
                        <div className="mt-16 text-center text-red-500 font-bold">Blog post not found.</div>
                    )}

                    {post && (
                        <>
                            <p className="section-kicker mt-12">Blog</p>
                            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-950">{post.title}</h1>
                            <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.18em] text-slate-500">
                                Published on {new Date(post.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </p>

                            {post.tags && post.tags.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{tag}</span>
                                    ))}
                                </div>
                            )}

                            {post.coverImage && (
                                <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-xl">
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="aspect-video w-full rounded-[1.35rem] object-cover"
                                        width="900"
                                        height="506"
                                        loading="eager"
                                        fetchPriority="high"
                                        decoding="async"
                                    />
                                </div>
                            )}

                            <article
                                className="prose prose-slate prose-lg max-w-3xl mt-12 prose-a:text-accent prose-headings:font-heading prose-headings:font-extrabold prose-p:text-slate-600 prose-p:leading-8"
                                dangerouslySetInnerHTML={{ __html: renderBody(post.body) }}
                            />
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
