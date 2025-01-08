<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import Divider from '$lib/components/ui/divider/Divider.svelte';
  import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
  import ProviderCard from '$lib/components/ui/provider-card/ProviderCard.svelte';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { VirtualKeyStore } from '$lib/services/stores/VirtualKeyStore';
  import { supabase, type Tables, type Views } from '$lib/services/utils/init';
  import CustomProviderCard from '$lib/components/ui/provider-card/CustomProviderCard.svelte';
  import Paragraph from '$lib/components/ui/text/Paragraph.svelte';
  import H1 from '$lib/components/ui/text/H1.svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import { Label } from '$lib/components/ui/label';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
  import PromiseButton from '$lib/components/ui/promiseButton/PromiseButton.svelte';
  import { toast } from 'svelte-sonner';
  import { slide } from 'svelte/transition';

  let { data }: { data: PageData } = $props();

  let customProviders: Views['v_orphaned_virtual_keys']['Row'][] = $state([]);

  let addProviderModalOpen = $state(false);

  let createProviderData: {
    provider: Tables['providers']['Row']['name'] | 'Custom' | null;
    name: string;
    key: string;
  } = $state({
    provider: null,
    name: '1',
    key: '',
  });

  const handleAddProvider = async () => {
    // validate
    if (!createProviderData.provider) {
      return toast.error('Please select a provider');
    }

    if (createProviderData.name.length < 2) {
      return toast.error('Please enter a name for the custom provider');
    }

    if (createProviderData.key.length < 5) {
      return toast.error('Please enter an API key');
    }

    // Add
    try {
      await VirtualKeyStore.createVirtualKey({
        provider: createProviderData.name,
        key: createProviderData.key,
      });
      toast.success('Provider added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add provider');
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }

  };

  onMount(async () => {
    customProviders = await VirtualKeyStore.getCustomProviders();
  });
</script>

<Navbar breadcrumbs={[{ label: 'Providers', href: '/providers' }]} />

<div class="flex flex-col h-full w-full gap-6 p-6 bg-background">
  <div class="flex w-full place-content-between">
    <div>
      <H1>Providers</H1>
      <Paragraph variant="muted">Connect to AI providers and custom services to power your pipelines</Paragraph>
    </div>
    <div class="flex gap-3">
      <Button
        variant="default"
        onclick={() => {
          addProviderModalOpen = true;
        }}
      >
        Add new
      </Button>
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
  <Divider variant="muted" class="py-6">Custom Providers</Divider>
  <div class="grid auto-rows-min md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 items-start justify-start gap-6">
    {#each customProviders as customProvider}
      {#if customProvider.status !== 'deleted'}
        <CustomProviderCard virtualKey={customProvider} />
      {/if}
    {/each}
  </div>
</div>

{#if data.providers}
  <Dialog.Root bind:open={addProviderModalOpen}>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Add Provider</Dialog.Title>
      </Dialog.Header>
      <div class="flex flex-col gap-6 py-4">
        <div class="flex flex-col gap-2">
          <Label>Provider</Label>
          <Select.Root type="single" bind:value={createProviderData.name}>
            <Select.Trigger>
              {createProviderData.provider ? `${createProviderData.provider} Provider` : 'Select a provider'}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                {#each data.providers as provider}
                  <Select.Item
                    value={provider.name}
                    label={provider.name}
                    onclick={() => {
                      createProviderData.provider = provider.name;
                    }}
                  >
                    <span>
                      <img src={provider.logo_url} alt={provider.name} class="w-5 mr-2" />
                    </span>
                    {provider.name} Provider
                  </Select.Item>
                {/each}
                <Select.Item
                  value={''}
                  label={'Other'}
                  onclick={() => {
                    createProviderData.provider = 'Custom';
                  }}
                >
                  {'Other'}
                </Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

        {#if createProviderData.provider === 'Custom'}
          <div class="flex flex-col gap-2" transition:slide>
            <Label>Name</Label>
            <Input bind:value={createProviderData.name} />
          </div>
        {/if}

        <div class="flex flex-col gap-2">
          <Label>API key</Label>
          <Input class="password" type="text" bind:value={createProviderData.key} />
        </div>
      </div>

      <Dialog.Footer>
        <div>
          <PromiseButton promise={handleAddProvider} class="min-w-[7rem]" type="submit">Continue</PromiseButton>
        </div>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{/if}
