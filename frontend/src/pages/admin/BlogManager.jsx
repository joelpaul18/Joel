import { useEffect, useMemo, useState } from 'react';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import axios from 'axios';
import RichTextEditor from '../../components/admin/RichTextEditor';

const emptyBlog = {
    title: '',
    slug: '',
    coverImage: '',
    tags: '',
    body: '',
    isPublished: false,
};

const fallbackBlogs = [
    {
        _id: '1',
        title: 'Why I switched to Vite',
        slug: 'why-vite',
        coverImage: 'https://via.placeholder.com/800x400',
        tags: ['React', 'Tooling'],
        body: 'A short note about modern frontend tooling.',
        isPublished: true,
        createdAt: '2023-10-15',
    },
];

const slugify = (value) => value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function BlogManager() {
    const [blogs, setBlogs] = useState([]);
    const [form, setForm] = useState(emptyBlog);
    const [editingId, setEditingId] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        axios.get('/api/admin/blogs', { withCredentials: true })
            .then(res => setBlogs(res.data))
            .catch(() => setBlogs(fallbackBlogs));
    }, []);

    const titleSlug = useMemo(() => slugify(form.title), [form.title]);

    const openNewForm = () => {
        setForm(emptyBlog);
        setEditingId(null);
        setIsFormOpen(true);
    };

    const openEditForm = (blog) => {
        setForm({
            ...blog,
            tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || '',
        });
        setEditingId(blog._id);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setForm(emptyBlog);
    };

    const buildPayload = () => ({
        ...form,
        slug: form.slug || titleSlug,
        tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = buildPayload();
        try {
            const res = editingId
                ? await axios.put(`/api/admin/blogs/${editingId}`, payload, { withCredentials: true })
                : await axios.post('/api/admin/blogs', payload, { withCredentials: true });

            setBlogs(current => editingId
                ? current.map(blog => blog._id === editingId ? res.data : blog)
                : [res.data, ...current]);
        } catch {
            const localBlog = { ...payload, _id: editingId || crypto.randomUUID(), createdAt: new Date().toISOString() };
            setBlogs(current => editingId
                ? current.map(blog => blog._id === editingId ? localBlog : blog)
                : [localBlog, ...current]);
        }
        closeForm();
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this blog post?')) return;
        try {
            await axios.delete(`/api/admin/blogs/${id}`, { withCredentials: true });
        } catch {
            // Local fallback below.
        }
        setBlogs(current => current.filter(blog => blog._id !== id));
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5 mb-8 w-full">
                <div>
                    <p className="section-kicker">Writing</p>
                    <h2 className="section-title mt-3">Blog Posts</h2>
                </div>
                <button onClick={openNewForm} className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-extrabold text-white shadow-sm transition-colors hover:bg-slate-950">
                    <Plus size={20} /> New Post
                </button>
            </div>

            {isFormOpen && (
                <form onSubmit={handleSubmit} className="surface mb-8 rounded-2xl p-6">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <h3 className="text-2xl font-extrabold text-slate-950">{editingId ? 'Edit Post' : 'New Post'}</h3>
                        <button type="button" onClick={closeForm} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                        <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} className="focus-ring rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 font-bold" placeholder="Post title" />
                        <input required value={form.slug || titleSlug} onChange={e => setForm({ ...form, slug: slugify(e.target.value) })} className="focus-ring rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 font-bold" placeholder="post-slug" />
                        <input value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} className="focus-ring rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 font-bold" placeholder="Cover image URL" />
                        <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="focus-ring rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 font-bold" placeholder="React, Security" />
                        <label className="md:col-span-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 font-bold text-slate-700">
                            <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
                            Published
                        </label>
                        <div className="md:col-span-2 space-y-1">
                            <p className="text-xs font-bold text-slate-500">BODY</p>
                            <RichTextEditor value={form.body} onChange={val => setForm({ ...form, body: val })} />
                        </div>
                    </div>
                    <button type="submit" className="mt-6 rounded-xl bg-accent px-5 py-3 font-extrabold text-white hover:bg-slate-950 transition-colors">
                        {editingId ? 'Save Post' : 'Create Post'}
                    </button>
                </form>
            )}

            <div className="surface rounded-2xl overflow-x-auto w-full">
                <table className="w-full min-w-[720px] text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                            <th className="px-8 py-5 font-bold tracking-wider text-sm">TITLE</th>
                            <th className="px-8 py-5 font-bold tracking-wider text-sm">STATUS</th>
                            <th className="px-8 py-5 font-bold tracking-wider text-sm">DATE</th>
                            <th className="px-8 py-5 font-bold tracking-wider text-sm text-right">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {blogs.map(b => (
                            <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="font-bold text-slate-900">{b.title}</div>
                                    <div className="text-sm font-medium text-slate-400">/{b.slug}</div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded text-xs font-bold ${b.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {b.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-slate-500 font-medium">{new Date(b.createdAt).toLocaleDateString()}</td>
                                <td className="px-8 py-5 flex justify-end gap-3">
                                    <button onClick={() => openEditForm(b)} className="p-2.5 bg-slate-100 hover:bg-accent hover:text-white text-slate-600 rounded-lg transition-colors"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(b._id)} className="p-2.5 bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {blogs.length === 0 && <div className="p-16 text-center text-slate-500 font-bold">No blog posts found. Create one.</div>}
            </div>
        </div>
    );
}
