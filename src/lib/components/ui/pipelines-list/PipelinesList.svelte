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
  import { CircleUser } from 'lucide-svelte';
  import { getLocalDateTime } from '$lib/utils/utils';
  import AvatarUser from '../avatar-user/AvatarUser.svelte';

  const {
    maxRows = 9999,
  }: {
    maxRows?: number;
  } = $props();

  const pipelineStats: {
    name: string;
    status: 'Live' | 'Draft' | 'Failing' | 'Paused';
    total_runs: number;
    price_per_run: number;
    error_rate: number;
    last_edited: string;
  }[] = [
    {
      name: 'Data Ingestion Pipeline',
      status: 'Live',
      total_runs: 1247,
      price_per_run: 0.85,
      error_rate: 0.05,
      last_edited: '2024-01-02T14:30:22Z',
    },
    {
      name: 'ML Model Training',
      status: 'Failing',
      total_runs: 89,
      price_per_run: 4.5,
      error_rate: 8.2,
      last_edited: '2024-01-05T09:15:43Z',
    },
    {
      name: 'Customer Analytics',
      status: 'Draft',
      total_runs: 0,
      price_per_run: 1.2,
      error_rate: 0.0,
      last_edited: '2024-01-04T16:45:11Z',
    },
    {
      name: 'Log Processing',
      status: 'Live',
      total_runs: 3456,
      price_per_run: 0.25,
      error_rate: 0.3,
      last_edited: '2024-01-03T11:20:55Z',
    },
    {
      name: 'Backup Workflow',
      status: 'Paused',
      total_runs: 782,
      price_per_run: 0.95,
      error_rate: 1.2,
      last_edited: '2024-01-01T22:10:33Z',
    },
    {
      name: 'Data Transformation',
      status: 'Live',
      total_runs: 2134,
      price_per_run: 0.65,
      error_rate: 0.8,
      last_edited: '2024-01-05T03:40:17Z',
    },
  ];
  let user: User | null = $state(null);

  onMount(async () => {
    user = await UsersStore.getCurrentUser();
  });
</script>

<div class="flex-grow flex flex-col gap-3 w-full">
  <div class="flex place-content-between">
    <H4>Your pipelines</H4>
    <div class="flex gap-3">
      <Button variant="default">Create new</Button>
      <Button
        variant="outline"
        onclick={() => {
          goto('/pipelines');
        }}
      >
        View all
      </Button>
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
      {#each pipelineStats as pipelineStat, i (i)}
        {#if i < maxRows}
          <Table.Row>
            <Table.Cell>
              <Paragraph class="truncate max-w-[10rem]">{pipelineStat.name}</Paragraph>
            </Table.Cell>
            <Table.Cell>
              <Badge>
                {pipelineStat.status}
              </Badge>
            </Table.Cell>

            <Table.Cell>
              <Paragraph class="">
                {pipelineStat.total_runs}
              </Paragraph>
            </Table.Cell>
            <Table.Cell>
              <Paragraph class="">${pipelineStat.price_per_run.toFixed(2)}</Paragraph>
            </Table.Cell>
            <Table.Cell>
              <Paragraph class="">{pipelineStat.error_rate.toFixed(2)}%</Paragraph>
            </Table.Cell>
            <Table.Cell>
              {getLocalDateTime(pipelineStat.last_edited)}
            </Table.Cell>
            <Table.Cell class="font-medium">
              <AvatarUser {user} />
            </Table.Cell>
            <Table.Cell class="text-right">
              <Button variant="outline">Edit</Button>
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
            {pipelineStats.reduce((acc, curr) => acc + curr.total_runs, 0)}
          </Paragraph>
        </Table.Cell>
        <Table.Cell class="text-start">
          <Paragraph>
            ${pipelineStats.reduce((acc, curr) => acc + curr.total_runs * curr.price_per_run, 0).toFixed(2)}
          </Paragraph>
        </Table.Cell>
      </Table.Row>
    </Table.Footer>
  </Table.Root>
</div>
