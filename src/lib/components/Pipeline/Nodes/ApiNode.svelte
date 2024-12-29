<script lang="ts">
  import { ApiNode } from '$lib/services/pipeline/ApiNode';
  import ApiSvg from '$lib/SVG/ApiSvg.svelte';
  import { slice } from 'lodash';
  import BaseNode from './BaseNode.svelte';
  import JsonTextArea from '$lib/components/JsonTextArea.svelte';
  import { onMount } from 'svelte';

  let {
    node = $bindable(),
    open = $bindable(false),
  }: {
    node: ApiNode;
    open: boolean;
  } = $props();

  // INPUTS
  let url: ApiNode['inputs']['url'] = $state(node.inputs.url);
  let method: ApiNode['inputs']['method'] = $state(node.inputs.method);
  let headers: ApiNode['inputs']['headers'] = $state(node.inputs.headers);
  let body: ApiNode['inputs']['body'] = $state(node.inputs.body);

  $effect(() => {
    node.inputs = {
      url,
      method,
      headers,
      body,
    };

    node = new ApiNode(node);
  });
</script>

<BaseNode {node} bind:open>
  {#snippet icon()}
    <ApiSvg />
  {/snippet}
  {#snippet children()}
    <div class="flex flex-col gap-3">
      <label class="flex flex-col gap-1">
        <span class="opacity-50"> Request Method </span>
        <select class="select select-bordered w-full max-w-xs" bind:value={method}>
          <option disabled selected>Select Method</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PATCH">PATCH</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </label>

      <label class="flex flex-col gap-1">
        <span class="opacity-50"> Request URL </span>
        <input class="input input-bordered" type="text" bind:value={url} />
      </label>
    </div>
    <!-- --- -->
  {/snippet}

  <!-- show outputs as badges -->

  {#snippet editing()}
    <div class="grid grid-cols-1 gap-3">
      <label class="flex flex-col gap-1">
        <span class="opacity-100"> Request URL </span>
        <input class="input input-bordered" type="text" bind:value={url} />
      </label>

      <label class="flex flex-col gap-1">
        <span class=""> Request Method </span>
        <select class="select select-bordered w-full max-w-xs" bind:value={method}>
          <option disabled selected>Select Method</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PATCH">PATCH</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </label>

      <label class="flex flex-col gap-1">
        <span class=""> Request Body </span>
        <JsonTextArea bind:value={body} />
      </label>
    </div>
  {/snippet}
</BaseNode>
