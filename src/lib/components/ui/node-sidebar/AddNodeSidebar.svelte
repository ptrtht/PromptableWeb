<script lang="ts">
  import { Brain, SearchIcon, Webhook } from 'lucide-svelte';
  import { AspectRatio } from '../aspect-ratio';
  import { Input } from '../input';
  import H4 from '../text/H4.svelte';
  import BaseNodeSidebar from './BaseNodeSidebar.svelte';
  import Paragraph from '../text/Paragraph.svelte';
  import { toast } from 'svelte-sonner';
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';
  import { type APINodeInput, APINodeInputSchema } from '$lib/services/schemas/nodes/APINode';
  import { type LLMNodeInput, LLMNodeInputSchema } from '$lib/services/schemas/nodes/LLMNode';

  let {
    open = $bindable(false),
    startNode,
  }: {
    open: boolean;
    startNode: 'input' | { name: string };
  } = $props();

  const handleLLMNode = () => {
    if (!$pipelineEditingStore) return toast.error('Pipeline not found');
    pipelineEditingStore.update((store) => {
      if (store) {
        const nodes = $pipelineEditingStore.pipeline.nodes;

        // LLM Base Config:
        const config: LLMNodeInput = LLMNodeInputSchema.parse({
          model: 'openai/gpt-4o',
          messages: [],
          credentials: [],
        });

        const nodeName = crypto.randomUUID();

        // add a new entry to the record
        $pipelineEditingStore.pipeline.nodes = {
          ...nodes,
          [nodeName]: {
            type: 'llm',
            config,
          },
        };

        // if input, then add to the start
        if (startNode === 'input') {
          //   set it to be first in execution order
          $pipelineEditingStore.pipeline.executionOrder = [nodeName, ...$pipelineEditingStore.pipeline.executionOrder];
        } else {
          //   add it after the start node
          const nodeNames = $pipelineEditingStore.pipeline.executionOrder;
          const startIndex = nodeNames.indexOf(startNode.name);
          if (startIndex !== -1) {
            $pipelineEditingStore.pipeline.executionOrder = [
              ...nodeNames.slice(0, startIndex + 1),
              nodeName,
              ...nodeNames.slice(startIndex + 1),
            ];
          }
        }
      }
      return store;
    });
    open = false;
  };

  const handleAPICallNode = () => {
    if (!$pipelineEditingStore) return toast.error('Pipeline not found');
    pipelineEditingStore.update((store) => {
      if (store) {
        const nodes = $pipelineEditingStore.pipeline.nodes;

        // API Call Base Config:
        const config: APINodeInput = APINodeInputSchema.parse({
          url: 'https://api.example.com',
          method: 'GET',
        });

        const nodeName = crypto.randomUUID();

        // add a new entry to the record
        $pipelineEditingStore.pipeline.nodes = {
          ...nodes,
          [nodeName]: {
            type: 'api_call',
            config,
          },
        };

        // if input, then add to the start
        if (startNode === 'input') {
          //   set it to be first in execution order
          $pipelineEditingStore.pipeline.executionOrder = [nodeName, ...$pipelineEditingStore.pipeline.executionOrder];
        } else {
          //   add it after the start node
          const nodeNames = $pipelineEditingStore.pipeline.executionOrder;
          const startIndex = nodeNames.indexOf(startNode.name);
          if (startIndex !== -1) {
            $pipelineEditingStore.pipeline.executionOrder = [
              ...nodeNames.slice(0, startIndex + 1),
              nodeName,
              ...nodeNames.slice(startIndex + 1),
            ];
          }
        }
      }
      return store;
    });
    open = false;
  };
</script>

<BaseNodeSidebar bind:open>
  {#snippet title()}
    <H4>Add a node</H4>
  {/snippet}

  <div class="relative h-10 w-full">
    <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 p-1" />
    <Input
      type="text"
      placeholder="Search nodes"
      class="pl-10 pr-3 py-2 text-md w-full border border-muted rounded-xl shadow-sm bg-muted focus:outline-none focus:ring-2 focus:ring-[#6E23DD] focus:border-transparent"
      value=""
    />
  </div>

  <button class="flex gap-3 w-full items-center justify-start" onclick={handleLLMNode}>
    <div class="w-[3rem]">
      <AspectRatio ratio={1 / 1} class="bg-muted rounded-lg">
        <Brain class="h-full w-full rounded-md object-cover p-2 text-foreground/75" />
      </AspectRatio>
    </div>
    <div class="text-left">
      <H4>Run an LLM</H4>
      <Paragraph variant="muted">Run a Language Model</Paragraph>
    </div>
  </button>
  <button class="flex gap-3 w-full items-center justify-start" onclick={handleAPICallNode}>
    <div class="w-[3rem]">
      <AspectRatio ratio={1 / 1} class="bg-muted rounded-lg">
        <Webhook class="h-full w-full rounded-md object-cover p-2 text-foreground/75" />
      </AspectRatio>
    </div>
    <div class="text-left">
      <H4>Make an API call</H4>
      <Paragraph variant="muted" class="">Retrieve or submit data through an API</Paragraph>
    </div>
  </button>

  {#snippet actions()}
    <span></span>
  {/snippet}
</BaseNodeSidebar>
