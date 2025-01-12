<script lang="ts">
  import { Copy, Webhook, X } from 'lucide-svelte';
  import { AspectRatio } from '../../aspect-ratio';
  import H4 from '../../text/H4.svelte';
  import BaseNodeSidebar from '../BaseNodeSidebar.svelte';
  import { Label } from '../../label';
  import { Checkbox } from '../../checkbox';
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';
  import Paragraph from '../../text/Paragraph.svelte';
  import { Input } from '../../input';
  import { Button } from '../../button';
  import { toast } from 'svelte-sonner';
  import * as Select from '../../select';
  import { slide } from 'svelte/transition';
  import { SchemaTypeEnum } from '$lib/services/schemas/PipelineConfig';
  import CodeInput from '../../code-input/CodeInput.svelte';
  import ToggleMenu from '../../togge-menu/ToggleMenu.svelte';

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

<