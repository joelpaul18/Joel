import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

export default function RichTextEditor({ value, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'min-h-[11rem] px-4 py-3 outline-none text-slate-800 font-medium leading-7',
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [editor, value]);

    if (!editor) return null;

    return (
        <div className="focus-ring rounded-xl border border-slate-200 bg-stone-50 overflow-hidden">
            <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-white px-3 py-2">
                <button type="button" onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
                    className={`px-2 py-1 rounded text-sm font-bold transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>H2</button>
                <button type="button" onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
                    className={`px-2 py-1 rounded text-sm font-bold transition-colors ${editor.isActive('bold') ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>B</button>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
