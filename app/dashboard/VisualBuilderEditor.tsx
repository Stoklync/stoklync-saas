'use client';

import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import GjsEditor from '@grapesjs/react';
import type { Editor } from 'grapesjs';

interface VisualBuilderEditorProps {
  onReady?: (editor: Editor) => void;
}

export default function VisualBuilderEditor({ onReady }: VisualBuilderEditorProps) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white" style={{ minHeight: 500 }}>
      <GjsEditor
        grapesjs={grapesjs}
        options={{ height: '500px', storageManager: false }}
        onReady={onReady}
      />
    </div>
  );
}
