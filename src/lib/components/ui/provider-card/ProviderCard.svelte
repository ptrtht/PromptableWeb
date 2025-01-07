<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Switch } from '$lib/components/ui/switch/index.js';
  import H4 from '../text/H4.svelte';
  import { AspectRatio } from '../aspect-ratio';
  import { Copy, ExternalLink, Settings } from 'lucide-svelte';
  import Separator from '../separator/separator.svelte';
  import type { Tables } from '$lib/services/utils/init';
  import { cn } from '$lib/utils';
  import * as Dialog from '../dialog';
  import { Label } from '../label';
  import { Input } from '../input';
  import Paragraph from '../text/Paragraph.svelte';
  import PromiseButton from '../promiseButton/PromiseButton.svelte';
  import { toast } from 'svelte-sonner';
  import { onMount } from 'svelte';
  import { VirtualKeyStore } from '$lib/services/stores/VirtualKeyStore';
  import { LoggingService } from '$lib/services/pipeline/LoggingService';
  import PulseSpinner from '../spinners/PulseSpinner.svelte';
  import { Badge } from '../badge';
  import { key } from '@milkdown/kit/plugin/listener';

  const {
    provider,
  }: {
    provider: Tables['providers']['Row'];
  } = $props();

  let createModalOpen = $state(false);
  let keyData: {
    value: string | null;
    error: string;
    status: Tables['virtual_keys']['Row']['status'] | null;
  } = $state({
    value: null,
    status: null,
    error: '',
  });

  const saveVirtualKey = async () => {
    if (!keyData.value || (keyData.value?.length ?? 0) < 5) {
      keyData.error = 'Please set a key';
      return;
    }

    await VirtualKeyStore.setKeyForProvider({
      provider: provider.name,
      key: keyData.value,
    });

    toast.success('Key saved');
    createModalOpen = false;
  };

  const copyKey = (key: string | null) => {
    if (key == null) return;

    navigator.clipboard.writeText(key);
    toast.success('Key copied to clipboard');
  };

  // handle revoking / restoring key
  const handleSwitch = async () => {
    if (keyData.value === null) {
      toast.info('Please set an API key first');
      createModalOpen = true;
      // turn off the switch
      setTimeout(() => {
        isChecked = false;
      }, 500);
    } else {
      if (keyData.status === 'active') {
        await VirtualKeyStore.revokeKeyForProvider({
          provider: provider.name,
        });
        keyData.status = 'revoked';
        toast.success('Key revoked');
      } else {
        await VirtualKeyStore.restoreKeyForProvider({
          provider: provider.name,
        });
        keyData.status = 'active';
        toast.success('Key restored');
      }
    }
  };

  let loadingKey = $state(true);

  let isChecked = $state(false);

  onMount(async () => {
    try {
      const data = await VirtualKeyStore.getKeyForProvider({
        provider: provider.name,
      });

      keyData.value = data.key;
      keyData.status = data.status;

      isChecked = data.status === 'active';
    } catch (error) {
      LoggingService.debug('Error fetching key', error);
    } finally {
      loadingKey = false;
    }
  });
</script>

<Card.Root class="w-[380px]">
  <Card.Header class="gap-4">
    <div class="flex place-content-between">
      <div class="w-[3rem]">
        <AspectRatio ratio={1 / 1} class="bg-muted rounded-full">
          <img src={provider.logo_url} alt="Gray by Drew Beamer" class="h-full w-full rounded-md object-cover" />
        </AspectRatio>
      </div>
      {#if keyData.status !== null}
        <div>
          <Badge variant={keyData.status === 'active' ? 'default' : 'outline'}>
            {keyData.status}
          </Badge>
        </div>
      {:else}
        <Button variant="ghost" href={provider.link} target="_blank">
          <ExternalLink />
        </Button>
      {/if}
    </div>
    <div>
      <H4>{provider.name}</H4>
      <Card.Description>{provider.description}</Card.Description>
    </div>
  </Card.Header>
  <Separator class="mt-6" />
  <Card.Content
    class={cn('flex place-content-between items-center p-4 px-4 ', isChecked ? 'bg-background' : 'bg-muted')}
  >
    <Button variant="outline" class="flex gap-2" onclick={() => (createModalOpen = true)}>
      <Settings />
      Settings
    </Button>
    <div class="flex gap-2 items-center">
      {#if loadingKey}
        <PulseSpinner />
      {/if}
      <Switch
        onclick={() => {
          handleSwitch();
        }}
        bind:checked={isChecked}
        disabled={loadingKey}
      />
    </div>
  </Card.Content>
</Card.Root>

<Dialog.Root bind:open={createModalOpen}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>{provider.name} Provider Settings</Dialog.Title>
    </Dialog.Header>

    <div class="flex w-full max-w-sm flex-col gap-1.5 mt-2 py-4">
      <Label for="apikeyinput">API Key</Label>
      <span class="flex w-full max-w-xs items-center space-x-2">
        <!-- allows see the first 5 chars, replace the rest with * -->
        <Input type="text" class="password" bind:value={keyData.value} />
        <Button onclick={() => copyKey(keyData.value)}>
          <Copy />
        </Button>
      </span>
      {#if keyData.error}
        <Paragraph variant="error" size="sm">{keyData.error}</Paragraph>
      {/if}
    </div>

    <Dialog.Footer>
      <div>
        <PromiseButton class="min-w-[10rem]" promise={saveVirtualKey} type="submit">Save changes</PromiseButton>
      </div>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
