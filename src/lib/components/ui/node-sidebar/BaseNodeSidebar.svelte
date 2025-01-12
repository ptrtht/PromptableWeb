<script lang="ts">
  import { fly } from 'svelte/transition';
  import type { Snippet } from 'svelte';
  import type { CurrentlyActiveNodeType } from '$lib/components/utils';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  let {
    currentlyActiveNode = $bindable(),
    children,
  }: {
    currentlyActiveNode: CurrentlyActiveNodeType;
    children: Snippet;
  } = $props();

  const sidebarWidth = tweened(0, {
    duration: 500,
    easing: cubicOut,
  });

  $effect(() => {
    if (currentlyActiveNode) {
      sidebarWidth.set(56);
    } else {
      sidebarWidth.set(0);
    }
  });
</script>

<div class="layout-wrapper flex w-full max-w-xl" style="width: {$sidebarWidth}rem">
  {#if currentlyActiveNode}
    <div
      class="
    sticky top-[3.75rem]
    card bg-background shadow-md
    border-l border-b border-3 border-muted
    w-full max-w-xl
    p-6 flex flex-col gap-6 z-50
    max-h-[calc(100vh-4rem)]
    pb-20 overflow-y-auto
    "
      transition:fly={{ x: 620, duration: 500 }}
    >
      {@render children()}
    </div>
  {/if}
</div>
