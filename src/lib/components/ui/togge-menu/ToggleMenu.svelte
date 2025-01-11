<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';

  let {
    menuItems = $bindable([]),
    selectedMenuItems = $bindable(),
    singleSelection = false,
  }: {
    menuItems: {
      title: string;
      icon?: any;
    }[];
    singleSelection?: boolean;
    selectedMenuItems: string[];
  } = $props();

  const handleToggle = (item: (typeof menuItems)[number]) => {
    if (singleSelection) {
      selectedMenuItems = [item.title];
    } else {
      if (selectedMenuItems.includes(item.title)) {
        selectedMenuItems = selectedMenuItems.filter((title) => title !== item.title);
      } else {
        selectedMenuItems = [...selectedMenuItems, item.title];
      }
    }
  };
</script>

<div class="flex rounded-md gap-2 border border-muted p-2">
  {#each menuItems as item}
    <button
      class={cn(
        'flex flex-grow items-center justify-center p-2 rounded-md cursor-pointer gap-2',
        selectedMenuItems.includes(item.title) ? 'bg-accent' : ''
      )}
      onclick={() => handleToggle(item)}
    >
      {#if item.icon}
      {/if}
      <span>
        {item.title}
      </span>
    </button>
  {/each}
</div>
