<script lang="ts">
  import { Input } from '../../input';
  import { Label } from '../../label';
  import ObjectInput from '../../object-input/ObjectInput.svelte';
  import * as Select from '../../select';
  import type { NodeConfig } from '$lib/services/schemas/PipelineConfig';

  const {
    node,
  }: {
    node: NodeConfig;
  } = $props();
</script>

{#if node.type === 'api_call'}
  <div class="flex flex-col gap-1">
    <Label>Request method</Label>
    <Select.Root type="single">
      <Select.Trigger class="flex rounded-xl place-content-between" disabled>
        {node.config.method}
      </Select.Trigger>
    </Select.Root>
  </div>
  <div class="flex flex-col gap-1">
    <Label>URL</Label>
    <Input class="rounded-xl" value={node.config.url} disabled />
  </div>
  <div>
    <Label>Headers</Label>
    {#if node.config.headers && Object.keys(node.config.headers).length > 0}
      <ObjectInput object={node.config.headers} disabled maxrows={2} />
    {/if}
  </div>
  <div>
    <Label>Query parameters</Label>
    {#if node.config.queryParams && Object.keys(node.config.queryParams).length > 0}
      <ObjectInput object={node.config.queryParams} disabled maxrows={2} />
    {/if}
  </div>
{/if}
