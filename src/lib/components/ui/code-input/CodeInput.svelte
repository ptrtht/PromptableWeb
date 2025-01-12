<script lang="ts">
  // Previous imports remain the same
  import { cn } from '$lib/utils';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.min.css';
  import { Copy, Maximize2, Minimize2 } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import * as Dialog from '$lib/components/ui/dialog/index.js';

  let {
    value = $bindable(''),
    lang = $bindable('typescript'),
    class: className,
    disabled = false,
  }: {
    value?: string;
    lang?: string;
    class?: string;
    height?: string;
    disabled?: boolean;
  } = $props();

  let editorContainer: HTMLDivElement | null = $state(null);
  let inputPre: HTMLPreElement | null = $state(null);
  let outputPre: HTMLPreElement | null = $state(null);
  let mounted = false;

  // Improved height calculation
  const updateHeight = () => {
    if (!mounted || !inputPre || !editorContainer) return;

    // Reset position temporarily to get natural height
    inputPre.style.position = 'static';
    editorContainer.style.height = 'auto';

    // Get the current content height
    const height = Math.max(inputPre.scrollHeight, 120);

    // Restore absolute positioning and set container height
    inputPre.style.position = 'absolute';
    editorContainer.style.height = `${height}px`;

    // Force parent flex container to update by updating the flex-basis
    // This will make the flex container recalculate its layout
    editorContainer.style.flexBasis = `${height}px`;
  };

  $effect(() => {
    if (mounted && value !== undefined) {
      // Wait for the next frame to ensure DOM is updated
      requestAnimationFrame(() => {
        // Wait another frame for syntax highlighting to be applied
        requestAnimationFrame(updateHeight);
      });
    }
  });

  const handleInput = () => {
    requestAnimationFrame(updateHeight);
  };

  // Previous handlers remain the same
  const handleScroll = (e: Event) => {
    const source = e.target as HTMLElement;
    const target = source.nextElementSibling as HTMLElement;
    if (target) {
      target.scrollTop = source.scrollTop;
      target.scrollLeft = source.scrollLeft;
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      if (range) {
        const newLine = document.createTextNode('\n');
        range.insertNode(newLine);
        range.setStartAfter(newLine);
        range.setEndAfter(newLine);
        selection?.removeAllRanges();
        selection?.addRange(range);

        const target = e.target as HTMLElement;
        requestAnimationFrame(() => {
          value = target.textContent || '';
          updateHeight();
        });
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      if (range) {
        const spaces = document.createTextNode('  ');
        range.insertNode(spaces);
        range.setStartAfter(spaces);
        range.setEndAfter(spaces);
        selection?.removeAllRanges();
        selection?.addRange(range);

        const target = e.target as HTMLElement;
        value = target.textContent || '';
        updateHeight();
      }
    }
  };

  onMount(() => {
    mounted = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(updateHeight);
    });
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard');
  };

  let open = $state(false);
</script>

<!-- Wrap this in a modal later -->

<Dialog.Root bind:open>
  <Dialog.Content class="p-0 flex h-content" closable={false}>
    <div class="editor-container rounded-xl bg-foreground/90 text-muted pt-4 flex-grow">
      <Copy
        class="absolute top-2 right-2 cursor-pointer text-accent z-10"
        color="currentColor"
        onclick={handleCopy}
        size="1rem"
      />

      <Minimize2
        class="absolute bottom-2 right-2 cursor-pointer text-accent z-10"
        color="currentColor"
        size="1rem"
        onclick={() => {
          open = false;
        }}
      />
      <div bind:this={editorContainer} class={cn('code-editor  flex-grow', className)}>
        {#if disabled}
          <pre bind:this={inputPre} class="editor-input language-{lang}" onscroll={handleScroll}>{value}</pre>
        {:else}
          <pre
            bind:this={inputPre}
            class="editor-input language-{lang}"
            contenteditable
            bind:textContent={value}
            onscroll={handleScroll}
            onkeydown={handleKeyDown}
            oninput={handleInput}
            spellcheck="false">{value}</pre>
        {/if}
        <pre bind:this={outputPre} class="editor-output language-{lang}">{@html hljs.highlight(value || '', {
            language: lang,
          }).value}</pre>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>

<div class="editor-container rounded-md bg-foreground/90 text-muted pt-4">
  <Copy
    class="absolute top-2 right-2 cursor-pointer text-accent z-10"
    color="currentColor"
    onclick={handleCopy}
    size="1rem"
  />

  <Maximize2
    class="absolute bottom-2 right-2 cursor-pointer text-accent z-10"
    color="currentColor"
    size="1rem"
    onclick={() => {
      open = true;
    }}
  />
  <div bind:this={editorContainer} class={cn('code-editor  flex-grow', className)}>
    {#if disabled}
      <pre bind:this={inputPre} class="editor-input language-{lang}" onscroll={handleScroll}>{value}</pre>
    {:else}
      <pre
        bind:this={inputPre}
        class="editor-input language-{lang}"
        contenteditable
        bind:textContent={value}
        onscroll={handleScroll}
        onkeydown={handleKeyDown}
        oninput={handleInput}
        spellcheck="false">{value}</pre>
    {/if}
    <pre bind:this={outputPre} class="editor-output language-{lang}">{@html hljs.highlight(value || '', {
        language: lang,
      }).value}</pre>
  </div>
</div>

<style>
  .editor-container {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .code-editor {
    position: relative;
    width: 100%;
    overflow-y: hidden;
    overflow-x: auto;
    font-family: 'Fira Code', monospace;
    min-height: 120px;
  }

  pre {
    margin: 0;
    padding: 1rem;
    min-width: 100%;
    overflow-y: hidden;
    overflow-x: auto;
    font-size: 14px;
    line-height: 1.5;
    box-sizing: border-box;
    white-space: pre;
    word-wrap: normal;
  }

  .editor-input {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    color: transparent;
    background: transparent;
    caret-color: hsl(var(--muted));
    resize: none;
    outline: none;
    -webkit-user-modify: read-write;
    -moz-user-modify: read-write;
  }

  .editor-output {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    pointer-events: none;
  }

  :global(.hljs) {
    padding: 0 !important;
    background: transparent !important;
  }
</style>
