import { useEffect, useState } from 'react';
import { ImagePlus, Plus, Trash2, X } from 'lucide-react';
import axios from 'axios';

const fallbackSkills = [
    { _id: '1', name: 'React', category: 'Frontend', icon: 'Code2' },
    { _id: '2', name: 'Node.js', category: 'Backend', icon: 'Server' },
];

const localSkillsKey = 'joel-admin-skills';
const localSkillCategoriesKey = 'joel-admin-skill-categories';

const readLocalSkills = () => {
    try {
        return JSON.parse(localStorage.getItem(localSkillsKey)) || [];
    } catch {
        return [];
    }
};

const writeLocalSkills = (skills) => {
    localStorage.setItem(localSkillsKey, JSON.stringify(skills));
};

const readLocalCategories = () => {
    try {
        return JSON.parse(localStorage.getItem(localSkillCategoriesKey)) || [];
    } catch {
        return [];
    }
};

const writeLocalCategories = (categories) => {
    localStorage.setItem(localSkillCategoriesKey, JSON.stringify(categories));
};

const mergeSkills = (...skillGroups) => {
    const merged = new Map();
    skillGroups.flat().forEach(skill => {
        if (skill?._id) merged.set(skill._id, skill);
    });
    return [...merged.values()];
};

const getUniqueCategories = (...categoryGroups) => {
    const categories = categoryGroups
        .flat()
        .map(category => category?.trim())
        .filter(Boolean);

    return [...new Set(categories)].sort((a, b) => a.localeCompare(b));
};

