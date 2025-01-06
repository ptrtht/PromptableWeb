<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';

  const {
    children,
    class: className,
  }: {
    children: Snippet;
    class?: string;
  } = $props();
</script>

<h4 class={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)}>
  {@render children()}
</h4>
