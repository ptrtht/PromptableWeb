<!-- Node edges basically -->
<script lang="ts">
  import { Plus } from 'lucide-svelte';
  import { Button } from '../button';
  import { cn } from '$lib/utils';
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';
  import AddNodeSidebar from '../node-sidebar/AddNodeSidebar.svelte';

  let {
    startNode,
  }: {
    startNode:
      | 'input'
      | {
          name: string;
        };
  } = $props();

  let endNode: string | null = $state(null);

  $effect(() => {
    if (!$pipelineEditingStore) return;

    const nodeNames = $pipelineEditingStore.pipeline.executionOrder;
    // find the node name that is after the start node
    // if its input then it's the -1 index
    if (startNode === 'input') {
      endNode = nodeNames[0];
      return;
    }

    const startIndex = nodeNames.indexOf(startNode.name);
    // might be the last node
    if (startIndex !== -1) {
      endNode = nodeNames[startIndex + 1];
    }
  });

  const handleAddNode = () => {
    open = true
  };

  let open = $state(false);
</script>
 
<!--  -->

<div class={cn('border border-foreground/25 h-full max-w-0 max-h-10')}></div>
<Button variant="outline" class="rounded-full" onclick={handleAddNode}>
  <Plus />
</Button>
{#if endNode}
  <div class={cn('border border-foreground/25 h-full max-w-0', 'max-h-10')}></div>
{/if}

<AddNodeSidebar bind:open {startNode} />
