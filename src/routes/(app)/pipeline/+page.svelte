<script lang="ts">
  // import ApiNode from '$lib/components/Pipeline/ApiNode.svelte';
  import NodeSelector from '$lib/components/Pipeline/NodeSelector.svelte';
  // import OpenAINode from '$lib/components/Pipeline/OpenAINode.svelte';
  import type { BaseNode } from '$lib/services/pipeline/BaseNode';
  import { pipelineEditing } from '$lib/services/stores';

  let results: Map<string, BaseNode> = $state(new Map());

  const runPipeline = async () => {
    results = await $pipelineEditing.execute();
    // const asd = Object.fromEntries(results);
    console.log('Results:', results);
  };
</script>

<div class="grid gap-10">
  <div>
    {#each $pipelineEditing.nodes as [id, node]}
      {#if node.type === 'ApiNode'}
        <!-- <ApiNode id={node.id} /> -->
      {/if}
      {#if node.type === 'OpenAINode'}
        <!-- <OpenAINode id={node.id} /> -->
      {/if}
    {/each}
  </div>

  <button class="btn btn-primary" onclick={runPipeline}> Run Pipeline </button>

  <span>Results</span>
  <div>
    <pre>{JSON.stringify(Object.fromEntries(results), null, 2)}</pre>
  </div>

  <span>Pipeline Debug Log:</span>
  <div>
    <pre>{JSON.stringify($pipelineEditing.toJSON(), null, 2)}</pre>
  </div>

  <NodeSelector />
</div>
