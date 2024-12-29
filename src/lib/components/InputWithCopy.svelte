<script lang="ts">
  import CheckMarkSvg from '$lib/SVG/CheckMarkSvg.svelte';
  import CopySvg from '$lib/SVG/CopySvg.svelte';
  import { onDestroy } from 'svelte';

  const timeoutms = 2000;

  let timeout: NodeJS.Timeout;

  let copied = $state(false);

  let {
    value = $bindable(''),
  }: {
    value: string;
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

<div class="join min-w-full">
  <input class="input input-bordered join-item flex-grow" placeholder="Email" bind:value disabled />
  <button class="btn join-item" onclick={copy}>
    {#if copied}
      <CheckMarkSvg color="primary" />
    {:else}
      <CopySvg />
    {/if}
  </button>
</div>
