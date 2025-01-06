<script lang="ts">
  import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<Navbar
  breadcrumbs={[
    { label: 'Pipelines', href: '/pipelines' },
    {
      label: data.pipeline.name,
      href: `/pipelines/${data.pipeline.id}`,
    },
  ]}
/>
