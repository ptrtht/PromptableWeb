<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Switch } from '$lib/components/ui/switch/index.js';
  import H4 from '../text/H4.svelte';
  import { AspectRatio } from '../aspect-ratio';
  import { Cloudy, Copy, ExternalLink, Server, Settings } from 'lucide-svelte';
  import Separator from '../separator/separator.svelte';
  import type { Tables, Views } from '$lib/services/utils/init';
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
    virtualKey,
  }: {
    virtualKey: Tables['virtual_keys']['Row'] | Views['v_orphaned_virtual_keys']['Row'];
  } = $props();

  let virtualKeyError = $state('');

  let createModalOpen = $state(false);

  const saveVirtualKey = async () => {
    if (!virtualKey.key || (virtualKey.key?.length ?? 0) < 5) {
      virtualKeyError = 'Please set a key';
      return;
    }

    if (virtualKey.provider == null) {
      throw new Error('Provider is not defined');
    }

    await VirtualKeyStore.setKeyForProvider({
      provider: virtualKey.provider,
      key: virtualKey.key,
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
    if (virtualKey.provider == null) {
      throw new Error('Provider is not defined');
    }

    if (virtualKey.status === 'active') {
      await VirtualKeyStore.revokeKeyForProvider({
        provider: virtualKey.provider,
      });
      virtualKey.status = 'revoked';
      toast.success('Key revoked');
    } else {
      await VirtualKeyStore.restoreKeyForProvider({
        provider: virtualKey.provider,
      });
      virtualKey.status = 'active';
      toast.success('Key restored');
    }
  };

  let isChecked = $state(false);

  onMount(async () => {
    isChecked = virtualKey.status === 'active';
  });
</script>

<Card.Root class="w-[380px]">
  <Card.Header class="gap-4">
    <div class="flex place-content-between">
      <div class="w-[3rem]">
        <AspectRatio ratio={1 / 1} class="bg-muted rounded-full">
          <Server class="w-full h-full" />
        </AspectRatio>
      </div>
      <div>
        <Badge variant={virtualKey.status === 'active' ? 'default' : 'outline'}>
          {virtualKey.status}
        </Badge>
      </div>
    </div>
    <div>
      <H4>
        {virtualKey.provider}
      </H4>
      <Card.Description>This is a custom provider.</Card.Description>

      <Card.Description>
        You will be able to access this provider's virtual key with: {`{{credentials.${virtualKey.name}}}`}
      </Card.Description>
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
      <Switch
        onclick={() => {
          handleSwitch();
        }}
        bind:checked={isChecked}
      />
    </div>
  </Card.Content>
</Card.Root>

<Dialog.Root bind:open={createModalOpen}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>{virtualKey.name} Provider Settings</Dialog.Title>
    </Dialog.Header>

    <div class="flex w-full max-w-sm flex-col gap-1.5 mt-2 py-4">
      <Label for="apikeyinput">API Key</Label>
      <span class="flex w-full max-w-xs items-center space-x-2">
        <!-- allows see the first 5 chars, replace the rest with * -->
        <Input type="text" class="password" bind:value={virtualKey.key} />
        <Button onclick={() => copyKey(virtualKey.key)}>
          <Copy />
        </Button>
      </span>
      {#if virtualKeyError}
        <Paragraph variant="error" size="sm">{virtualKeyError}</Paragraph>
      {/if}
    </div>

    <Dialog.Footer>
      <div>
        <PromiseButton class="min-w-[10rem]" promise={saveVirtualKey} type="submit">Save changes</PromiseButton>
      </div>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
