<script lang="ts">
  import type { NodeConfig } from '$lib/services/schemas/PipelineConfig';
  import { Label } from '../../label';
  import LlmModelSelect from '../../llm-model-select/LLMModelSelect.svelte';

  let { node }: { node: NodeConfig } = $props();
</script>

{#if node.type === 'llm'}
  <div class="flex flex-col gap-2">
    <div class="grid grid-cols-3">
      <Label class="text-muted-foreground/50">Provider</Label>
      <Label class="text-muted-foreground/50">Model</Label>
    </div>
    <LlmModelSelect bind:value={node.config.model} disabled />
  </div>

  <div class="flex flex-col gap-2">
    <Label>System Prompt</Label>
    <textarea
      class="
        border-input bg-background ring-offset-background
        placeholder:text-muted-foreground flex
        w-full rounded-xl border px-3 py-2 text-base md:text-sm
        
        truncate
        text-ellipsis
        overflow-hidden
        text-wrap
       "
      value={node.config.system}
      disabled
    ></textarea>
  </div>
{/if}
