<script lang="ts">
  import { Copy, Webhook, X } from 'lucide-svelte';
  import { AspectRatio } from '../aspect-ratio';
  import H4 from '../text/H4.svelte';
  import BaseNodeSidebar from './BaseNodeSidebar.svelte';
  import { Label } from '../label';
  import { Checkbox } from '../checkbox';
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';
  import Paragraph from '../text/Paragraph.svelte';
  import { Input } from '../input';
  import { Button } from '../button';
  import { toast } from 'svelte-sonner';
  import * as Select from '../select';
  import { slide } from 'svelte/transition';
  import { SchemaTypeEnum } from '$lib/services/schemas/PipelineConfig';
  import CodeInput from '../code-input/CodeInput.svelte';
  import ToggleMenu from '../togge-menu/ToggleMenu.svelte';

  let {
    open = $bindable(false),
  }: {
    open: boolean;
  } = $props();

  let requestURL = `https://app.getpromptable.com/api/v0/pipelines/webhook/${$pipelineEditingStore?.id}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(requestURL);
    toast.success('URL copied to clipboard');
  };

  $effect(() => {
    if (!$pipelineEditingStore) return;
    if (
      $pipelineEditingStore.pipeline.input.validate &&
      Object.keys($pipelineEditingStore.pipeline.input.schema).length === 0
    ) {
      $pipelineEditingStore.pipeline.input.schema = {
        key: 'string',
      };
    }
  });

  type SchemaType = 'string' | 'number' | 'boolean' | 'array' | 'object';
  type Schema = Record<string, SchemaType>;

  interface SchemaEntry {
    originalKey: string;
    currentKey: string;
    value: SchemaType;
  }

  // Derived state for entries
  let entries = $derived(
    Object.entries($pipelineEditingStore?.pipeline.input.schema ?? {}).map(
      ([key, value]) =>
        ({
          originalKey: key,
          currentKey: key,
          value,
        }) as SchemaEntry
    )
  );

  function updateKey(entry: SchemaEntry, newKey: string) {
    if (newKey !== entry.originalKey && newKey.trim() !== '') {
      const newSchema: Schema = {};

      // Rebuild the schema with the updated key
      for (const item of entries) {
        if (item === entry) {
          newSchema[newKey] = item.value;
        } else {
          newSchema[item.originalKey] = item.value;
        }
      }

      // Update the schema state
      pipelineEditingStore.update((store) => {
        if (store) store.pipeline.input.schema = newSchema;
        return store;
      });
    }
  }

  function updateType(entry: SchemaEntry, newType: SchemaType | string) {
    pipelineEditingStore.update((store) => {
      if (store)
        store.pipeline.input.schema = {
          ...store.pipeline.input.schema,
          [entry.originalKey]: newType as SchemaType,
        };
      return store;
    });
  }

  function removeField(entry: SchemaEntry) {
    if (!$pipelineEditingStore) return;

    const { [entry.originalKey]: removed, ...rest } = $pipelineEditingStore.pipeline.input.schema;

    pipelineEditingStore.update((store) => {
      if (store) store.pipeline.input.schema = rest;
      return store;
    });
  }

  function addNewField() {
    let newKey = 'newField';
    let counter = 1;

    // Ensure unique key
    while (newKey in ($pipelineEditingStore?.pipeline.input.schema ?? {})) {
      newKey = `newField${counter}`;
      counter++;
    }

    pipelineEditingStore.update((store) => {
      if (store) store.pipeline.input.schema = { ...store.pipeline.input.schema, [newKey]: 'string' };
      return store;
    });
  }

  let selectedMenuItems: string[] = $state(['API Request']);
</script>

<BaseNodeSidebar bind:open>
  {#snippet title()}
    <div>
      <div class="flex gap-3 w-full items-center justify-start">
        <div class="w-[3rem]">
          <AspectRatio ratio={1 / 1} class="bg-muted rounded-lg">
            <Webhook class="h-full w-full rounded-md object-cover p-2 text-foreground/75" />
          </AspectRatio>
        </div>
        <div class="text-left">
          <H4>Webhook</H4>
        </div>
      </div>
    </div>
  {/snippet}

  <Paragraph variant="muted">
    A webhook trigger is a URL that you can use to trigger a pipeline from an external service
  </Paragraph>
  {#if $pipelineEditingStore}
    <div class="flex flex-col gap-4">
      <ToggleMenu
        menuItems={[{ title: 'API Request' }, { title: 'Promptable SDK' }]}
        bind:selectedMenuItems
        singleSelection
      />

      {#if selectedMenuItems.includes('API Request')}
        <div class="flex flex-col gap-2">
          <Label>
            <H4>Webhook URL</H4>
          </Label>
          <Paragraph variant="muted">This URL can be used to trigger this pipeline from an external service</Paragraph>
          <span class="flex w-full items-center space-x-2">
            <!-- allows see the first 5 chars, replace the rest with * -->
            <Input type="text" value={requestURL} disabled />
            <Button onclick={() => copyUrl()}>
              <Copy />
            </Button>
          </span>
        </div>
      {/if}

      {#if selectedMenuItems.includes('Promptable SDK')}
        <Label>
          <H4>Promptable SDK</H4>
        </Label>
        <div class="flex-grow h-content">
          <CodeInput
            disabled
            value={`const promptable = new Promptable('<API_KEY>')

const response = await promptable.pipeline(
    '${$pipelineEditingStore.id}',
      {
        key: 'value'
      }
    )
`}
          />
        </div>
      {/if}
    </div>

    <div class="flex flex-col gap-2">
      <Label>
        <H4>Input validation</H4>
      </Label>
      <div class="flex items-center gap-2">
        <Checkbox bind:checked={$pipelineEditingStore.pipeline.input.validate} aria-labelledby="terms-label" />
        <Label>
          <Paragraph>Validate incoming requests</Paragraph>
        </Label>
      </div>
    </div>

    {#if $pipelineEditingStore.pipeline.input.validate}
      <div class="flex flex-col gap-2" transition:slide>
        <Label>
          <H4>Input Body Schema</H4>
          <Paragraph variant="muted">
            Define the schema for the incoming request body. This will be used to validate the incoming request
          </Paragraph>
        </Label>
        <div class="grid gap-2">
          {#each entries as entry (entry.originalKey)}
            <div class="flex gap-2 items-center">
              <Input
                type="text"
                value={entry.currentKey}
                onchange={(e: Event) => {
                  const target = e.target as HTMLInputElement;
                  updateKey(entry, target.value);
                }}
              />
              <span>=</span>
              <Select.Root
                value={$pipelineEditingStore.pipeline.input.schema[entry.originalKey]}
                type="single"
                onValueChange={(value: string) => updateType(entry, value)}
              >
                <Select.Trigger>
                  {$pipelineEditingStore.pipeline.input.schema[entry.originalKey]}
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    <Select.GroupHeading>Data type</Select.GroupHeading>
                    {#each Object.values(SchemaTypeEnum.Enum) as schemaEnum}
                      <Select.Item value={schemaEnum}>{schemaEnum}</Select.Item>
                    {/each}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
              <Button
                onclick={() => removeField(entry)}
                disabled={Object.keys($pipelineEditingStore.pipeline.input.schema).length === 1}
              >
                <X />
              </Button>
            </div>
          {/each}

          <Button onclick={addNewField}>Add Field</Button>
        </div>
      </div>
    {/if}
  {/if}
</BaseNodeSidebar>
