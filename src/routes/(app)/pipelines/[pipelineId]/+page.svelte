<script lang="ts">
  import { beforeNavigate, goto, onNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import AddTriggerNodeView from '$lib/components/ui/nodes/triggers/AddTriggerNodeView.svelte';
  import GridBackground from '$lib/components/ui/grid-background/GridBackground.svelte';
  import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
  import H4 from '$lib/components/ui/text/H4.svelte';
  import Paragraph from '$lib/components/ui/text/Paragraph.svelte';
  import { LoggingService } from '$lib/services/pipeline/LoggingService';
  import { PipelineConfigSchema, type PipelineConfig } from '$lib/services/schemas/PipelineConfig';
  import { PipelineStore } from '$lib/services/stores/PipelineStore';
  import { Plus } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';
  import WebhookTriggerNodeView from '$lib/components/ui/nodes/triggers/WebhookTriggerNodeView.svelte';

  let pipelineRow: PipelineConfig | null = $state(null);

  // beforeNavigate(({ cancel }) => {
  //   if (!confirm('Are you sure you want to leave this page? You have unsaved changes that will be lost.')) {
  //     cancel();
  //   }
  // });

  onMount(async () => {
    const pipelineId = $page.params.pipelineId;

    console.log('pipelineId', pipelineId);

    if (!pipelineId) {
      toast.error('Pipeline not found');
      LoggingService.error('No pipelineId in page data');
      return goto('/pipelines');
    }

    try {
      const pipelineRes = await PipelineStore.getPipeline(pipelineId);
      pipelineRow = PipelineConfigSchema.parse(pipelineRes);
      pipelineEditingStore.set({
        pipeline: pipelineRow.pipeline,
        id: pipelineRow.id,
      });
    } catch (error) {
      LoggingService.error('Failed to get pipeline', error);
      toast.error('Pipeline not found');
      goto('/pipelines');
    }
  });
</script>

<Navbar
  breadcrumbs={[
    { label: 'Pipelines', href: '/pipelines' },
    pipelineRow
      ? {
          label: pipelineRow.name,
          href: `/pipelines/${pipelineRow.id}`,
        }
      : {
          label: '...',
          href: `#`,
        },
  ]}
/>

<GridBackground>
  <div class="relative z-5 w-full h-full flex items-center justify-center flex-col gap-6">
    {#if pipelineRow}
      <!-- INPUT NODE -->
      {#if !$pipelineEditingStore?.pipeline.input}
        <div class="text-center max-w-sm text-balance">
          <H4>Add a pipeline trigger</H4>
          <Paragraph>A pipeline trigger is your user's initial input that will trigger this pipeline</Paragraph>
        </div>
        <AddTriggerNodeView>
          <div class="flex gap-2 items-center">
            <Plus size="1rem" />
            Add trigger
          </div>
        </AddTriggerNodeView>
      {:else}
        <WebhookTriggerNodeView />
      {/if}
    {/if}
  </div>
</GridBackground>
