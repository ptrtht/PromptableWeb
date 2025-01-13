<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import GridBackground from '$lib/components/ui/grid-background/GridBackground.svelte';
  import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
  import H4 from '$lib/components/ui/text/H4.svelte';
  import Paragraph from '$lib/components/ui/text/Paragraph.svelte';
  import { LoggingService } from '$lib/services/pipeline/LoggingService';
  import {
    type PipelineConfigJson,
    PipelineConfigSchema,
    type PipelineConfig,
  } from '$lib/services/schemas/PipelineConfig';
  import { PipelineStore } from '$lib/services/stores/PipelineStore';
  import { EllipsisVertical, Plus } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';
  import WebhookTriggerNodeView from '$lib/components/ui/nodes/triggers/WebhookTriggerNodeView.svelte';
  import NodeConnector from '$lib/components/ui/nodes/NodeConnector.svelte';
  import NodeView from '$lib/components/ui/nodes/NodeView.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Label } from '$lib/components/ui/label';
  import { Input } from '$lib/components/ui/input';
  import { supabase } from '$lib/services/utils/init';
  import NodeSidebarView from '$lib/components/ui/node-sidebar/NodeSidebarView.svelte';

  let pipelineRow: PipelineConfig | null = $state(null);
  let newPipelineName = $state('');
  let renameDialogOpen = $state(false);
  let currentlyActiveNode: null | keyof PipelineConfigJson['nodes'] = $state(
    ''
    // DEV

    // api node
    // '8ce124d7-a284-4d8a-8d18-4568c6c04f76'

    // 'input'

    //  llm
    // '5571ffcf-e755-4b56-adc5-b928dd09e476'
  );

  const savePipeline = async () => {
    if (pipelineRow) {
      const { error } = await supabase
        .from('pipelines')
        .update({
          name: newPipelineName,
        })
        .eq('id', pipelineRow.id);

      if (error) return toast.error('Failed to rename pipeline');

      pipelineRow.name = newPipelineName;
      toast.success('Pipeline renamed');
    }
  };

  onMount(async () => {
    const pipelineId = $page.params.pipelineId;

    console.log('pipelineId', pipelineId);

    if (!pipelineId) {
      toast.error('Pipeline not found');
      LoggingService.error('No pipelineId in page data');
      return goto('/pipelines');
    }

    try {
      const pipelineRes = await PipelineStore.getPipeline(pipelineId);
      pipelineRow = PipelineConfigSchema.parse(pipelineRes);
      newPipelineName = pipelineRow.name;
      pipelineEditingStore.set({
        pipeline: pipelineRow.pipeline,
        id: pipelineRow.id,
      });
    } catch (error) {
      LoggingService.error('Failed to get pipeline', error);
      toast.error('Pipeline not found');
      goto('/pipelines');
    }

    // scroll to #scroll-start
    const scrollStart = document.getElementById('scroll-start');
    console.log('scrollStart', scrollStart);
    if (scrollStart) {
      scrollStart.scrollIntoView();
    }
  });

  let startNode: string = $state('input');

  const getOrderedNodeKeys = () => {
    if (!$pipelineEditingStore) return [];
    return $pipelineEditingStore.pipeline.executionOrder;
  };
</script>

<Navbar
  breadcrumbs={[
    { label: 'Pipelines', href: '/pipelines' },
    pipelineRow
      ? {
          label: pipelineRow.name,
          href: `/pipelines/${pipelineRow.id}`,
        }
      : {
          label: '...',
          href: `#`,
        },
  ]}
>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <!-- <Button variant="ghost"> -->
      <EllipsisVertical />
      <!-- </Button> -->
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.GroupHeading>Pipeline settings</DropdownMenu.GroupHeading>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          onclick={() => {
            renameDialogOpen = true;
          }}
        >
          Rename
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
  <Dialog.Root bind:open={renameDialogOpen}>
    <Dialog.Trigger></Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Rename Pipeline</Dialog.Title>
        <Dialog.Description>Give your pipeline a new name</Dialog.Description>
      </Dialog.Header>
      <div class="flex flex-col py-4">
        <Label>Name</Label>
        {#if pipelineRow}
          <Input bind:value={newPipelineName} />
        {/if}
      </div>
      <Dialog.Footer>
        <Button
          onclick={() => {
            savePipeline();
            renameDialogOpen = false;
          }}
        >
          Save
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</Navbar>

<GridBackground>
  <div class="flex">
    <div class="relative h-full w-full flex flex-col flex-grow items-center justify-center py-[100vh]">
      <span class="max-h-0 pt-[10rem]" id="scroll-start"></span>
      {#if pipelineRow}
        <!-- INPUT NODE -->
        {#if !$pipelineEditingStore?.pipeline.input}
          <div class="h-full flex flex-col gap-6 justify-center-items-center">
            <div class="text-center max-w-sm text-balance">
              <H4>Add a pipeline trigger</H4>
              <Paragraph>A pipeline trigger is your user's initial input that will trigger this pipeline</Paragraph>
            </div>
            <!-- <AddTriggerNodeView>
              <div class="flex gap-2 items-center">
                <Plus size="1rem" />
                Add trigger
              </div>
            </AddTriggerNodeView> -->
          </div>
        {:else}
          <!-- DEBUG -->
          <WebhookTriggerNodeView bind:currentlyActiveNode />
          <!-- draw line that connects the nodes -->
          <NodeConnector
            bind:currentlyActiveNode
            isEndNode={Object.keys($pipelineEditingStore.pipeline.nodes).length === 0}
            onclick={() => {
              startNode = 'input';
              currentlyActiveNode = '';
              setTimeout(() => {
                currentlyActiveNode = 'addNode';
              }, 100);
            }}
          />
          {#each getOrderedNodeKeys() as name, idx}
            <NodeView bind:currentlyActiveNode nodeName={name} />
            <NodeConnector
              bind:currentlyActiveNode
              isEndNode={idx === Object.keys($pipelineEditingStore.pipeline.nodes).length - 1}
              onclick={() => {
                startNode = name;
                currentlyActiveNode = '';
                setTimeout(() => {
                  currentlyActiveNode = 'addNode';
                }, 100);
              }}
            />
          {/each}
          <!-- <pre
          class="max-w-[50vw]"
            style="
              white-space: pre-wrap;       /* Since CSS 2.1 */
              white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
              white-space: -pre-wrap;      /* Opera 4-6 */
              white-space: -o-pre-wrap;    /* Opera 7 */
              word-wrap: break-word;       /* Internet Explorer 5.5+ */
            ">{JSON.stringify($pipelineEditingStore.pipeline, null, 2)}</pre> -->
        {/if}
      {/if}
    </div>
    <NodeSidebarView bind:currentlyActiveNode {startNode} />
  </div>
</GridBackground>
