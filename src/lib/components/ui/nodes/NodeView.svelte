<script lang="ts">
  import { cn } from '$lib/utils';
  import { Label } from '../label';
  import NodeSidebar from '../node-sidebar/NodeSidebar.svelte';
  import H4 from '../text/H4.svelte';
  import Paragraph from '../text/Paragraph.svelte';
  import BaseNodeView from './BaseNodeView.svelte';

  let { active = $bindable() }: { active: boolean } = $props();
</script>

<BaseNodeView
  bind:active
  class={cn(
    'border border-width:5 border-primary/25 shadow-none',
    active ? 'border-primary border-dashed' : 'border-background'
  )}
>
  {#snippet header()}
    <div class={'flex items-center gap-2 '}>
      <H4>Node View Placeholder</H4>
    </div>
  {/snippet}
  <Label>Type</Label>
  <div class="flex gap-2 items-center">
    <Paragraph variant="muted">Node View Placeholder</Paragraph>
  </div>
</BaseNodeView>


<NodeSidebar bind:open={active} />