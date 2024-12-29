<script lang="ts">
  import { ApiNode } from '$lib/services/pipeline/ApiNode';
  import { pipelineEditing } from '$lib/services/stores';
  import BaseModal from '../BaseModal.svelte';
  import { OpenAINode } from '../../../lib/services/pipeline/OpenAINode';
  import { get } from 'svelte/store';

  let showModal = $state(false);

  let nodeTypes = [
    {
      name: 'API Call',
      val: ApiNode,
      config: {
        id: 'API Call Node',
      },
    },
    {
      name: 'OpenAI',
      val: OpenAINode,
      config: {
        id: 'OpenAI Node',
      },
    },
  ];

  const onSelectNode = (nodeType: (typeof nodeTypes)[number]) => {
    const newNode = new nodeType.val(nodeType.config);
    const pipeline = get(pipelineEditing);
    pipeline.addNode(newNode);
    pipeline.endNodeId = newNode.id;
    pipelineEditing.set(pipeline);

    showModal = false;
  };
</script>

<button onclick={() => (showModal = true)} class="btn btn-outline btn-primary btn-wide"> Add </button>

<BaseModal title="Choose Node Type" bind:open={showModal}>
  {#each nodeTypes as nodeType}
    <div class="card bg-base-200 w-96">
      <div class="card-body">
        <h2 class="card-title">{nodeType.name}</h2>
        <input
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full max-w-xs"
          bind:value={nodeType.config.id}
        />
        <div class="card-actions justify-end">
          <button class="btn" onclick={() => onSelectNode(nodeType)}>Add</button>
        </div>
      </div>
    </div>
  {/each}
</BaseModal>
