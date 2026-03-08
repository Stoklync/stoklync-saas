'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles, Loader2 } from 'lucide-react';
import type { Editor } from 'grapesjs';

const VisualEditor = dynamic(() => import('./VisualBuilderEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
      Loading visual editor...
    </div>
  ),
});

export default function VisualBuilder() {
  const editorRef = useRef<Editor | null>(null);
  const [scaffoldPrompt, setScaffoldPrompt] = useState('');
  const [scaffolding, setScaffolding] = useState(false);
  const [scaffoldError, setScaffoldError] = useState<string | null>(null);

  const handleEditorReady = (editor: Editor) => {
    editorRef.current = editor;
  };

  const handleAiScaffold = async (promptOverride?: string) => {
    const prompt = (promptOverride ?? scaffoldPrompt).trim();
    if (!prompt || !editorRef.current) return;
    setScaffolding(true);
    setScaffoldError(null);
    try {
      const res = await fetch('/api/ai-scaffold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error('Scaffold failed');
      const { html, css } = await res.json();
      const editor = editorRef.current;
      const wrapper = editor.getWrapper();
      if (wrapper) {
        const combined = css ? `<style>${css}</style>${html}` : html;
        wrapper.components(combined);
      }
    } catch (e) {
      setScaffoldError(e instanceof Error ? e.message : 'Failed to scaffold');
    } finally {
      setScaffolding(false);
    }
  };

  const quickTemplates = [
    { label: 'Product', prompt: 'E-commerce product store with hero, featured products grid, and contact form' },
    { label: 'Service', prompt: 'Professional services business with hero, service offerings, testimonials, and contact' },
    { label: 'Consulting', prompt: 'High-end consulting firm with hero, methodology, case studies, and booking section' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm font-medium text-slate-700">Start with template:</span>
        {quickTemplates.map((t) => (
          <button
            key={t.label}
            onClick={() => handleAiScaffold(t.prompt)}
            disabled={scaffolding}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-slate-700 mb-1">Or describe your business</label>
          <input
            type="text"
            value={scaffoldPrompt}
            onChange={(e) => setScaffoldPrompt(e.target.value)}
            placeholder="Describe your business (e.g. consulting firm for tech startups)"
            className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => handleAiScaffold()}
          disabled={scaffolding || !scaffoldPrompt.trim()}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 shrink-0"
        >
          {scaffolding ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          Generate from description
        </button>
      </div>
      {scaffoldError && (
        <p className="text-sm text-red-600">{scaffoldError}</p>
      )}
      <p className="text-sm text-slate-600">Or drag and drop blocks to build your page.</p>
      <VisualEditor onReady={handleEditorReady} />
    </div>
  );
}
