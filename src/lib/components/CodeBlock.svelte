<script lang="ts">
  import CheckMarkSvg from '$lib/SVG/CheckMarkSvg.svelte';
  import CopySvg from '$lib/SVG/CopySvg.svelte';
  import { onDestroy } from 'svelte';

  const timeoutms = 2000;

  let timeout: NodeJS.Timeout;

  let copied = $state(false);

  let {
    value = $bindable(''),
    language = $bindable('json'),
  }: {
    value: string;
    language: 'json' | 'yaml' | 'typescript' | 'javascript' | 'html' | 'css' | 'shell' | 'plaintext';
  } = $props();

  const copy = () => {
    copied = true;
    navigator.clipboard.writeText(value);
    timeout = setTimeout(() => {
      copied = false;
    }, timeoutms);
  };

  onDestroy(() => {
    clearTimeout(timeout);
  });
</script>

<div class="flex flex-col bg-base-200 p-5 rounded-lg">
  <div class="flex">
    <span class="flex-grow opacity-50">
      {language}
    </span>
    <button class="join-item" onclick={copy}>
      {#if copied}
        <CheckMarkSvg color="primary" />
      {:else}
        <CopySvg />
      {/if}
    </button>
  </div>
  <pre class="pt-5 overflow-x-scroll opacity-50">{value}</pre>
</div>

<!-- <style scoped>
  pre {
    white-space: pre-wrap; /* Since CSS 2.1 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
  }
</style> -->
