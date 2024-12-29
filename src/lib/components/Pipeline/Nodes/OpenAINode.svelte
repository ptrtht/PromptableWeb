<script lang="ts">
  import { OpenAINode } from '$lib/services/pipeline/OpenAINode';
  import { pipelineEditing } from '$lib/services/stores';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let node = writable<OpenAINode | null>(null);

  let {
    id,
  }: {
    id: string;
  } = $props();

  onMount(() => {
    node.set($pipelineEditing.getNode<OpenAINode>(id));
  });

  const testNode = async () => {
    console.log('Starting test');
  };
</script>

<div class="card bg-base-200 max-w-3xl mt-10 m-5">
  <div class="card-body">
    {#if !$node}
      <p class="loading loading-rings"></p>
    {:else}
      <div class="flex place-content-between">
        <h2 class="card-title">{$node.id}</h2>

        <!-- <button class="btn btn-outline btn-square" onclick={testNode}>Test</button> -->
      </div>

      <div class="grid grid-cols-2 place-content-between gap-2">
        <div>
          <h3 class="col-span-2">Inputs</h3>
          <span>Model:</span>
          <select class="select select-bordered w-full max-w-xs" bind:value={$node.inputs.model}>
            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
            <option value="gpt-4o-mini">gpt-4o-mini</option>
          </select>
          <span>Prompt:</span>
          <input
            type="text"
            placeholder="Type here"
            class="input input-bordered w-full max-w-xs"
            bind:value={$node.inputs.prompt}
          />
        </div>
        <div>
          <h3 class="col-span-2">Outputs</h3>

          <span>Status:</span>
          <input
            type="number"
            placeholder="Send a request to see the response"
            class="input input-bordered w-full max-w-xs"
            disabled
            value={$node.outputs.completion}
          />

          <span class="col-span-2">Full Response:</span>
          <pre class="textarea textarea-bordered w-full max-w-xs textarea-disabled col-span-2">{JSON.stringify(
              $node.outputs.fullResponse ?? 'Send a request to see the response',
              null,
              2
            )}</pre>

          <pre class="textarea textarea-bordered w-full max-w-xs textarea-disabled col-span-2">{JSON.stringify(
              $node,
              null,
              2
            )}</pre>
        </div>
      </div>

      <!-- <pre>{JSON.stringify(node, null, 2)}</pre> -->
    {/if}
  </div>
</div>
