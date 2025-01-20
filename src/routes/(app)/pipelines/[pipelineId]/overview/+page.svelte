<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { page } from '$app/stores';
  import * as Pagination from '$lib/components/ui/pagination/index.js';
  import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
  import PipelineBottomNavigation from '$lib/components/ui/pipeline-bottom-navigation/PipelineBottomNavigation.svelte';
  import H1 from '$lib/components/ui/text/H1.svelte';
  import Paragraph from '$lib/components/ui/text/Paragraph.svelte';
  import * as Table from '$lib/components/ui/table/index.js';
  import { onMount } from 'svelte';
  import { PipelineStore } from '$lib/services/stores/PipelineStore';
  import type { Tables } from '$lib/services/utils/init';
  import { PipelineRunsStore } from '$lib/services/stores/PipelineRunsStore';
  import { Button } from '$lib/components/ui/button';
  import { getLocalDateTime } from '$lib/utils/utils';
  import { Badge } from '$lib/components/ui/badge';

  let pipelineName = $state('');
  let dialogOpen = $state(false);
  let dialogContent = $state('');

  let pipelineRuns: Tables['pipeline_runs']['Row'][] = $state([]);
  let currentPage = $state(1);
  let pipelineRunsCount = $state(1);

  onMount(async () => {
    const pipelineId = $page.params.pipelineId;
    const pipeline = await PipelineStore.getPipeline(pipelineId);
    pipelineName = pipeline.name;

    // get runs
    pipelineRuns = await PipelineRunsStore.getPipelineRuns({ pipelineId, page: 1, limit: 10 });

    // get total pages
    pipelineRunsCount = await PipelineRunsStore.getPipelineRunCount(pipelineId);
  });

  const updatePipelineRuns = async () => {
    pipelineRuns = await PipelineRunsStore.getPipelineRuns({
      pipelineId: $page.params.pipelineId,
      page: currentPage,
      limit: 10,
    });
  };

  $effect(() => {
    if (currentPage) updatePipelineRuns();
  });
</script>

<Navbar
  breadcrumbs={[
    { label: 'Pipelines', href: '/pipelines' },
    pipelineName
      ? {
          label: pipelineName,
          href: `/pipelines/${$page.params.pipelineId}`,
        }
      : {
          label: '...',
          href: `#`,
        },
    { label: 'Overview', href: `#` },
  ]}
/>

<div class="flex flex-col bg-background min-h-screen p-6">
  <div>
    <H1>{pipelineName} logs</H1>
    <Paragraph variant="muted">See real-time activity and analytics for your pipeline</Paragraph>
  </div>

  <Table.Root>
    <Table.Header>
      <Table.Row>
        <!-- <Table.Head class="w-[100px]">Invoice</Table.Head> -->
        <Table.Head>ID</Table.Head>
        <Table.Head class="text-center">Status</Table.Head>
        <Table.Head class="text-center">Cost</Table.Head>
        <Table.Head class="text-center">Environment</Table.Head>
        <Table.Head class="text-center">Version</Table.Head>
        <Table.Head class="text-center">Input</Table.Head>
        <Table.Head class="text-center">Fulllog</Table.Head>
        <Table.Head class="text-center">Timestamp</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each pipelineRuns as run}
        <Table.Row>
          <!-- <Table.Cell class="font-medium">{run.id}</Table.Cell> -->
          <Table.Cell class="text-start">{run.id}</Table.Cell>
          <Table.Cell class="text-center">
            <Badge variant={run.result === 'Success' ? 'outline' : 'destructive'}>
              {run.result}
            </Badge>
          </Table.Cell>
          <Table.Cell class="text-center">${run.price.toFixed(6)}</Table.Cell>
          <Table.Cell class="text-center">
            <Badge variant={run.environment === 'Live' ? 'default' : 'outline'}>
              {run.environment}
            </Badge>
          </Table.Cell>
          <Table.Cell class="text-center">v{run.version}</Table.Cell>
          <Table.Cell class="text-center">
            <Button
              variant="ghost"
              onclick={() => {
                dialogContent = JSON.stringify(run.input, null, 2);
                dialogOpen = true;
              }}>View</Button
            >
          </Table.Cell>
          <Table.Cell class="text-center">
            <Button
              variant="ghost"
              onclick={() => {
                dialogContent = JSON.stringify(run.log, null, 2);
                dialogOpen = true;
              }}>View</Button
            >
          </Table.Cell>
          <Table.Cell class="text-center">{getLocalDateTime(run.created_at)}</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>

  <Pagination.Root count={pipelineRunsCount} perPage={10} bind:page={currentPage}>
    {#snippet children({ pages, currentPage }: { pages: any[]; currentPage: number })}
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.PrevButton />
        </Pagination.Item>
        {#each pages as page (page.key)}
          {#if page.type === 'ellipsis'}
            <Pagination.Item>
              <Pagination.Ellipsis />
            </Pagination.Item>
          {:else}
            <Pagination.Item>
              <Pagination.Link {page} isActive={currentPage === page.value}>
                {page.value}
              </Pagination.Link>
            </Pagination.Item>
          {/if}
        {/each}
        <Pagination.Item>
          <Pagination.NextButton />
        </Pagination.Item>
      </Pagination.Content>
    {/snippet}
  </Pagination.Root>
</div>

<PipelineBottomNavigation />

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content class="w-[80vw] max-w-none max-h-[80vh]  overflow-y-auto">
    <!-- <Dialog.Header> -->
    <!-- <Dialog.Title>Are you sure absolutely sure?</Dialog.Title> -->
    <!-- </Dialog.Header> -->
    <!-- pre element with text wrap -->
    <pre style="white-space: pre-wrap;">{dialogContent}</pre>
  </Dialog.Content>
</Dialog.Root>
