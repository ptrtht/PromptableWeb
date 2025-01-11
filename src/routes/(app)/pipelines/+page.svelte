<script>
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
  import PipelineTemplateCard from '$lib/components/ui/pipeline-template-card/PipelineTemplateCard.svelte';
  import PipelinesList from '$lib/components/ui/pipelines-list/PipelinesList.svelte';
  import PromiseButton from '$lib/components/ui/promiseButton/PromiseButton.svelte';
  import H1 from '$lib/components/ui/text/H1.svelte';
  import H4 from '$lib/components/ui/text/H4.svelte';
  import Paragraph from '$lib/components/ui/text/Paragraph.svelte';
  import {
    FileText,
    Hammer,
    MessageSquare,
    MessageSquareMore,
    Shield,
    ShieldCheck,
    SquareTerminal,
  } from 'lucide-svelte';
</script>

<Navbar breadcrumbs={[{ label: 'Pipelines', href: '/pipelines' }]} />

<div class="flex flex-col items-center h-full w-full gap-6 p-6 bg-background">
  <div class="flex w-full place-content-between">
    <div>
      <H1>Pipelines</H1>
      <Paragraph variant="muted">
        Build and manage multi-step LLM workflows with powerful validation and control
      </Paragraph>
    </div>
  </div>
  <PipelinesList />
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
</div>
