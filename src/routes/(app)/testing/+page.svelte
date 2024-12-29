<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import * as monaco from 'monaco-editor';

  let editorElement: HTMLDivElement;
  let editor: monaco.editor.IStandaloneCodeEditor;

  // bindable prop to set the editor value
  let { value } = $props();

  onMount(async () => {
    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

    editor = monaco.editor.create(editorElement, {
      automaticLayout: true,
      theme: 'vs-dark',
      language: 'json',
    });
  });

  onDestroy(() => {
    monaco?.editor.getModels().forEach((model) => model.dispose());
    editor?.dispose();
  });
</script>

<div class="flex min-h-full w-full flex-col">
  <div class="flex-grow" bind:this={editorElement}></div>
</div>
