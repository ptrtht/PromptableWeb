<script lang="ts">
  import type { Snippet } from 'svelte';
  import Paragraph from '../text/Paragraph.svelte';
  import { cn } from '$lib/utils';

  const {
    children,
    direction = 'horizontal',
    class: className,
    variant = 'default',
  }: {
    children?: Snippet;
    direction?: 'horizontal' | 'vertical';
    class?: string;
    variant?: 'default' | 'muted';
  } = $props();
</script>

{#if direction === 'horizontal'}
  <div class={cn('relative flex items-center', className)}>
    <div class={cn('flex-grow border-t ', variant === 'default' ? 'border-muted-foreground' : 'border-muted')}></div>
    <Paragraph variant="muted" size="xs" class="flex-shrink leading-none mx-4">
      {#if children}
        {@render children()}
      {/if}
    </Paragraph>
    <div class={cn('flex-grow border-t ', variant === 'default' ? 'border-muted-foreground' : 'border-muted')}></div>
  </div>
{:else if direction === 'vertical'}
  <div class={cn('flex h-full items-center', className)}>
    <div class="relative flex flex-col items-center h-full">
      <div class="flex-grow border-l border-gray-300"></div>
      <div class="absolute top-1/2 -translate-y-1/2">
        <div class="transform -rotate-90 whitespace-nowrap text-xs text-gray-500 mx-4">
          {#if children}
            {@render children()}
          {/if}
        </div>
      </div>
      <div class="flex-grow border-l border-gray-300"></div>
    </div>
  </div>
{/if}
