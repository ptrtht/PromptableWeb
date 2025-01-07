<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import Divider from '$lib/components/ui/divider/Divider.svelte';
  import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
  import ProviderCard from '$lib/components/ui/provider-card/ProviderCard.svelte';
  import H4 from '$lib/components/ui/text/H4.svelte';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { VirtualKeyStore } from '$lib/services/stores/VirtualKeyStore';
  import type { Views } from '$lib/services/utils/init';
  import CustomProviderCard from '$lib/components/ui/provider-card/CustomProviderCard.svelte';

  let { data }: { data: PageData } = $props();

  let customProviders: Views['v_orphaned_virtual_keys']['Row'][] = $state([]);

  onMount(async () => {
    customProviders = await VirtualKeyStore.getCustomProviders();
  });
</script>

<Navbar breadcrumbs={[{ label: 'Providers', href: '/providers' }]} />

<div class="flex flex-col h-full w-full gap-6 p-6 bg-background">
  <div class="flex w-full place-content-between">
    <H4>Providers</H4>
    <div class="flex gap-3">
      <Button
        variant="default"
        onclick={() => {
          // createModalOpen = true;
        }}
      >
        Add new
      </Button>
    </div>
  </div>
  <div class="grid auto-rows-min md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 items-start justify-start gap-6">
    {#if data.providers}
      {#each data.providers as provider}
        <ProviderCard {provider} />
      {/each}
    {:else}
      <p>{data.error}</p>
    {/if}
  </div>
  <Divider variant="muted" class="py-6">Custom Providers</Divider>
  <div class="grid auto-rows-min md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 items-start justify-start gap-6">
    {#each customProviders as customProvider}
      {#if customProvider.status !== 'deleted'}
        <CustomProviderCard virtualKey={customProvider} />
      {/if}
    {/each}
  </div>
</div>
