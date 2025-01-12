<script lang="ts">
  import { slide } from 'svelte/transition';
  import { Checkbox } from '../../checkbox';
  import { Label } from '../../label';
  import H4 from '../../text/H4.svelte';
  import Paragraph from '../../text/Paragraph.svelte';
  import { AspectRatio } from '../../aspect-ratio';
  import { Code, Copy, SquareSlash, Webhook } from 'lucide-svelte';
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';
  import { Input } from '../../input';
  import { Button } from '../../button';
  import CodeInput from '../../code-input/CodeInput.svelte';
  import { toast } from 'svelte-sonner';
  import ObjectInput from '../../object-input/ObjectInput.svelte';
  import * as Select from '$lib/components/ui/select/index.js';
  import { cn } from '$lib/utils';
  import type { Tables } from '$lib/services/utils/init';
  import { onMount } from 'svelte';
  import { ApiKeyStore } from '$lib/services/stores/ApiKeyStore';
  import { browser } from '$app/environment';

  let selectedMenuItem: 'Curl' | 'Promptable SDK' = $state('Curl');
  let selectedKeyId: string | undefined = $state();
  let apiKeys: Tables['api_keys']['Row'][] = $state([]);

  onMount(async () => {
    apiKeys = await ApiKeyStore.getKeys();
  });

  //   current tld / api/v0/pipelines/webook/:id
  let webhookUrl = $derived(
    browser ? window.location.origin + '/api/v0/pipelines/webhook/' + $pipelineEditingStore?.id : ''
  );

  const copyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success('URL copied to clipboard');
  };
</script>

{#if $pipelineEditingStore}
  <div class="flex flex-col gap-4">
    <div class="text-left">
      <H4>Webhook Trigger</H4>
    </div>

    <Paragraph variant="muted">
      A webhook trigger is a URL that you can use to trigger a pipeline from an external service
    </Paragraph>

    <div class="flex flex-col gap-1">
      <Label>
        <Paragraph>Node name</Paragraph>
      </Label>
      <Input bind:value={$pipelineEditingStore.pipeline.input.name} placeholder="Pipeline trigger" />
    </div>

    <div class="flex flex-col gap-1">
      <Label>
        <Paragraph>Api key</Paragraph>
      </Label>
      <Select.Root type="single" bind:value={selectedKeyId}>
        <Select.Trigger>
          {apiKeys.find((key) => key.id === Number(selectedKeyId))?.name ?? 'Select an API key'}
        </Select.Trigger>
        <Select.Content>
          <!-- <Select.Item value="light">Light</Select.Item> -->
          {#each apiKeys as key}
            <Select.Item value={String(key.id)}>{key.name}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
      <p class="text-muted-foreground">This is only for the examples below.</p>
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <Checkbox bind:checked={$pipelineEditingStore.pipeline.input.validate} aria-labelledby="terms-label" />
        <Label>
          <Paragraph>Input validation</Paragraph>
        </Label>
      </div>
      <Paragraph variant="muted">Validate incoming requests based on a schema</Paragraph>
    </div>

    {#if $pipelineEditingStore.pipeline.input.validate}
      <div class="flex flex-col gap-2" transition:slide>
        <Label>
          <Paragraph>Input Body Schema</Paragraph>
        </Label>
        <Paragraph variant="muted">
          Define the schema for the incoming request body. This will be used to validate the incoming request
        </Paragraph>
        <div class="grid gap-2">
          <ObjectInput
            bind:object={$pipelineEditingStore.pipeline.input.schema}
            select={[
              { value: 'string', label: 'String' },
              { value: 'number', label: 'Number' },
              { value: 'boolean', label: 'Boolean' },
              { value: 'object', label: 'Object' },
              { value: 'array', label: 'Array' },
            ]}
          />
        </div>
      </div>
    {/if}

    <div class="flex rounded-xl gap-2 border border-muted">
      <button
        class={cn(
          'flex flex-grow items-center justify-center p-2 rounded-xl cursor-pointer gap-2',
          selectedMenuItem == 'Curl' ? 'bg-accent' : ''
        )}
        onclick={() => {
          selectedMenuItem = 'Curl';
        }}
      >
        <SquareSlash size="1rem" />
        <span> Curl </span>
      </button>

      <button
        class={cn(
          'flex flex-grow items-center justify-center p-2 rounded-xl cursor-pointer gap-2',
          selectedMenuItem == 'Promptable SDK' ? 'bg-accent' : ''
        )}
        onclick={() => {
          selectedMenuItem = 'Promptable SDK';
        }}
      >
        <Code size="1rem" />
        <span> Promptable SDK </span>
      </button>
    </div>

    <div class="flex flex-col gap-4">
      {#if selectedMenuItem === 'Curl'}
        <div class="flex flex-col gap-2">
          <Label>
            <Paragraph>Webhook URL</Paragraph>
          </Label>
          <div class="flex-grow h-content">
            <CodeInput
              disabled
              value={`curl -X POST ${webhookUrl} \\
    -H "Content-Type: application/json" \\
    -H "x-api-key: ${apiKeys.find((key) => key.id === Number(selectedKeyId))?.key ?? '<API-KEY>'}" \\
    -d '
${JSON.stringify(
  $pipelineEditingStore.pipeline.input.validate ? $pipelineEditingStore.pipeline.input.schema : {},
  null,
  2
)
  // add spacing to each line
  .split('\n')
  .map((line) => '      ' + line)
  .join('\n')}
    '`}
            />
          </div>
        </div>
      {/if}

      {#if selectedMenuItem === 'Promptable SDK'}
        <Label>
          <Paragraph>Promptable SDK</Paragraph>
        </Label>
        <div class="flex-grow h-content">
          <CodeInput
            disabled
            value={`const promptable = new Promptable('<API_KEY>')

const response = await promptable.pipeline(
    '${$pipelineEditingStore.id}',
${JSON.stringify(
  $pipelineEditingStore.pipeline.input.validate ? $pipelineEditingStore.pipeline.input.schema : {},
  null,
  2
)
  //  add spacing to each line
  .split('\n')
  .map((line) => '       ' + line)
  .join('\n')}
    )
`}
          />
        </div>
      {/if}
    </div>
  </div>
{/if}
