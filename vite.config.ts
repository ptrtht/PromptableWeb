import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    noExternal: ['monaco-editor'],
  },
  optimizeDeps: {
    exclude: ["svelte-codemirror-editor", "codemirror", "@codemirror/language-javascript" /* ... */],
},
});
