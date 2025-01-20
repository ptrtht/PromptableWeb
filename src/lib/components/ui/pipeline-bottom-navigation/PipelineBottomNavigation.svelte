<script lang="ts">
  import { Pencil, Play, Plus, Table } from 'lucide-svelte';

  import { Button } from '../button';
  import { page } from '$app/stores';

  let { onAddNode, onRun }: { onAddNode?: () => void; onRun?: () => void } = $props();

  const currentUrl = $page.url;

  const overViewLink = `/pipelines/${$page.params.pipelineId}/overview`;
  const pipelineEditPage = `/pipelines/${$page.params.pipelineId}`;
</script>

<div
  class="sticky bottom-0 w-full min-h-20 z-10
  flex items-center justify-center
  "
>
  <!-- border-4 border-destructive -->
  <div class="bg-background border-2 border-muted p-3 mb-5 rounded-xl">
    {#if currentUrl.href.includes(overViewLink)}
      <Button href={pipelineEditPage}>
        <Pencil />
        Edit
      </Button>
    {:else}
      <Button onclick={onAddNode}>
        <Plus />
        Add node
      </Button>
    {/if}
    <!-- <Button variant="ghost" onclick={onRun}>
      <Play />
      Run
    </Button> -->
    <Button variant="ghost" href={overViewLink}>
      <Table />
      Overview
    </Button>
  </div>
</div>
