<script lang="ts">
  import { Plus, Trash } from 'lucide-svelte';
  import { Input } from '../input';
  import { Label } from '../label';
  import * as Select from '$lib/components/ui/select/index.js';

  // Make the object prop bindable
  let {
    object = $bindable(),
    disabled = false,
    maxrows,
    select,
  }: {
    object: Record<string, string> | undefined;
    disabled?: boolean;
    maxrows?: number;
    select?: {
      value: string;
      label: string;
    }[];
  } = $props();

  // Track entries with original keys for proper updates
  let entries = $derived(
    Object.entries(object ?? {}).map(([key, value], idx) => ({
      originalKey: key,
      currentKey: key,
      value: value as string,
      idx,
    }))
  );

  // Update key in object - now only called on blur
  function commitKeyUpdate(entry: { originalKey: string; currentKey: string; value: string }) {
    if (entry.currentKey === entry.originalKey || entry.currentKey.trim() === '') {
      entry.currentKey = entry.originalKey;
      return;
    }

    const keyExists = Object.keys(object ?? {}).some((key) => key === entry.currentKey && key !== entry.originalKey);

    if (keyExists) {
      entry.currentKey = entry.originalKey;
      return;
    }

    const newObject: Record<string, string> = {};

    for (const [key, value] of Object.entries(object ?? {})) {
      if (key === entry.originalKey) {
        newObject[entry.currentKey] = value as string;
      } else {
        newObject[key] = value as string;
      }
    }

    object = newObject;
    entry.originalKey = entry.currentKey;
  }

  // Update current key in entry without updating object
  function updateCurrentKey(entry: { originalKey: string; currentKey: string; value: string }, newKey: string) {
    entry.currentKey = newKey;
  }

  // Update value in object
  function updateValue(key: string, newValue: string) {
    const newObject = {
      ...object,
      [key]: newValue,
    };

    object = newObject;
  }

  // Remove key-value pair
  function removeField(key: string) {
    if (!object) return;
    const { [key]: removed, ...rest } = object;
    object = rest;
  }

  // Add new key-value pair
  function addNewField() {
    let newKey = 'newField';
    let counter = 1;

    while (newKey in (object ?? {})) {
      newKey = `newField${counter}`;
      counter++;
    }

    const newObject = {
      ...object,
      // If select options are provided, use the first option's value as default
      [newKey]: select ? select[0]?.value ?? '' : '',
    };

    object = newObject;
  }
</script>

<div class="flex flex-col gap-2">
  <div class="flex">
    <div class="grid grid-cols-3 w-full gap-1 mt-1 flex-grow">
      <Label class="text-foreground/50">Key</Label>
      <Label class="text-foreground/50">Value</Label>
      {#if !disabled}
        <Plus size="1.2rem" class="text-foreground/50 justify-self-end cursor-pointer" onclick={addNewField} />
      {/if}
    </div>
  </div>

  {#if Object.keys(object ?? {}).length === 0}
    <div class="grid grid-cols-3">
      <Label class="text-foreground/50">...</Label>
      <Label class="text-foreground/50">...</Label>
    </div>
  {/if}

  {#each entries as entry (entry.originalKey)}
    {#if !maxrows || entry.idx < maxrows}
      <div class="grid grid-cols-3 w-full gap-1">
        <div>
          <Input
            value={entry.currentKey}
            oninput={(e) => updateCurrentKey(entry, e.currentTarget.value)}
            onblur={() => commitKeyUpdate(entry)}
            {disabled}
          />
        </div>
        <div class="col-span-2 flex gap-2 items-center">
          {#if select}
            <Select.Root
              value={entry.value}
              type="single"
              {disabled}
            >
              <Select.Trigger>
                {select.find((s) => s.value === entry.value)?.label ?? 'Select an option'}
              </Select.Trigger>
              <Select.Content>
                {#each select as option}
                  <Select.Item value={option.value} onclick={() => updateValue(entry.originalKey, option.value)}>
                    {option.label}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          {:else}
            <Input
              value={entry.value}
              oninput={(e) => updateValue(entry.originalKey, e.currentTarget.value)}
              class="flex-grow"
              {disabled}
            />
          {/if}
          {#if !disabled}
            <Trash
              size="1.2rem"
              class="text-foreground/50 cursor-pointer"
              onclick={() => removeField(entry.originalKey)}
            />
          {/if}
        </div>
      </div>
    {/if}
  {/each}

  {#if maxrows && Object.keys(object ?? {}).length > maxrows}
    <Label class="text-foreground/50">+{Object.keys(object ?? {}).length - maxrows} more..</Label>
  {/if}
</div>
