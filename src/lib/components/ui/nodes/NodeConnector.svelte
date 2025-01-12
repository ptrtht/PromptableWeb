<!-- Node edges basically -->
<script lang="ts">
  import { Plus } from 'lucide-svelte';
  import { Button } from '../button';
  import { cn } from '$lib/utils';
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';
  import type { CurrentlyActiveNodeType } from '$lib/components/utils';
  import type { PipelineConfigJson } from '$lib/services/schemas/PipelineConfig';
  import { toast } from 'svelte-sonner';

  let {
    startNode,
    currentlyActiveNode = $bindable(),
  }: {
    currentlyActiveNode: CurrentlyActiveNodeType;
    startNode: 'input' | string;
  } = $props();

  let isEndNode = $derived(() => {
    if (!$pipelineEditingStore?.pipeline) return false;
    // if input and exec order is empty, then it is the end node
    if (startNode === 'input' && $pipelineEditingStore.pipeline.executionOrder.length === 0) {
      return true;
    }

    const startNodeIndex = $pipelineEditingStore.pipeline.executionOrder.indexOf(startNode);
    const nodesLength = $pipelineEditingStore.pipeline.executionOrder.length;

    // if the start node is the last node in the execution order, then it is the end node
    if (startNodeIndex === nodesLength - 1) {
      return true;
    }
  });

  $effect(() => {
    if (!$pipelineEditingStore) return;

    // find the node key that is not in executionOrder
    const nodeKeys = Object.keys($pipelineEditingStore.pipeline.nodes);
    const executionOrder = $pipelineEditingStore.pipeline.executionOrder;
    const newKey = nodeKeys.find((key) => !executionOrder.includes(key));
    // if there is no new key, then no node was added
    if (!newKey) return;

    // add the node key to the execution order after the startNode
    if (startNode === 'input') {
      $pipelineEditingStore.pipeline.executionOrder = [newKey, ...executionOrder];
    } else {
      const index = executionOrder.indexOf(startNode);
      $pipelineEditingStore.pipeline.executionOrder = [
        ...executionOrder.slice(0, index + 1),
        newKey,
        ...executionOrder.slice(index + 1),
      ];
    }
    toast.success('Node added');
  });

  const handleAddNode = () => {
    currentlyActiveNode = 'addNode';
  };
</script>

<!--  -->
<div class="flex flex-col items-center flex-grow min-h-[4rem]">
  <div class={cn('border border-foreground/25 max-w-0 flex-grow')}></div>
  <Button variant="outline" class="rounded-full" onclick={handleAddNode}>
    <Plus />
  </Button>
  {#if !isEndNode()}
    <div class={cn('border border-foreground/25 max-w-0 flex-grow')}></div>
  {/if}
</div>
