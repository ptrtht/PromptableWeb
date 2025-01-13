<script lang="ts">
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';
  import { Ban, CircleCheck, Code, SquareSlash, Webhook, Zap } from 'lucide-svelte';
  import BaseNodeView from '../BaseNodeView.svelte';
  import H4 from '../../text/H4.svelte';
  import { cn } from '$lib/utils';
  import Paragraph from '../../text/Paragraph.svelte';
  import { Label } from '../../label';
  import { getCurlCommandForPipeline, getSdkCommandForPipeline, type CurrentlyActiveNodeType } from '$lib/components/utils';
  import { Badge } from '../../badge';
  import { Input } from '../../input';
  import IconInput from '../../icon-input/IconInput.svelte';
  import ObjectInput from '../../object-input/ObjectInput.svelte';
  import { Button } from '../../button';
  import { toast } from 'svelte-sonner';

  let {
    currentlyActiveNode = $bindable(),
  }: {
    currentlyActiveNode: CurrentlyActiveNodeType;
  } = $props();

  let active = $derived(currentlyActiveNode === 'input');
</script>

{#if $pipelineEditingStore}
  <BaseNodeView
    bind:currentlyActiveNode
    nodeName="input"
    class={cn('border border-width:5 border-primary/25 shadow-none')}
  >
    {#snippet header()}
      <div class={'flex items-center place-content-between gap-2 '}>
        <div class="flex items-center gap-2">
          <Zap size="1rem" fill="currentColor" />
          <H4>{$pipelineEditingStore.pipeline.input.name}</H4>
        </div>
        <Badge variant={active ? 'default' : 'outline'} class={active ? 'border-primary-foreground' : ''}>
          Trigger
        </Badge>
      </div>
    {/snippet}
    <div class="flex flex-col gap-2">
      <Label>Copy code</Label>
      <div class="flex gap-2">
        <Button
          variant="outline"
          class="flex-grow"
          onclick={() => {
            navigator.clipboard.writeText(
              getCurlCommandForPipeline({
                pipelineId: $pipelineEditingStore.id,
                apiKey: '<API_KEY>',
                body: {},
              })
            );
            toast.success('Curl command copied to clipboard');
          }}
        >
          <SquareSlash size="1rem" />
          Curl
        </Button>
        <Button
          variant="outline"
          class="flex-grow"
          onclick={() => {
            navigator.clipboard.writeText(
              getSdkCommandForPipeline({
                pipelineId: $pipelineEditingStore.id,
                apiKey: '<API_KEY>',
                body: {},
              })
            );
            toast.success('Promptable SDK command copied to clipboard');
          }}
        >
          <Code size="1rem" />
          Promptable SDK
        </Button>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <Label>Input validation</Label>
      <IconInput value={$pipelineEditingStore.pipeline.input.validate ? 'Enabled' : 'Disabled'} disabled>
        {#if $pipelineEditingStore.pipeline.input.validate}
          <CircleCheck size="1.2rem" />
        {:else}
          <Ban size="1.2rem" />
        {/if}
      </IconInput>
      <!-- <Input value={$pipelineEditingStore.pipeline.input.validate ? 'Enabled' : 'Disabled'} /> -->
      {#if $pipelineEditingStore.pipeline.input.validate}
        <ObjectInput
          bind:object={$pipelineEditingStore.pipeline.input.schema}
          select={[
            { value: 'string', label: 'String' },
            { value: 'number', label: 'Number' },
            { value: 'boolean', label: 'Boolean' },
            { value: 'object', label: 'Object' },
            { value: 'array', label: 'Array' },
          ]}
          disabled
          maxrows={2}
        />
      {:else}
        <Paragraph>No validation schema defined. This webhook will accept any data.</Paragraph>
      {/if}
    </div>
  </BaseNodeView>
{/if}
