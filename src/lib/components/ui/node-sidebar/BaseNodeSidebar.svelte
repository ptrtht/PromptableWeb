<script lang="ts">
  import { X } from 'lucide-svelte';
  import { Button } from '../button';
  import { fly, slide } from 'svelte/transition';
  import type { Snippet } from 'svelte';

  let {
    open = $bindable(false),
    actions,
    title,
    children,
  }: {
    open: boolean;
    actions?: Snippet;
    title: Snippet;
    children: Snippet;
  } = $props();
</script>

{#if open}
  <div
    class="card bg-background shadow-md border border-3 border-muted absolute top-0 right-0 w-full max-w-md h-full p-6 flex flex-col gap-6"
    transition:fly={{ x: 620, duration: 500 }}
  >
    <div class="flex place-content-between items-center">
      {@render title()}
      <Button variant="ghost" onclick={() => (open = false)}>
        <X />
      </Button>
    </div>
    <div class="flex-1 overflow-y-auto flex flex-col gap-6">
      {@render children()}
    </div>

    {#if actions}
      <div class="flex mt-auto">
        {@render actions()}
      </div>
    {/if}
  </div>
{/if}
