<script lang="ts">
  import type { CurrentlyActiveNodeType } from '$lib/components/utils';
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';
  import { cn } from '$lib/utils';
  import { Hammer, Play, Plus, Trash } from 'lucide-svelte';
  import { Label } from '../../label';
  import { Input } from '../../input';
  import LlmModelSelect from '../../llm-model-select/LLMModelSelect.svelte';
  import { Checkbox } from '../../checkbox';
  import { Textarea } from '../../textarea';
  import { Slider } from '../../slider';
  import * as Select from '../../select';
  import { Button } from '../../button';
  import { executeNode, getAllKeys, nodeExecutionsStore } from '$lib/stores/nodeExecutionsStore';
  import { onMount } from 'svelte';
  import CodemirrorInput from '../../codemirror-input/CodemirrorInput.svelte';

  let {
    currentlyActiveNode = $bindable(),
  }: {
    currentlyActiveNode: CurrentlyActiveNodeType;
  } = $props();

  let selectedMenuItem: 'Build' | 'Output' = $state('Build');

  let customModel: boolean = $state(false);

  onMount(() => {
    testRunOutput = $nodeExecutionsStore[currentlyActiveNode ?? ''] ?? {};
  });

  const addMessage = () => {
    if (!currentlyActiveNode || $pipelineEditingStore?.pipeline.nodes[currentlyActiveNode].type != 'llm') return;
    $pipelineEditingStore?.pipeline.nodes[currentlyActiveNode].config.messages.push({
      role: 'user',
      content: '',
    });
  };

  const removeMessage = (index: number) => {
    if (!currentlyActiveNode || $pipelineEditingStore?.pipeline.nodes[currentlyActiveNode].type != 'llm') return;
    $pipelineEditingStore?.pipeline.nodes[currentlyActiveNode].config.messages.splice(index, 1);
  };

  let testRunOutput: Record<string, any> = $state({});

  let testRunOutputVariables: string[] = $state([]);

  $effect(() => {
    testRunOutputVariables = getAllKeys(testRunOutput);
  });
</script>

{#if currentlyActiveNode && $pipelineEditingStore?.pipeline.nodes[currentlyActiveNode]?.type === 'llm'}
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
      <span> Test </span>
    </button>
  </div>
  {#if $pipelineEditingStore.pipeline.nodes[currentlyActiveNode].type === 'llm'}
    {#if selectedMenuItem === 'Build'}
      <!-- node name -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <Label>Node name</Label>
          <Input bind:value={$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].name} />
        </div>
        <div class="flex gap-2 items-center">
          <Checkbox bind:checked={customModel} />
          <Label>Use a custom model</Label>
        </div>
        <div class="flex flex-col gap-2">
          <div class="grid grid-cols-3">
            <Label class="text-muted-foreground/50">Provider</Label>
            <Label class="text-muted-foreground/50">Model</Label>
          </div>
          <LlmModelSelect
            bind:value={$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.model}
            {customModel}
          />
        </div>

        <div class="flex flex-col gap-2">
          <Label>System Prompt</Label>
          <CodemirrorInput />
          <Textarea bind:value={$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.system} />
        </div>

        <!-- MESSAGES HERE? -->
        <div class="flex flex-col gap-2">
          <div class="flex place-content-between">
            <Label>Messages</Label>
            <Label class="text-muted-foreground/50">
              <Plus size="1.2rem" class="text-foreground/50 justify-self-end cursor-pointer" onclick={addMessage} />
            </Label>
          </div>
          {#each $pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.messages as message, index}
            <Select.Root type="single" bind:value={message.role}>
              <span class="flex items-center gap-2">
                <Select.Trigger>
                  {message.role ?? 'Select a role'}
                </Select.Trigger>
                <Trash
                  size="1rem"
                  class="text-foreground/50 cursor-pointer ml-3"
                  onclick={() => {
                    removeMessage(index);
                  }}
                />
              </span>
              <Select.Content>
                <!-- "system" | "user" | "assistant" -->
                <Select.Item value="system">System</Select.Item>
                <Select.Item value="user">User</Select.Item>
                <Select.Item value="assistant">Assistant</Select.Item>
              </Select.Content>
            </Select.Root>
            <Textarea bind:value={message.content} />
          {/each}
          {#if $pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.messages.length === 0}
            <Label class="text-muted-foreground/50">No messages added</Label>
          {/if}
        </div>

        <div class="flex flex-col gap-2">
          <Label>Max Tokens</Label>
          <Input
            type="number"
            bind:value={$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.max_tokens}
          />
        </div>

        <div class="flex flex-col gap-2">
          <Label>Top P</Label>
          <Input min={0} max={1} bind:value={$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.top_p} />
        </div>

        <div class="flex flex-col gap-2">
          <Label>Top K</Label>
          <Input bind:value={$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.top_k} />
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex place-content-between">
            <Label>Temperature</Label>
            <Label class="text-muted-foreground/50">
              {$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.temperature}
            </Label>
          </div>
          <Slider
            type="single"
            class="mb-2"
            bind:value={$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.temperature}
            min={0}
            max={2}
            step={0.1}
          />
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex place-content-between">
            <Label>Frequency Penalty</Label>
            <Label class="text-muted-foreground/50">
              {$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.frequency_penalty}
            </Label>
          </div>
          <Slider
            type="single"
            class="mb-2"
            bind:value={$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.frequency_penalty}
            min={-2}
            max={2}
          />
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex place-content-between">
            <Label>Presence Penalty</Label>
            <Label class="text-muted-foreground/50">
              {$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.presence_penalty}
            </Label>
          </div>
          <Slider
            type="single"
            class="mb-2"
            bind:value={$pipelineEditingStore.pipeline.nodes[currentlyActiveNode].config.presence_penalty}
            min={-2}
            max={2}
            step={0.1}
          />
        </div>

        <div class="flex flex-col gap-2">
          <Label>Stop Sequences</Label>
        </div>

        <!-- ?
      // !provider / modelname
      // model: LLMModelSchema,

      // system: z.string().optional(),
      messages: z.array(MessageSchema),

      ? hyper params
      temperature: z.number().min(0).max(2).optional().default(0.7),
      max_tokens: z.number().positive().optional(),
      top_p: z.number().min(0).max(1).optional(),
      top_k: z.number().positive().optional(),
      frequency_penalty: z.number().min(-2).max(2).optional(),
      presence_penalty: z.number().min(-2).max(2).optional(),
      stop_sequences: z.array(z.string()).optional(),
       ? -->
      </div>
    {:else if selectedMenuItem === 'Output'}
      <div class="flex flex-col gap-2">
        <div>
          <Label>Output</Label>
          <Textarea value={JSON.stringify(testRunOutput, null, 2)} disabled />
        </div>
        <div>
          <Label>Variables:</Label>
          <Textarea value={testRunOutputVariables.join('\n')} disabled />
        </div>
      </div>
      <Button
        onclick={async () => {
          const result = await executeNode(currentlyActiveNode);
          testRunOutput = result?.output;
        }}
      >
        Test
      </Button>
    {/if}
  {/if}
{/if}
