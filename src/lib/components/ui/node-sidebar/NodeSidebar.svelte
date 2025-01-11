<script lang="ts">
  import { SearchIcon, Webhook } from 'lucide-svelte';
  import { AspectRatio } from '../aspect-ratio';
  import { Input } from '../input';
  import H4 from '../text/H4.svelte';
  import BaseNodeSidebar from './BaseNodeSidebar.svelte';
  import Paragraph from '../text/Paragraph.svelte';
  import { toast } from 'svelte-sonner';
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';

  let {
    open = $bindable(false),
  }: {
    open: boolean;
  } = $props();
</script>

<BaseNodeSidebar bind:open>
  {#snippet title()}
    <H4>Add a trigger</H4>
  {/snippet}

  <div>content</div>

  {#snippet actions()}
    <span></span>
  {/snippet}
</BaseNodeSidebar>
