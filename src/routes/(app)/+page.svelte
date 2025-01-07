<script lang="ts">
  import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
  import H1 from '$lib/components/ui/text/H1.svelte';
  import { LoggingService } from '$lib/services/pipeline/LoggingService';
  import { UsersStore } from '$lib/services/stores/UsersStore';
  import type { User } from '@supabase/supabase-js';
  import { onMount } from 'svelte';
  import * as Card from '$lib/components/ui/card/index.js';
  import Paragraph from '$lib/components/ui/text/Paragraph.svelte';
  import { CirclePercent, CirclePlay, Hammer } from 'lucide-svelte';
  import H4 from '$lib/components/ui/text/H4.svelte';
  import { Button } from '$lib/components/ui/button';
  import PipelinesList from '$lib/components/ui/pipelines-list/PipelinesList.svelte';

  let user: User | null = $state(null);

  onMount(async () => {
    user = await UsersStore.getCurrentUser();

    LoggingService.debug('user_metadata', user.user_metadata);
  });
</script>

<Navbar breadcrumbs={[{ label: 'Home', href: '/' }]} />
<div class="flex-grow flex flex-col bg-background gap-6 p-6">
  <H1>
    Hi {user?.user_metadata.preferred_username ?? user?.user_metadata.user_name ?? user?.user_metadata.name ?? 'there'},
    what are we building today?
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
          <Button variant="secondary" class="mb-2">Create new Pipeline</Button>
        </div>
      </Card.Content>
    </Card.Root>
  </div>
  <PipelinesList maxRows={4} />
</div>
