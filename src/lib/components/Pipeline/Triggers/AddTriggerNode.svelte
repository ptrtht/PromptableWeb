<script lang="ts">
  import type { BaseNode } from '$lib/services/pipeline/BaseNode';
  import ApiSvg from '$lib/SVG/ApiSvg.svelte';
  import LightningBoltSvg from '$lib/SVG/LightningBoltSvg.svelte';
  import BaseDrawer from '$lib/components/BaseDrawer.svelte';

  let {
    onNodeAdd,
    open = $bindable(false),
  }: {
    onNodeAdd: (node: BaseNode) => void;
    open?: boolean;
  } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="card bg-opacity-100 w-96 shadow-xl border-2 border-primary border-dashed min-h-52 cursor-pointer"
  onclick={() => {
    open = true;
  }}
>
  <div class="card-body flex items-center justify-center">
    <span class="font-semibold text-primary"> + Add Trigger </span>
  </div>
</div>

<BaseDrawer bind:open>
  {#snippet title()}
    <span class="flex items-center gap-2">
      <LightningBoltSvg />
      Add a Trigger
    </span>
  {/snippet}
  {#snippet children()}
    <div class="flex flex-col gap-5">
      <div class="flex flex-row gap-2 items-center">
        <div class="rounded-md bg-base-200 self-stretch flex items-center justify-center p-2">
          <ApiSvg />
        </div>
        <div class="flex flex-col justify-start">
          <span class="font-semibold"> Webhook </span>
          <span> An API webhook </span>
        </div>
      </div>
    </div>
  {/snippet}
</BaseDrawer>
