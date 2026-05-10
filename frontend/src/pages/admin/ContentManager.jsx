import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ContentManager() {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await axios.get('/api/public/content');
                setContent({ ...res.data, heroSubtitles: res.data.heroSubtitles?.join(', ') || '' });
                setLoading(false);
            } catch {
                console.error('Failed to fetch content');
                setContent({
                    heroTitle: 'Hi, I\'m Joel 👋',
                    heroSubtitles: 'Frontend Developer, Cloud Enthusiast, Problem Solver',
                    heroDescription: 'Building aesthetic frontends, solid backends, and full-stack solutions with modern tech.',
                    aboutHeading: 'Useful software, carefully shaped.',
                    aboutDescription: 'I\'m a full-stack developer obsessed with creating clean, user-friendly experiences backed by robust, scalable architectures.',
                    aboutImage: '',
                    aboutDoing: 'Exploring cloud-native architectures, mastering Docker, and refining my eye for frontend design animations.',
                    aboutLookingFor: 'Exciting opportunities to build impactful software with passionate teams that care about both code quality and user experience.',
                    skillsKicker: 'Skills',
                    skillsHeading: 'A focused stack for full-stack work.',
                    projectsKicker: 'Projects',
                    projectsHeading: 'Selected builds with working details.',
                    heroImage: '',
                    footerText: '© 2026 Joel Paul. All rights reserved.'
                });
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { ...content, heroSubtitles: content.heroSubtitles.split(',').map(s => s.trim()) };
            await axios.put('/api/admin/content', payload, { withCredentials: true });
            alert("Site Content Saved Successfully!");
        } catch {
            alert('Failed to save configuration');
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post('/api/admin/upload', formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setContent(prev => ({ ...prev, [field]: res.data.imageUrl }));
        } catch (error) {
            console.error(error);
            alert('File upload failed');
        }
    };

    if (loading) return <div className="surface rounded-2xl p-8 font-bold text-slate-500">Loading Site Configurations...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5 mb-8 w-full">
                <div>
                    <p className="section-kicker">Content</p>
                    <h2 className="section-title mt-3">Site Content</h2>
                </div>
                <button onClick={handleSubmit} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-extrabold text-white shadow-sm transition-colors hover:bg-slate-950 disabled:opacity-70">
                    {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>

            <form className="surface rounded-2xl p-6 md:p-8 flex flex-col gap-8 w-full max-w-4xl" onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <h3 className="text-xl font-extrabold text-slate-800 border-b border-slate-100 pb-3">Hero Section</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-slate-500">HERO TITLE ("Hi, I'm Joel")</label>
                            <input type="text" value={content.heroTitle || ''} onChange={e => setContent({ ...content, heroTitle: e.target.value })} className="focus-ring w-full bg-stone-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-slate-500">SUBTITLES (comma-separated)</label>
                            <input type="text" value={content.heroSubtitles || ''} onChange={e => setContent({ ...content, heroSubtitles: e.target.value })} className="focus-ring w-full bg-stone-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold" placeholder="Developer, Designer..." />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-slate-500">HERO DESCRIPTION</label>
                            <textarea rows="3" value={content.heroDescription || ''} onChange={e => setContent({ ...content, heroDescription: e.target.value })} className="focus-ring w-full bg-stone-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium resize-none"></textarea>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-slate-500">HERO IMAGE URL (Or Upload)</label>
                            <div className="flex gap-2">
                                <input type="text" value={content.heroImage || ''} onChange={e => setContent({ ...content, heroImage: e.target.value })} className="focus-ring w-full bg-stone-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold" placeholder="https://example.com/image.jpg" />
                                <label className="flex items-center justify-center cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold transition-colors whitespace-nowrap">
                                    Upload
                                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'heroImage')} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-extrabold text-slate-800 border-b border-slate-100 pb-3">About Section</h3>
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-slate-500">ABOUT HEADING</label>
                        <input type="text" value={content.aboutHeading || ''} onChange={e => setContent({ ...content, aboutHeading: e.target.value })} className="focus-ring w-full bg-stone-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-extrabold" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-slate-500">MAIN BIO / BACKGROUND</label>
                            <textarea rows="3" value={content.aboutDescription || ''} onChange={e => setContent({ ...content, aboutDescription: e.target.value })} className="focus-ring w-full bg-stone-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium resize-none"></textarea>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-slate-500">ABOUT IMAGE URL (Or Upload)</label>
                            <div className="flex gap-2">
                                <input type="text" value={content.aboutImage || ''} onChange={e => setContent({ ...content, aboutImage: e.target.value })} className="focus-ring w-full bg-stone-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold" placeholder="https://example.com/about.jpg" />
                                <label className="flex items-center justify-center cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold transition-colors whitespace-nowrap">
                                    Upload
                                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'aboutImage')} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-slate-500">"CURRENTLY DOING" WIDGET TEXT</label>
                            <textarea rows="4" value={content.aboutDoing || ''} onChange={e => setContent({ ...content, aboutDoing: e.target.value })} className="focus-ring w-full bg-stone-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium resize-none"></textarea>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-slate-500">"LOOKING FOR" WIDGET TEXT</label>
                            <textarea rows="4" value={content.aboutLookingFor || ''} onChange={e => setContent({ ...content, aboutLookingFor: e.target.value })} className="focus-ring w-full bg-stone-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium resize-none"></textarea>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-extrabold text-slate-800 border-b border-slate-100 pb-3">Section Headings</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-slate-500">SKILLS KICKER</label>
                            <input type="text" value={content.skillsKicker || ''} onChange={e => setContent({ ...content, skillsKicker: e.target.value })} className="focus-ring w-full bg-stone-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-extrabold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-slate-500">SKILLS HEADING</label>
                            <input type="text" value={content.skillsHeading || ''} onChange={e => setContent({ ...content, skillsHeading: e.target.value })} className="focus-ring w-full bg-stone-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-extrabold" />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-slate-500">PROJECTS KICKER</label>
                            <input type="text" value={content.projectsKicker || ''} onChange={e => setContent({ ...content, projectsKicker: e.target.value })} className="focus-ring w-full bg-stone-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-extrabold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-wider text-slate-500">PROJECTS HEADING</label>
                            <input type="text" value={content.projectsHeading || ''} onChange={e => setContent({ ...content, projectsHeading: e.target.value })} className="focus-ring w-full bg-stone-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-extrabold" />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-extrabold text-slate-800 border-b border-slate-100 pb-3">Global / Footer</h3>
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-slate-500">COPYRIGHT / FOOTER TEXT</label>
                        <input type="text" value={content.footerText || ''} onChange={e => setContent({ ...content, footerText: e.target.value })} className="focus-ring w-full bg-stone-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold" />
                    </div>
                </div>
            </form>
        </div>
    );
}
