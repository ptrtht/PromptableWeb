<script lang="ts">
  import type { PipelineConfigJson } from '$lib/services/schemas/PipelineConfig';
  import BaseNodeSidebar from './BaseNodeSidebar.svelte';
  import H4 from '../text/H4.svelte';
  import type { CurrentlyActiveNodeType } from '$lib/components/utils';
  import { Button } from '../button';
  import { X } from 'lucide-svelte';
  import AddNodeSidebarContent from './AddNodeSidebarContent.svelte';
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';
  import ApiNodeSidebarContent from './APINodeSidebarContent.svelte';

  let {
    currentlyActiveNode = $bindable(),
  }: {
    currentlyActiveNode: CurrentlyActiveNodeType;
  } = $props();

  let node = $derived(
    currentlyActiveNode && currentlyActiveNode !== 'addNode' && currentlyActiveNode !== 'input'
      ? $pipelineEditingStore?.pipeline.nodes[currentlyActiveNode]
      : null
  );
</script>

<BaseNodeSidebar bind:currentlyActiveNode>
  <div class="flex place-content-between items-center">
    {#if currentlyActiveNode === 'addNode'}
      <H4>Add a node</H4>
    {:else if node}
      <span></span>
    {/if}

    <Button variant="ghost" onclick={() => (currentlyActiveNode = null)}>
      <X />
    </Button>
  </div>
  <div class="flex flex-col gap-6 p-2">
    {#if currentlyActiveNode}
      {#if node}
        {#if node.type === 'api_call'}
          <ApiNodeSidebarContent bind:currentlyActiveNode />
        {:else if node.type === 'llm'}
          <H4>LLM NODE PLACEHOLDER</H4>
        {/if}
      {/if}
      {#if currentlyActiveNode === 'addNode'}
        <AddNodeSidebarContent />
      {/if}
    {/if}
  </div>
</BaseNodeSidebar>