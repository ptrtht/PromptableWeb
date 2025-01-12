<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';
  import * as Card from '$lib/components/ui/card/index.js';
  import Separator from '../separator/separator.svelte';
  import type { PipelineConfigJson } from '$lib/services/schemas/PipelineConfig';
  import type { NodeNameType } from '$lib/components/utils';

  let {
    children,
    header,
    currentlyActiveNode = $bindable(),
    nodeName,
    class: className,
    onclick,
  }: {
    children: Snippet;
    header?: Snippet;
    currentlyActiveNode: null | keyof PipelineConfigJson['nodes'];
    nodeName: NodeNameType;
    class?: string;
    onclick?: () => void;
  } = $props();

  let active = $derived(nodeName === currentlyActiveNode);
</script>

<Card.Root class={cn('min-h-[13rem] w-full max-w-sm z-10 rounded-xl', className)}>
  {#if header}
    <Card.Header
      class={cn(
        'flex place-content-between justify-center p-2 px-4 rounded-t-xl',
        active ? 'bg-foreground text-muted' : ''
      )}
    >
      {@render header()}
    </Card.Header>
    <Separator class="mb-2" />
  {/if}
  <Card.Content
    class="flex pt-0 flex-col px-4 gap-1 rounded-xl cursor-pointer"
    onclick={() => {
      // if no cur active node, then set to this node
      if (!currentlyActiveNode) currentlyActiveNode = nodeName;
      // the current node is the one clicked, then set to null
      else if (currentlyActiveNode === nodeName) currentlyActiveNode = null;
      // the current node is not clicked AND there is a current node, then set it with timeout
      else {
        currentlyActiveNode = null;
        setTimeout(() => {
          currentlyActiveNode = nodeName;
        }, 100);
      }

      onclick?.();
    }}
    onkeydown={(e) => {
      if (e.key === 'Enter') {
        onclick?.();
      }
    }}
    aria-roledescription="node"
    tabindex={0}
    role="button"
  >
    {@render children()}
  </Card.Content>
</Card.Root>
