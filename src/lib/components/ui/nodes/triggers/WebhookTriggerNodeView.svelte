<script lang="ts">
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';
  import { Zap } from 'lucide-svelte';
  import WebhookTriggerSidebar from '../../node-sidebar/WebhookTriggerSidebar.svelte';
  import BaseNodeView from '../BaseNodeView.svelte';
  import H4 from '../../text/H4.svelte';
  import { cn } from '$lib/utils';
  import Paragraph from '../../text/Paragraph.svelte';

  let active = $state(true);
</script>

{#if $pipelineEditingStore}
  <BaseNodeView
    {active}
    class={cn(
      'border border-width:5 border-primary/25 shadow-none',
      active ? 'border-primary border-dashed' : 'border-background'
    )}
    onclick={() => (active = true)}
  >
    {#snippet header()}
      <div class={'flex items-center gap-2 '}>
        <Zap size="1rem" class={active ? 'text-foreground' : 'text-foreground/50'} fill="currentColor" />
        <H4>Pipeline trigger</H4>
      </div>
    {/snippet}

    <Paragraph variant="muted">
        Input validation: {$pipelineEditingStore.pipeline.input.validate ? 'Enabled' : 'Disabled'}
      </Paragraph>

    <!-- debug -->
    <pre>{JSON.stringify($pipelineEditingStore.pipeline.input, null, 2)}</pre>
  </BaseNodeView>
{/if}
<WebhookTriggerSidebar bind:open={active} />
