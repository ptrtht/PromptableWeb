<script lang="ts">
  import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
  import H1 from '$lib/components/ui/text/H1.svelte';
  import { LoggingService } from '$lib/services/pipeline/LoggingService';
  import { UsersStore } from '$lib/services/stores/UsersStore';
  import type { User } from '@supabase/supabase-js';
  import { onMount } from 'svelte';
  import * as Card from '$lib/components/ui/card/index.js';
  import Paragraph from '$lib/components/ui/text/Paragraph.svelte';
  import {
    CirclePercent,
    CirclePlay,
    FileText,
    Hammer,
    MessageSquareMore,
    ShieldCheck,
    SquareTerminal,
  } from 'lucide-svelte';
  import H4 from '$lib/components/ui/text/H4.svelte';
  import { Button } from '$lib/components/ui/button';
  import PipelinesList from '$lib/components/ui/pipelines-list/PipelinesList.svelte';
  import type { PageData } from './$types';
  import ProviderCard from '$lib/components/ui/provider-card/ProviderCard.svelte';
  import { getUserName } from '$lib/utils/utils';
  import PipelineTemplateCard from '$lib/components/ui/pipeline-template-card/PipelineTemplateCard.svelte';

  let user: User | null = $state(null);

  const {
    data,
  }: {
    data: PageData;
  } = $props();

  onMount(async () => {
    user = await UsersStore.getCurrentUser();

    LoggingService.debug('user_metadata', user.user_metadata);
  });
</script>

<Navbar breadcrumbs={[{ label: 'Home', href: '/' }]} />

<div class="flex-grow flex flex-col bg-background gap-6 p-6">
  {#if true}
    <H1>
      Hi {user ? getUserName(user) : 'there'}, what are we building today?
    </H1>
    <div class="flex gap-6 justify-start stretch">
      <Card.Root class="flex-grow min-w-xs">
        <Card.Content>
          <div class="flex place-content-between mb-2">
            <H4>Runs this week</H4>
            <CirclePlay />
          </div>
          <H1>444</H1>
          <Paragraph variant="muted">+10% from last week</Paragraph>
        </Card.Content>
      </Card.Root>
      <Card.Root class="flex-grow min-w-xs">
        <Card.Content>
          <div class="flex place-content-between mb-2">
            <H4>Error rate this week</H4>
            <CirclePercent />
          </div>
          <H1>1.2 %</H1>
          <Paragraph variant="muted">Down 7% from last week</Paragraph>
        </Card.Content>
      </Card.Root>
      <Card.Root class="flex-grow bg-card-foreground min-w-xs">
        <Card.Content class="flex flex-col place-content-between h-full">
          <div class="flex place-content-between mb-2">
            <H4 class="text-secondary">Start building now</H4>
            <Hammer class="text-secondary " />
          </div>
          <div>
            <Button variant="secondary" class="mb-2" href="pipelines/new">Create new Pipeline</Button>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
    <PipelinesList maxRows={3} />
    <div class="flex place-content-between">
      <H4>Providers</H4>
      <div class="flex gap-3">
        <Button variant="default">Add new</Button>
        <Button variant="outline" href="/providers">View all</Button>
      </div>
    </div>
    <div class="grid auto-rows-min md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 items-start justify-start gap-6">
      {#if data.providers}
        {#each data.providers as provider}
          <ProviderCard {provider} />
        {/each}
      {:else}
        <p>{data.error}</p>
      {/if}
    </div>
  {:else}
    <div>
      <H1>Get started</H1>
      <Paragraph variant="muted">Set up your Promptable account and start building in minutes</Paragraph>
    </div>
    <div class="flex w-full place-content-between pt-6">
      <div>
        <H4>Build your first pipeline</H4>
        <Paragraph variant="muted">Create production-ready LLM workflows in minutes</Paragraph>
      </div>
      <div class="flex gap-3">
        <Button variant="default" onclick={() => {}}>
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
        <Button>Start building</Button>
        <Button variant="outline">See an example</Button>
      </div>
    </div>
    <div class="flex w-full place-content-between pt-6">
      <div>
        <H4>Pipeline templates</H4>
        <Paragraph variant="muted">Explore pre-built pipelines and customize them for your needs</Paragraph>
      </div>
    </div>
    <div class="grid auto-rows-min md:grid-cols-2 xl:grid-cols-3 items-start justify-start self-start gap-6">
      <PipelineTemplateCard
        title="Customer Support Assistant"
        description="Enhance support tickets with intelligent routing and personalized responses"
      >
        <MessageSquareMore size="2rem" />
      </PipelineTemplateCard>

      <PipelineTemplateCard
        title="Content Moderator"
        description="Filter and analyze user-generated content with customizable safety guardrails"
      >
        <ShieldCheck size="2rem" />
      </PipelineTemplateCard>
      <PipelineTemplateCard
        title="Research Summary Bot"
        description="Transform lengthy documents into concise summaries with citation tracking"
      >
        <FileText size="2rem" />
      </PipelineTemplateCard>
    </div>
  {/if}
</div>
