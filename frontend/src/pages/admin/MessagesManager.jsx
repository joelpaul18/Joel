import { useEffect, useState } from 'react';
import { Trash2, MailOpen } from 'lucide-react';
import axios from 'axios';

const fallbackMessages = [
    { _id: '1', name: 'Jane Doe', email: 'jane@example.com', message: 'Loved your portfolio. Let\'s connect!', createdAt: '2023-10-15', isRead: false },
];

export default function MessagesManager() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/messages', { withCredentials: true })
            .then(res => setMessages(res.data))
            .catch(() => setMessages(fallbackMessages));
    }, []);

    const markRead = async (id) => {
        try {
            const res = await axios.put(`/api/admin/messages/${id}/read`, {}, { withCredentials: true });
            setMessages(current => current.map(message => message._id === id ? res.data : message));
        } catch {
            setMessages(current => current.map(message => message._id === id ? { ...message, isRead: true } : message));
        }
    };

    const deleteMessage = async (id) => {
        if (!confirm('Delete this message?')) return;
        try {
            await axios.delete(`/api/admin/messages/${id}`, { withCredentials: true });
        } catch {
            // Local fallback below.
        }
        setMessages(current => current.filter(message => message._id !== id));
    };

    return (
        <div>
            <p className="section-kicker">Inbox</p>
            <h2 className="section-title mt-3 mb-8">Messages</h2>

            <div className="space-y-6 w-full">
                {messages.map(msg => (
                    <div key={msg._id} className="surface p-6 md:p-8 rounded-2xl hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h3 className="text-2xl font-bold text-slate-900">{msg.name}</h3>
                                    {msg.isRead ? <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">Read</span> : <span className="rounded bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">Unread</span>}
                                </div>
                                <a href={`mailto:${msg.email}`} className="text-accent font-bold hover:underline">{msg.email}</a>
                            </div>
                            <span className="text-slate-400 font-bold bg-slate-100 px-3 py-1 rounded">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-700 bg-stone-50 p-6 rounded-xl border border-slate-100 font-medium leading-relaxed mb-6">
                            "{msg.message}"
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => markRead(msg._id)} disabled={msg.isRead} className="flex items-center gap-2 px-5 py-2.5 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-xl font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50">
                                <MailOpen size={18} /> Mark Read
                            </button>
                            <button onClick={() => deleteMessage(msg._id)} className="flex items-center gap-2 px-5 py-2.5 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded-xl font-bold transition-colors">
                                <Trash2 size={18} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
                {messages.length === 0 && <div className="text-slate-400 font-bold text-center mt-20">Inbox is completely empty.</div>}
            </div>
        </div>
    );
}
