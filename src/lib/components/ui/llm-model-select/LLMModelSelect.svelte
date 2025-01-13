<script lang="ts">
  import * as Select from '$lib/components/ui/select/index.js';
  import { type LLMProvider, LLMProviderSchema } from '$lib/services/schemas/nodes/LLMNode';
  import { onMount } from 'svelte';
  import { Input } from '../input';

  let {
    value = $bindable(),
    disabled = false,
    customModel = false,
  }: {
    value: string;
    disabled?: boolean;
    customModel?: boolean;

  } = $props();

  let provider: LLMProvider = $state('openai');
  let model: string = $state('gpt-4o-mini');

  onMount(() => {
    const [providerName, modelName] = value.split('/');
    provider = LLMProviderSchema.parse(providerName);
    model = modelName;
  });

  $effect(() => {
    value = `${provider}/${model}`;
  });

  $effect(() => {
    if (customModel) {
      model = ' ';
    }
  });
</script>

<div class="grid grid-cols-3 gap-2">
  <Select.Root type="single" bind:value={provider} {disabled}>
    <Select.Trigger>
      <div class="flex items-center justify-start gap-2">
        <!-- logos -->
        {#if provider === 'openai'}
          <img
            src="https://dkuazlvtqqhwavflsjjb.supabase.co/storage/v1/object/public/icons/openai.png"
            alt="OpenAI"
            class="w-6 h-6"
          />
        {:else if provider === 'anthropic'}
          <img
            src="https://dkuazlvtqqhwavflsjjb.supabase.co/storage/v1/object/public/icons/anthropic.png"
            alt="Anthropic"
            class="w-6 h-6"
          />
        {:else if provider === 'grok'}
          <img
            src="https://dkuazlvtqqhwavflsjjb.supabase.co/storage/v1/object/public/icons/xai.png"
            alt="Grok"
            class="w-6 h-6"
          />
        {/if}

        {provider ?? 'Select a provider'}
      </div>
    </Select.Trigger>
    <Select.Content>
      <Select.Item value="openai">OpenAI/gpt4o</Select.Item>
      <Select.Item value="anthropic" disabled>Anthropic (disabled for now)</Select.Item>
      <Select.Item value="grok" disabled>Grok (disabled for now)</Select.Item>
    </Select.Content>
  </Select.Root>

  {#if customModel}
    <Input class="col-span-2" bind:value={model} placeholder="Model name" {disabled} />
  {:else}
    <Select.Root type="single" bind:value={model} {disabled}>
      <Select.Trigger class="col-span-2">
        {model ?? 'Select a model'}
      </Select.Trigger>
      <Select.Content>
        {#if provider === 'openai'}
          <Select.Item value="gpt-4o">gpt-4o</Select.Item>
          <Select.Item value="gpt-4o-mini">gpt-4o-mini</Select.Item>
          <Select.Item value="gpt-4o-turbo">gpt-4o-turbo</Select.Item>
        {/if}
        {#if provider === 'anthropic'}
          <Select.Item value="anthropic" disabled>Anthropic (disabled for now)</Select.Item>
        {/if}

        {#if provider === 'grok'}
          <Select.Item value="grok" disabled>Grok (disabled for now)</Select.Item>
        {/if}
      </Select.Content>
    </Select.Root>
  {/if}
</div>
