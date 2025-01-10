<script lang="ts">
  import { SearchIcon, Webhook } from 'lucide-svelte';
  import { AspectRatio } from '../aspect-ratio';
  import { Input } from '../input';
  import H4 from '../text/H4.svelte';
  import BaseNodeSidebar from './BaseNodeSidebar.svelte';
  import Paragraph from '../text/Paragraph.svelte';
  import { toast } from 'svelte-sonner';
  import { pipelineEditingStore } from '$lib/stores/pipelineEditingStore';

  let {
    open = $bindable(false),
  }: {
    open: boolean;
  } = $props();

  const handleWebhook = () => {
    if (!$pipelineEditingStore) return toast.error('Pipeline not found');
    pipelineEditingStore.update((store) => {
      if (store) {
        store.pipeline.input = {
          type: 'webhook',
          validate: false,
          schema: {},
        };
      }
      return store;
    });
  };
</script>

<BaseNodeSidebar bind:open>
  {#snippet title()}
    <H4>Add a trigger</H4>
  {/snippet}

  <div class="relative h-10 w-full">
    <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 p-1" />
    <Input
      type="text"
      placeholder="Search triggers"
      class="pl-10 pr-3 py-2 text-md w-full border border-muted rounded-xl shadow-sm bg-muted focus:outline-none focus:ring-2 focus:ring-[#6E23DD] focus:border-transparent"
      value=""
    />
  </div>

  <button class="flex gap-3 w-full items-center justify-start" onclick={handleWebhook}>
    <div class="w-[3rem]">
      <AspectRatio ratio={1 / 1} class="bg-muted rounded-lg">
        <Webhook class="h-full w-full rounded-md object-cover p-2 text-foreground/75" />
      </AspectRatio>
    </div>
    <div class="text-left">
      <H4>Webhook</H4>
      <Paragraph variant="muted">Trigger a workflow with a webhook.</Paragraph>
    </div>
  </button>

  {#snippet actions()}
    <span></span>
  {/snippet}
</BaseNodeSidebar>
