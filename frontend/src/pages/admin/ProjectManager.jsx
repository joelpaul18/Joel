import { useEffect, useState } from 'react';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import axios from 'axios';

const emptyProject = {
    name: '',
    description: '',
    thumbnail: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
    isFeatured: false,
};

const fallbackProjects = [
    {
        _id: '1',
        name: 'AI Image Generator',
        description: 'A full-stack application using OpenAI API to generate images based on text prompts.',
        thumbnail: 'https://via.placeholder.com/600x400',
        techStack: ['React', 'Node.js', 'MongoDB', 'OpenAI'],
        githubUrl: '#',
        liveUrl: '#',
        isFeatured: true,
    },
];

export default function ProjectManager() {
    const [projects, setProjects] = useState([]);
    const [form, setForm] = useState(emptyProject);
    const [editingId, setEditingId] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        axios.get('/api/public/projects')
            .then(res => setProjects(res.data))
            .catch(() => setProjects(fallbackProjects));
    }, []);

    const openNewForm = () => {
        setForm(emptyProject);
        setEditingId(null);
        setIsFormOpen(true);
    };

    const openEditForm = (project) => {
        setForm({
            ...project,
            techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : project.techStack || '',
        });
        setEditingId(project._id);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setForm(emptyProject);
    };

    const buildPayload = () => ({
        ...form,
        techStack: form.techStack.split(',').map(item => item.trim()).filter(Boolean),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = buildPayload();

        try {
            const res = editingId
                ? await axios.put(`/api/admin/projects/${editingId}`, payload, { withCredentials: true })
                : await axios.post('/api/admin/projects', payload, { withCredentials: true });

            setProjects(current => editingId
                ? current.map(project => project._id === editingId ? res.data : project)
                : [res.data, ...current]);
        } catch {
            const localProject = { ...payload, _id: editingId || crypto.randomUUID() };
            setProjects(current => editingId
                ? current.map(project => project._id === editingId ? localProject : project)
                : [localProject, ...current]);
        }

        closeForm();
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this project?')) return;
        try {
            await axios.delete(`/api/admin/projects/${id}`, { withCredentials: true });
        } catch {
            // Keep the local UI responsive when the backend is unavailable.
        }
        setProjects(current => current.filter(project => project._id !== id));
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5 mb-8 w-full">
                <div>
                    <p className="section-kicker">Portfolio</p>
                    <h2 className="section-title mt-3">Projects</h2>
                </div>
                <button onClick={openNewForm} className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-extrabold text-white shadow-sm transition-colors hover:bg-slate-950">
                    <Plus size={20} /> Add Project
                </button>
            </div>

            {isFormOpen && (
                <form onSubmit={handleSubmit} className="surface mb-8 rounded-2xl p-6">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <h3 className="text-2xl font-extrabold text-slate-950">{editingId ? 'Edit Project' : 'Add Project'}</h3>
                        <button type="button" onClick={closeForm} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                        <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="focus-ring rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 font-bold" placeholder="Project name" />
                        <input value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} className="focus-ring rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 font-bold" placeholder="Thumbnail URL" />
                        <input value={form.techStack} onChange={e => setForm({ ...form, techStack: e.target.value })} className="focus-ring rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 font-bold" placeholder="React, Node.js, MongoDB" />
                        <input value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} className="focus-ring rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 font-bold" placeholder="GitHub URL" />
                        <input value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} className="focus-ring rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 font-bold" placeholder="Live URL" />
                        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 font-bold text-slate-700">
                            <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
                            Featured project
                        </label>
                        <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="focus-ring md:col-span-2 min-h-28 rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 font-medium" placeholder="Project description" />
                    </div>
                    <button type="submit" className="mt-6 rounded-xl bg-accent px-5 py-3 font-extrabold text-white hover:bg-slate-950 transition-colors">
                        {editingId ? 'Save Project' : 'Create Project'}
                    </button>
                </form>
            )}

            <div className="surface rounded-2xl overflow-x-auto w-full">
                <table className="w-full min-w-[720px] text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                            <th className="px-8 py-5 font-bold tracking-wider text-sm">NAME</th>
                            <th className="px-8 py-5 font-bold tracking-wider text-sm">STACK</th>
                            <th className="px-8 py-5 font-bold tracking-wider text-sm">FEATURED</th>
                            <th className="px-8 py-5 font-bold tracking-wider text-sm text-right">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {projects.map(p => (
                            <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-8 py-5 font-bold text-slate-900 text-lg">{p.name}</td>
                                <td className="px-8 py-5 text-slate-500 font-medium">{Array.isArray(p.techStack) ? p.techStack.join(', ') : ''}</td>
                                <td className="px-8 py-5">
                                    {p.isFeatured ? <span className="px-3 py-1 bg-accent/20 text-accent font-bold rounded">Yes</span> : <span className="text-slate-400 font-bold">No</span>}
                                </td>
                                <td className="px-8 py-5 flex justify-end gap-3">
                                    <button onClick={() => openEditForm(p)} className="p-2.5 bg-slate-100 hover:bg-accent hover:text-white text-slate-600 rounded-lg transition-colors"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(p._id)} className="p-2.5 bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {projects.length === 0 && <div className="p-16 text-center text-slate-500 font-bold">No projects found. Add one.</div>}
            </div>
        </div>
    );
}
