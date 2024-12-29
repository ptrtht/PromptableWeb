<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
  import * as monaco from 'monaco-editor';
  import { browser } from '$app/environment';

  let divEl: HTMLDivElement;
  let editor: monaco.editor.IStandaloneCodeEditor;

  // bindable prop to set the editor value
  let { value = $bindable() }: { value: string } = $props();

  onMount(async () => {
    if (!browser) return;

    self.MonacoEnvironment = {
      getWorker: function (_moduleId, label) {
        return new jsonWorker();
      },
    };

    editor = monaco.editor.create(divEl, {
      value,
      language: 'json',
      theme: 'vs-dark',
      minimap: { enabled: false },
      scrollbar: {
        vertical: 'hidden',
        horizontal: 'auto',
        arrowSize: 0,
      },
    });
    editor.onDidChangeModelContent(() => {
      const text = editor.getValue();
      console.log(text);
      value = text;
    });
  });

  onDestroy(() => {
    editor.dispose();
  });

  const format = () => {
    editor?.getAction('editor.action.formatDocument')?.run();
  };
</script>

<div
  class="flex rounded-xl p-4"
  style="min-height: 15rem; background-color: #1e1e1e; outline: auto; outline-color: #1e1e1e"
>
  <div class="flex-grow">
    <!-- svelte-ignore element_invalid_self_closing_tag -->
    <div bind:this={divEl} class="h-full w-full" onblur={format} />
  </div>
</div>

<svelte:window
  on:resize={() => {
    editor.layout({ width: 0, height: 0 });
    window.requestAnimationFrame(() => {
      const rect = divEl.parentElement?.getBoundingClientRect();
      editor.layout({ width: rect?.width ?? 0, height: rect?.height ?? 0 });
    });
  }}
/>
