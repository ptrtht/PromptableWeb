<script lang="ts">
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';
  import { Webhook, Zap } from 'lucide-svelte';
  import BaseNodeView from '../BaseNodeView.svelte';
  import H4 from '../../text/H4.svelte';
  import { cn } from '$lib/utils';
  import Paragraph from '../../text/Paragraph.svelte';
  import { Label } from '../../label';
  import type { CurrentlyActiveNodeType } from '$lib/components/utils';
  import { Badge } from '../../badge';

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
    <div>Webhook trigger placeholder</div>
  </BaseNodeView>
{/if}
