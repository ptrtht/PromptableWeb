<script lang="ts">
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';
  import { Webhook, Zap } from 'lucide-svelte';
  import WebhookTriggerSidebar from '../../node-sidebar/WebhookTriggerSidebar.svelte';
  import BaseNodeView from '../BaseNodeView.svelte';
  import H4 from '../../text/H4.svelte';
  import { cn } from '$lib/utils';
  import Paragraph from '../../text/Paragraph.svelte';
  import { Label } from '../../label';

  let active = $state(false);
</script>

{#if $pipelineEditingStore}
  <BaseNodeView
    bind:active
    class={cn(
      'border border-width:5 border-primary/25 shadow-none',
      active ? 'border-primary border-dashed' : 'border-background'
    )}
  >
    {#snippet header()}
      <div class={'flex items-center gap-2 '}>
        <Zap size="1rem" class={active ? 'text-foreground' : 'text-foreground/50'} fill="currentColor" />
        <H4>Pipeline trigger</H4>
      </div>
    {/snippet}
    <Label>Type</Label>
    <div class="flex gap-2 items-center">
      <Webhook />
      <Paragraph variant="muted">Webhook trigger</Paragraph>
    </div>
  </BaseNodeView>
{/if}


<WebhookTriggerSidebar bind:open={active} />
