<script lang="ts">
  import BaseNodeSidebar from './BaseNodeSidebar.svelte';
  import type { CurrentlyActiveNodeType } from '$lib/components/utils';
  import { Button } from '../button';
  import { X } from 'lucide-svelte';
  import AddNodeSidebarContent from './other-content/AddNodeSidebarContent.svelte';
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';
  import ApiNodeSidebarContent from './node-content/APINodeSidebarContent.svelte';
  import WebhookTriggerSidebarContent from './other-content/WebhookTriggerSidebarContent.svelte';
  import LlmNodeSidebarContent from './node-content/LLMNodeSidebarContent.svelte';
  import { LoggingService } from '$lib/services/pipeline/LoggingService';

  let {
    currentlyActiveNode = $bindable(),
    startNode
  }: {
    currentlyActiveNode: CurrentlyActiveNodeType;
    startNode?: string
  } = $props();

  let node = $derived(
    currentlyActiveNode && currentlyActiveNode !== 'addNode' && currentlyActiveNode !== 'input'
      ? $pipelineEditingStore?.pipeline.nodes[currentlyActiveNode]
      : null
  );

  $effect(() => {
    LoggingService.debug('startNode', startNode); 
  });
</script>

<BaseNodeSidebar bind:currentlyActiveNode>
  <div class="flex justify-end items-center">
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
          <LlmNodeSidebarContent bind:currentlyActiveNode />
        {/if}
      {/if}
      {#if currentlyActiveNode === 'input'}
        <WebhookTriggerSidebarContent />
      {/if}
      {#if currentlyActiveNode === 'addNode'}
        <AddNodeSidebarContent {startNode} bind:currentlyActiveNode />
      {/if}
    {/if}
  </div>
</BaseNodeSidebar>
