<script lang="ts">
  import type { Snippet } from 'svelte';

  const {
    children,
    variant = 'foreground',
    size = 'md',
    class: className = '',
  }: {
    children: Snippet;
    variant?: 'muted' | 'foreground' | 'error';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    class?: string;
  } = $props();
</script>

<p
  class={'leading-7 ' +
    (variant === 'foreground' ? ' text-foreground ' : '') +
    (variant === 'muted' ? ' text-muted-foreground ' : '') +
    (variant === 'error' ? ' text-destructive ' : '') +
    (size === 'xs' ? ' text-xs ' : '') +
    (size === 'sm' ? ' text-sm ' : '') +
    (size === 'md' ? ' text-base ' : '') +
    (size === 'lg' ? ' text-lg ' : '') +
    className}
>
  {@render children()}
</p>
