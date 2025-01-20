<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Table from '$lib/components/ui/table/index.js';
  import type { User } from '@supabase/supabase-js';
  import { Badge } from '../badge';
  import { Button } from '../button';
  import H4 from '../text/H4.svelte';
  import Paragraph from '../text/Paragraph.svelte';
  import { onMount } from 'svelte';
  import { UsersStore } from '$lib/services/stores/UsersStore';
  import { getLocalDateTime } from '$lib/utils/utils';
  import AvatarUser from '../avatar-user/AvatarUser.svelte';
  import { PipelineStore } from '$lib/services/stores/PipelineStore';
  import PulseSpinner from '../spinners/PulseSpinner.svelte';
  import type { Tables, Views } from '$lib/services/utils/init';
  import { Hammer, SquareTerminal } from 'lucide-svelte';
  import * as Card from '../card';
  import { slide } from 'svelte/transition';

  const defaultMaxRows = 9999;

  const {
    maxRows = defaultMaxRows,
  }: {
    maxRows?: number;
  } = $props();

  let pipelineStats: Views['v_pipeline_stats_total']['Row'][] = $state([]);
  let user: User | null = $state(null);

  let loading = $state(true);

  onMount(async () => {
    user = await UsersStore.getCurrentUser();

    const pipelinesWithStats = await PipelineStore.getPipelinesWithStats();

    pipelineStats = pipelinesWithStats;
    loading = false;
  });
</script>

{#if loading}
  <div class="flex-grow flex flex-col items-center justify-center min-h-[150px]">
    <PulseSpinner />
  </div>
{:else if pipelineStats.length > 0}
  <div class="flex-grow flex flex-col gap-3 w-full" transition:slide>
    <div class="flex place-content-between">
      <H4>Your pipelines</H4>
      <div class="flex gap-3">
        <Button variant="default" href="pipelines/new">Create new</Button>
        {#if maxRows !== defaultMaxRows}
          <Button
            variant="outline"
            onclick={() => {
              goto('/pipelines');
            }}
          >
            View all
          </Button>
        {/if}
      </div>
    </div>
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Total Runs</Table.Head>
          <Table.Head>Price / Run</Table.Head>
          <Table.Head>Error Rate</Table.Head>
          <Table.Head>Last Edited</Table.Head>
          <Table.Head class="w-[100px]"></Table.Head>
          <Table.Head class="text-right"></Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#if pipelineStats.length === 0}
          <Table.Row>
            <Table.Cell colspan={8}>
              <PulseSpinner />
            </Table.Cell>
          </Table.Row>
        {/if}
        {#each pipelineStats as pipelineStat, i (i)}
          {#if i < maxRows}
            <Table.Row>
              <Table.Cell>
                <Paragraph class="truncate max-w-[10rem]">{pipelineStat.name}</Paragraph>
              </Table.Cell>
              <Table.Cell>
                <Badge variant={pipelineStat.status === 'Failing' ? 'destructive' : 'default'}>
                  {pipelineStat.status}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                <Paragraph class="">
                  {pipelineStat.total_runs}
                </Paragraph>
              </Table.Cell>
              <Table.Cell>
                <Paragraph class="">${(pipelineStat.price_per_run ?? 0).toFixed(2)}</Paragraph>
              </Table.Cell>
              <Table.Cell>
                <Paragraph class="">{(pipelineStat.error_rate ?? 0).toFixed(2)}%</Paragraph>
              </Table.Cell>
              <Table.Cell>
                {pipelineStat.modified_at ? getLocalDateTime(pipelineStat.modified_at) : 'Invalid date'}
              </Table.Cell>
              <Table.Cell class="font-medium">
                <AvatarUser {user} />
              </Table.Cell>
              <Table.Cell class="text-right">
                <Button variant="outline" href={`pipelines/${pipelineStat.id}`}>Edit</Button>
              </Table.Cell>
            </Table.Row>
          {/if}
        {/each}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell colspan={2}>Total</Table.Cell>
          <Table.Cell class="text-start">
            <Paragraph>
              {pipelineStats.reduce((acc, curr) => acc + (curr.total_runs ?? 0), 0)}
            </Paragraph>
          </Table.Cell>
          <Table.Cell class="text-start">
            <Paragraph>
              ${pipelineStats
                .reduce((acc, curr) => acc + (curr.total_runs ?? 0) * (curr.price_per_run ?? 0), 0)
                .toFixed(2)}
            </Paragraph>
          </Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table.Root>
  </div>
{:else}
  <div class="flex w-full place-content-between pt-6" transition:slide>
    <div>
      <H4>Build your first pipeline</H4>
      <Paragraph variant="muted">Create production-ready LLM workflows in minutes</Paragraph>
    </div>
    <div class="flex gap-3">
      <Button variant="default" href="pipelines/new">
        <span class="flex gap-2 items-center">
          <Hammer />
          <span> Start Building </span>
        </span>
      </Button>
    </div>
  </div>
  <div class="border-dashed border-2 border-muted w-full flex flex-col items-center p-6 gap-6 rounded-xl">
    <Card.Root class="rounded-xl shadow-md">
      <Card.Content class="p-4">
        <SquareTerminal size="2rem" />
      </Card.Content>
    </Card.Root>
    <div class="text-center">
      <H4>No pipelines built yet</H4>
      <Paragraph variant="muted">Build your first pipeline now or see an example first</Paragraph>
    </div>
    <div class="flex gap-3 items-center">
      <Button href="pipelines/new">Start building</Button>
      <Button variant="outline">See an example</Button>
    </div>
  </div>
{/if}
