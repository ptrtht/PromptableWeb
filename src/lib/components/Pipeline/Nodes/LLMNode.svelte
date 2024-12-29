<script lang="ts">
  import ApiSvg from '$lib/SVG/ApiSvg.svelte';
  import BaseNode from './BaseNode.svelte';
  import { LLMNode } from '$lib/services/pipeline/LLMNode';
  import OpenAISvg from '$lib/SVG/OpenAISvg.svelte';
  import AnthropicSvg from '$lib/SVG/AnthropicSvg.svelte';

  let {
    node = $bindable(),
    open = $bindable(false),
  }: {
    node: LLMNode;
    open: boolean;
  } = $props();

  // INPUTS
  //   inputs: {
  //     provider_model: ProviderModel;
  //     messages: Array<{
  //       role: 'system' | 'user' | 'assistant';
  //       content: string;
  //     }>;
  //     temperature?: number;
  //     max_tokens?: number;
  //     stop_sequences?: string[];
  //   };

  let provider_model: LLMNode['inputs']['provider_model'] = $state(node.inputs.provider_model);
  let temperature: LLMNode['inputs']['temperature'] = $state(node.inputs.temperature);
  let max_tokens: LLMNode['inputs']['max_tokens'] = $state(node.inputs.max_tokens);
  let messages: LLMNode['inputs']['messages'] = $state(node.inputs.messages);

  $effect(() => {
    node.inputs = {
      provider_model,
      temperature,
      max_tokens,
      messages,
    };

    node = new LLMNode(node);
  });
</script>

<BaseNode {node} bind:open>
  {#snippet icon()}
    <ApiSvg />
  {/snippet}
  {#snippet children()}
    <div class="flex flex-col gap-3">
      <label class="flex flex-col gap-1">
        <span class="opacity-50"> LLM Mode </span>
        <div class="join">
          <div class="join-item min-w-12 bg-base-200 flex items-center justify-center">
            {#if provider_model.includes('openai')}
              <OpenAISvg />
            {:else}
              <AnthropicSvg />
            {/if}
          </div>
          <select class="join-item select select-bordered w-full max-w-xs" bind:value={provider_model}>
            <option disabled selected>Select Model</option>
            <!-- "openai/gpt-4" | "openai/gpt-4-turbo" | "openai/gpt-3.5-turbo" | "anthropic/claude-3-opus" | "anthropic/claude-3-sonnet" | "anthropic/claude-3-haiku" -->
            <option value="openai/gpt-4">openai/gpt-4</option>
            <option value="openai/gpt-4-turbo">openai/gpt-4-turbo</option>
            <option value="openai/gpt-3.5-turbo">openai/gpt-3.5-turbo</option>
            <option value="anthropic/claude-3-opus">anthropic/claude-3-opus</option>
            <option value="anthropic/claude-3-sonnet">anthropic/claude-3-sonnet</option>
            <option value="anthropic/claude-3-haiku">anthropic/claude-3-haiku</option>
          </select>
        </div>
      </label>

      <!-- <label class="flex flex-col gap-1">
        <span class="opacity-50"> Temperature </span>
        <input class="input input-bordered" type="number" min="0" max="1" bind:value={temperature} />
      </label> -->
    </div>
    <!-- --- -->
  {/snippet}

  <!-- show outputs as badges -->

  {#snippet editing()}
    <!-- <div class="grid grid-cols-1 gap-3">
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
    </div> -->
  {/snippet}
</BaseNode>
