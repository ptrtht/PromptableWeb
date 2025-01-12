<script lang="ts">
  import * as Select from '$lib/components/ui/select/index.js';
  import { cn, type CurrentlyActiveNodeType } from '$lib/components/utils';
  import { Braces, Code, Hammer, Link2, Play, Plus, TableProperties, Trash } from 'lucide-svelte';
  import { Label } from '../label';
  import { Input } from '../input';
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import ObjectInput from '../object-input/ObjectInput.svelte';
  import Textarea from '../textarea/textarea.svelte';
  import type { APINodeInput } from '$lib/services/schemas/nodes/APINode';

  let {
    currentlyActiveNode = $bindable(),
  }: {
    currentlyActiveNode: CurrentlyActiveNodeType;
  } = $props();

  let selectedMenuItem: 'Build' | 'Output' = $state('Build');
  let selectedPayloadItem: 'JSON' | 'Url Encoded' | 'Form Data' = $state('JSON');

  const onJsonSelect = () => {
    if (!$pipelineEditingStore || !currentlyActiveNode) return toast.error('Pipeline not found');
    ($pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config as APINodeInput).formData = {};
    ($pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config as APINodeInput).formUrlEncoded = {};
  };

  const onFormSelect = () => {
    if (!$pipelineEditingStore || !currentlyActiveNode) return toast.error('Pipeline not found');
    ($pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config as APINodeInput).body = '';
    ($pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config as APINodeInput).formUrlEncoded = {};
  };

  const onUrlEncodedSelect = () => {
    if (!$pipelineEditingStore || !currentlyActiveNode) return toast.error('Pipeline not found');
    ($pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config as APINodeInput).body = '';
    ($pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config as APINodeInput).formData = {};
  };

  onMount(() => {
    if (!currentlyActiveNode) {
      toast.error('Node not found');
      throw new Error('Node not found');
    }
    if (!$pipelineEditingStore?.pipeline) {
      toast.error('Pipeline not found');
      throw new Error('Pipeline not found');
    }
  });
</script>

<div class="flex rounded-xl gap-2 border border-muted">
  <button
    class={cn(
      'flex flex-grow items-center justify-center p-2 rounded-xl cursor-pointer gap-2',
      selectedMenuItem == 'Build' ? 'bg-accent' : ''
    )}
    onclick={() => {
      selectedMenuItem = 'Build';
    }}
  >
    <Hammer size="1rem" />
    <span> Build </span>
  </button>

  <button
    class={cn(
      'flex flex-grow items-center justify-center p-2 rounded-xl cursor-pointer gap-2',
      selectedMenuItem == 'Output' ? 'bg-accent' : ''
    )}
    onclick={() => {
      selectedMenuItem = 'Output';
    }}
  >
    <Play size="1rem" />
    <span> Output </span>
  </button>
</div>
{#if currentlyActiveNode && $pipelineEditingStore?.pipeline.nodes[currentlyActiveNode]?.type === 'api_call'}
  {#if selectedMenuItem === 'Build'}
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <Label>Node name</Label>
        <Input bind:value={$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].name} />
      </div>
      <div class="flex flex-col gap-1">
        <Label>API request method</Label>
        <Select.Root type="single" bind:value={$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.method}>
          <Select.Trigger>
            {$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.method}
          </Select.Trigger>
          <Select.Content>
            <!-- 'GET', 'POST', 'PUT', 'DELETE' -->
            <Select.Item value="GET">GET: Fetch information</Select.Item>
            <Select.Item value="POST">POST: Create something new</Select.Item>
            <Select.Item value="PUT">PUT: Update existing information</Select.Item>
            <Select.Item value="DELETE">DELETE: Remove something</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
      <div class="flex flex-col gap-1">
        <Label>URL</Label>
        <Input bind:value={$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.url} />
      </div>
      <div class="flex flex-col gap-1">
        <Label>Headers</Label>
        <div class="flex flex-col gap-1 w-full">
          <ObjectInput bind:object={$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.headers} />
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <Label>Query parameters</Label>
        <div class="flex flex-col gap-1 w-full">
          <ObjectInput bind:object={$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.queryParams} />
        </div>
      </div>
        <Label class="mt-3">Request body</Label>
      <div class="flex rounded-xl gap-2 border border-muted">
        <button
          class={cn(
            'flex flex-grow items-center justify-center p-2 rounded-xl cursor-pointer gap-2',
            selectedPayloadItem == 'JSON' ? 'bg-accent' : ''
          )}
          onclick={() => {
            onJsonSelect();
            selectedPayloadItem = 'JSON';
          }}
        >
          <Braces size="1rem" />
          <span> Json </span>
        </button>
        <button
          class={cn(
            'flex flex-grow items-center justify-center p-2 rounded-xl cursor-pointer gap-2',
            selectedPayloadItem == 'Form Data' ? 'bg-accent' : ''
          )}
          onclick={() => {
            onFormSelect();
            selectedPayloadItem = 'Form Data';
          }}
        >
          <TableProperties size="1rem" />
          <span> Form data </span>
        </button>

        <button
          class={cn(
            'flex flex-grow items-center justify-center p-2 rounded-xl cursor-pointer gap-2',
            selectedPayloadItem == 'Url Encoded' ? 'bg-accent' : ''
          )}
          onclick={() => {
            onUrlEncodedSelect();
            selectedPayloadItem = 'Url Encoded';
          }}
        >
          <Link2 size="1rem" />
          <span> Url encoded </span>
        </button>
      </div>

      {#if selectedPayloadItem === 'JSON'}
        <div class="flex flex-col gap-1">
          <Label>JSON payload</Label>
          <Textarea bind:value={$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.body} />
        </div>
      {:else if selectedPayloadItem === 'Form Data'}
        <div class="flex flex-col gap-1">
          <Label>Form data</Label>
          <ObjectInput bind:object={$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.formData} />
        </div>
      {:else if selectedPayloadItem === 'Url Encoded'}
        <div class="flex flex-col gap-1">
          <Label>Url encoded</Label>
          <ObjectInput bind:object={$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.formUrlEncoded} />
        </div>
      {/if}
    </div>
  {/if}
{/if}
