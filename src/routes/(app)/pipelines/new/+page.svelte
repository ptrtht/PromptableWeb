<script>
  import { goto } from '$app/navigation';
  import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
  import PulseSpinner from '$lib/components/ui/spinners/PulseSpinner.svelte';
  import Paragraph from '$lib/components/ui/text/Paragraph.svelte';
  import { PipelineStore } from '$lib/services/stores/PipelineStore';
  import { onMount } from 'svelte';

  onMount(async () => {
    const pipeline = await PipelineStore.createNewPipeline();
    goto(`/pipelines/${pipeline.id}`);
  });
</script>

<Navbar
  breadcrumbs={[
    { label: 'Pipelines', href: '/pipelines' },
    {
      label: '...',
      href: `/pipelines/new`,
    },
  ]}
/>

<div class="flex flex-col h-full items-center justify-center gap-2">
  <PulseSpinner />
  <Paragraph>Creating a new pipeline...</Paragraph>
</div>
