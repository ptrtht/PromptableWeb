<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();
</script>

<div class="card w-96 shadow-xl min-h-52">
  {#if children}
    {@render children()}
  {:else}
    <span> Node Layout Fallback </span>
  {/if}
</div>