export default function SkillsManager() {
    const [skills, setSkills] = useState([]);
    const [savedCategories, setSavedCategories] = useState(() => readLocalCategories());
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [form, setForm] = useState({ name: '', category: 'Frontend', icon: '' });

    useEffect(() => {
        const loadSkills = async () => {
            const localSkills = readLocalSkills();

            try {
                const savedLocalSkills = [];

                for (const skill of localSkills) {
                    try {
                        const payload = {
                            name: skill.name,
                            category: skill.category,
                            icon: skill.icon,
                        };
                        const res = await axios.post('/api/admin/skills', payload, { withCredentials: true });
                        savedLocalSkills.push(res.data);
                    } catch {
                        savedLocalSkills.push(skill);
                    }
                }

                const remainingLocalSkills = savedLocalSkills.filter(skill => skill.savedLocally);
                writeLocalSkills(remainingLocalSkills);

                const res = await axios.get('/api/public/skills');
                const apiSkills = res.data?.length ? res.data : [];
                const nextSkills = mergeSkills(apiSkills, remainingLocalSkills);
                setSkills(nextSkills.length ? nextSkills : fallbackSkills);
                setSavedCategories(current => getUniqueCategories(current, nextSkills.map(skill => skill.category)));
            } catch {
                setSkills(localSkills.length ? localSkills : fallbackSkills);
                setSavedCategories(current => getUniqueCategories(current, localSkills.map(skill => skill.category)));
            }
        };

        loadSkills();
    }, []);

    useEffect(() => {
        writeLocalCategories(savedCategories);
    }, [savedCategories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedCategory = form.category.trim();
        const payload = { ...form, category: trimmedCategory };
        let savedSkill;

        try {
            const res = await axios.post('/api/admin/skills', payload, { withCredentials: true });
            savedSkill = res.data;
        } catch {
            savedSkill = { ...payload, _id: crypto.randomUUID(), savedLocally: true };
            const localSkills = readLocalSkills();
            writeLocalSkills([savedSkill, ...localSkills]);
        }

        setSkills(current => [savedSkill, ...current.filter(skill => skill._id !== savedSkill._id)]);
        setSavedCategories(current => getUniqueCategories(current, trimmedCategory));
        setForm({ name: '', category: 'Frontend', icon: '' });
        setIsAddingCategory(false);
        setIsFormOpen(false);
    };

    const handleIconUpload = (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please choose an image file.');
            return;
        }

        if (file.size > 1024 * 1024) {
            alert('Please choose an icon image under 1MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => setForm(current => ({ ...current, icon: reader.result }));
        reader.readAsDataURL(file);
    };

    const isImageSource = (value) => value?.startsWith('data:image') || value?.startsWith('http://') || value?.startsWith('https://');

    const renderSkillIcon = (skill) => {
        if (isImageSource(skill.icon)) {
            return <img src={skill.icon} alt={`${skill.name} icon`} className="h-full w-full rounded-full object-cover" />;
        }

        return <span className="text-sm font-extrabold text-accent">{skill.name?.charAt(0) || '?'}</span>;
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this skill?')) return;
        try {
            await axios.delete(`/api/admin/skills/${id}`, { withCredentials: true });
        } catch {
            // Local fallback below.
        }
        writeLocalSkills(readLocalSkills().filter(skill => skill._id !== id));
        setSkills(current => current.filter(skill => skill._id !== id));
    };

    const categoryOptions = getUniqueCategories(
        savedCategories,
        fallbackSkills.map(skill => skill.category),
        skills.map(skill => skill.category),
        isAddingCategory ? '' : form.category
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5 mb-8 w-full">
                <div>
                    <p className="section-kicker">Stack</p>
                    <h2 className="section-title mt-3">Skills</h2>
                </div>
                <button onClick={() => setIsFormOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-extrabold text-white shadow-sm transition-colors hover:bg-slate-950">
                    <Plus size={20} /> Add Skill
                </button>
            </div>

            {isFormOpen && (
                <form onSubmit={handleSubmit} className="surface mb-8 rounded-2xl p-6">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <h3 className="text-2xl font-extrabold text-slate-950">Add Skill</h3>
                        <button type="button" onClick={() => setIsFormOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5 items-start">
                        <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="focus-ring rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 font-bold" placeholder="Skill name" />
                        <div className="space-y-3">
                            <select
                                value={isAddingCategory ? '__new__' : form.category}
                                onChange={e => {
                                    if (e.target.value === '__new__') {
                                        setIsAddingCategory(true);
                                        setForm(current => ({ ...current, category: '' }));
                                        return;
                                    }

                                    setIsAddingCategory(false);
                                    setForm(current => ({ ...current, category: e.target.value }));
                                }}
                                className="focus-ring w-full rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 font-bold"
                            >
                                {categoryOptions.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                                <option value="__new__">Add new category</option>
                            </select>
                            {isAddingCategory && (
                                <input
                                    required
                                    autoFocus
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                    className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold"
                                    placeholder="New category, e.g. General"
                                />
                            )}
                        </div>
                        <input required value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="focus-ring rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 font-bold md:col-span-2" placeholder="Paste icon image URL, or upload below" />
                        <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 font-bold text-slate-700 hover:border-accent md:col-span-2">
                            <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-slate-200 bg-white text-accent">
                                {isImageSource(form.icon) ? <img src={form.icon} alt="Skill icon preview" className="h-full w-full object-cover" /> : <ImagePlus size={22} />}
                            </span>
                            <span className="whitespace-nowrap">{form.icon ? 'Upload Different Icon' : 'Upload Icon'}</span>
                            <input type="file" accept="image/*" onChange={e => handleIconUpload(e.target.files?.[0])} className="sr-only" />
                        </label>
                    </div>
                    <button type="submit" className="mt-6 rounded-xl bg-accent px-5 py-3 font-extrabold text-white hover:bg-slate-950 transition-colors">
                        Create Skill
                    </button>
                </form>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {skills.map(skill => (
                    <div key={skill._id} className="surface p-6 rounded-2xl flex justify-between items-center group hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border border-slate-200 bg-teal-50">
                                {renderSkillIcon(skill)}
                            </span>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{skill.name}</h3>
                                <p className="text-slate-500 font-medium">{skill.category}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(skill._id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all md:opacity-0 group-hover:opacity-100">
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
                {skills.length === 0 && <div className="text-slate-400 font-bold">No skills found. Add one.</div>}
            </div>
        </div>
    );
}
