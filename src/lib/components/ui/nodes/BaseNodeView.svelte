<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';
  import * as Card from '$lib/components/ui/card/index.js';
  import Separator from '../separator/separator.svelte';

  const {
    children,
    header,
    active = false,
    class: className,
    onclick,
  }: {
    children: Snippet;
    header?: Snippet;
    active?: boolean;
    class?: string;
    onclick?: () => void;
  } = $props();
</script>

<Card.Root
  class={cn('min-h-[13rem] w-full max-w-sm cursor-pointer ', className)}
  {onclick}
  onkeydown={(e) => {
    if (e.key === 'Enter') {
      onclick?.();
    }
  }}
  aria-roledescription="node"
  tabindex={0}
  role="button"
>
  {#if header}
    <Card.Header class={cn('flex place-content-between justify-center p-2 px-4', active ? 'bg-muted' : '')}>
      {@render header()}
    </Card.Header>
    <Separator class="mb-6" />
  {/if}
  <Card.Content class="flex flex-col p-6 gap-6 rounded-xl ">
    {@render children()}
  </Card.Content>
</Card.Root>
