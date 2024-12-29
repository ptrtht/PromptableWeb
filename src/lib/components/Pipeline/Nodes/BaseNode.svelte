<script lang="ts">
  import type { BaseNode } from '$lib/services/pipeline/BaseNode';
  import type { Snippet } from 'svelte';
  import BaseDrawer from '$lib/components/BaseDrawer.svelte';
  import LightningBoltSvg from '$lib/SVG/LightningBoltSvg.svelte';

  let {
    node,
    open = $bindable(false),
    icon,
    children,
    editing,
  }: {
    node: BaseNode;
    open?: boolean;
    icon?: Snippet;
    children?: Snippet;
    editing?: Snippet;
  } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={'card bg-base-100 w-96 shadow-xl min-h-52 ' + (open ? 'border-2 border-primary border-dashed' : '')}
  onclick={() => {
    open = true;
  }}
>
  <div
    class={'text-lg font-semibold p-2 px-4 rounded-t-xl flex items-center gap-1 ' +
      (open ? 'bg-primary/[0.15]' : 'border-b')}
  >
    {#if icon}
      {@render icon()}
    {:else}
      <LightningBoltSvg size="18px" />
    {/if}
    {node.name}
  </div>
  <div
    class="card-body"
    onclick={(e) => {
      e.stopPropagation();
    }}
  >
    {#if children}
      {@render children()}
    {:else}
      <span> Base Node Fallback </span>
    {/if}
  </div>
</div>

<BaseDrawer bind:open>
  {#snippet title()}
    <span class="flex items-center gap-2">
      {#if icon}
        {@render icon()}
      {/if}
      {node.name}
    </span>
  {/snippet}

  <div class="flex flex-col gap-3 w-72">
    <label class="flex flex-col gap-2">
      <span>Node Name</span>
      <input type="text" class="input input-bordered" bind:value={node.name} />
    </label>
    {#if editing}
      {@render editing()}
    {:else}
      <span> Base Node Modal Fallback </span>
    {/if}
  </div>
</BaseDrawer>
