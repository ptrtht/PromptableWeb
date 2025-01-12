<script lang="ts">
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';
  import { cn } from '$lib/utils';
  import { toast } from 'svelte-sonner';
  import Paragraph from '../text/Paragraph.svelte';
  import BaseNodeView from './BaseNodeView.svelte';
  import { Edit, Ellipsis, Trash, Webhook, Zap } from 'lucide-svelte';
  import { Badge } from '../badge';
  import { Button } from '../button';
  import * as Popover from '../popover';
  import type { CurrentlyActiveNodeType } from '$lib/components/utils';
  import APINodeContent from './node-content/APINodeContent.svelte';
  
  let {
    currentlyActiveNode = $bindable(),
    nodeName,
  }: {
    currentlyActiveNode: CurrentlyActiveNodeType;
    nodeName: string;
  } = $props();

  let active = $derived(nodeName === currentlyActiveNode);
  let node = $derived($pipelineEditingStore?.pipeline.nodes[nodeName]);

  let popoverOpen = $state(false);

  const onDeleteNode = () => {
    popoverOpen = false;
    if (!$pipelineEditingStore) return toast.error('Pipeline not found');
    pipelineEditingStore.update((store) => {
      if (store) {
        const nodes = $pipelineEditingStore.pipeline.nodes;
        delete nodes[nodeName];
        $pipelineEditingStore.pipeline.nodes = nodes;

        $pipelineEditingStore.pipeline.executionOrder = $pipelineEditingStore.pipeline.executionOrder.filter(
          (node) => node !== nodeName
        );
        toast.success('Node deleted');
      }
      return store;
    });
  };
</script>

<BaseNodeView {nodeName} bind:currentlyActiveNode class={cn('border border-width:5 border-primary/25 shadow-none')}>
  {#snippet header()}
    <div class={cn('flex place-content-between')}>
      <div class="flex items-center gap-2">
        {#if node?.type === 'api_call' }
          <Webhook size="1.2rem" />
        {:else}
          <Zap fill="currentColor" size="1rem" />
        {/if}
        <Paragraph class={cn('font-bold', active ? 'text-muted' : 'text-foreground')}>
          {node?.name ?? 'New Node'}
        </Paragraph>
      </div>
      <div class="flex gap-2">
        <Badge variant={active ? 'default' : 'outline'} class={active ? 'border-primary-foreground' : ''}>Output</Badge>
        <Popover.Root bind:open={popoverOpen}>
          <Popover.Trigger>
            <Ellipsis />
          </Popover.Trigger>
          <Popover.Content side="right" class="m-5 p-0 max-w-[10rem] ">
            <div class="flex flex-col w-full gap-0">
              <Button
                variant="ghost"
                class="flex items-center justify-start gap-2"
                onclick={() => {
                  popoverOpen = false;
                  currentlyActiveNode = nodeName;
                }}
              >
                <Edit />
                Edit Node
              </Button>
              <Button variant="ghost" class="flex items-center justify-start gap-2" onclick={onDeleteNode}>
                <Trash />
                Delete Node
              </Button>
            </div>
          </Popover.Content>
        </Popover.Root>
      </div>
    </div>
  {/snippet}
  <div class="flex flex-col gap-2 flex-grow text-foreground">
    {#if node?.type === 'api_call'}
      <APINodeContent {node} />
    {/if}
  </div>
</BaseNodeView>
