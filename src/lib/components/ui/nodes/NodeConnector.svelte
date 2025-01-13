<!-- Node edges basically -->
<script lang="ts">
  import { Plus } from 'lucide-svelte';
  import { Button } from '../button';
  import { cn } from '$lib/utils';
  import type { CurrentlyActiveNodeType } from '$lib/components/utils';

  let {
    currentlyActiveNode = $bindable(),
    isEndNode = false,
    onclick
  }: {
    currentlyActiveNode: CurrentlyActiveNodeType;
    isEndNode: boolean;
    onclick: () => void;
  } = $props();

  const handleAddNode = () => {
    currentlyActiveNode = 'addNode';
    onclick();
  };
</script>

<!--  -->
<div class="flex flex-col items-center flex-grow min-h-[4rem]">
  <div class={cn('border border-foreground/25 max-w-0 flex-grow')}></div>
  <Button variant="outline" class="rounded-full" onclick={handleAddNode}>
    <Plus />
  </Button>
  {#if !isEndNode}
    <div class={cn('border border-foreground/25 max-w-0 flex-grow')}></div>
  {/if}
</div>
