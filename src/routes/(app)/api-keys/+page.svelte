<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar';
  import AvatarUser from '$lib/components/ui/avatar-user/AvatarUser.svelte';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
  import PromiseButton from '$lib/components/ui/promiseButton/PromiseButton.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import * as Table from '$lib/components/ui/table';
  import H1 from '$lib/components/ui/text/H1.svelte';
  import H4 from '$lib/components/ui/text/H4.svelte';
  import Paragraph from '$lib/components/ui/text/Paragraph.svelte';
  import { ApiKeyStore } from '$lib/services/stores/ApiKeyStore';
  import { UsersStore } from '$lib/services/stores/UsersStore';
  import type { Tables } from '$lib/services/utils/init';
  import { getLocalDateTime } from '$lib/utils/utils';
  import type { User } from '@supabase/supabase-js';
  import { Copy } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';

  let keys = $state<Tables['api_keys']['Row'][]>([]);
  let keysLoading = $state(true);

  let user: User | null = $state(null);

  let createModalOpen = $state(false);
  let createKeyData = $state({
    name: '',
    error: '',
  });

  const copyKey = (key: string | null) => {
    if (key == null) return;

    navigator.clipboard.writeText(key);
    toast.success('Key copied to clipboard');
  };

  const createKey = async () => {
    if (createKeyData.name.length < 5) {
      createKeyData.error = 'Minimum length is 5 characters';
      throw new Error('Minimum length is 5 characters');
    }

    await ApiKeyStore.createKey(createKeyData.name);
    createModalOpen = false;

    toast.success('Key created');

    keys = await ApiKeyStore.getKeys();
  };

  const revokeKey = async (id: number) => {
    await ApiKeyStore.revokeKey(id);
    keys = await ApiKeyStore.getKeys();
    toast.success('Key revoked');
  };

  const deleteKey = async (id: number) => {
    await ApiKeyStore.deleteKey(id);
    keys = await ApiKeyStore.getKeys();
    toast.success('Key deleted');
  };

  const restoreKey = async (id: number) => {
    await ApiKeyStore.restoreKey(id);
    keys = await ApiKeyStore.getKeys();
    toast.success('Key restored');
  };

  onMount(async () => {
    keys = await ApiKeyStore.getKeys();
    user = await UsersStore.getCurrentUser();

    keysLoading = false;
  });
</script>

<Navbar breadcrumbs={[{ label: 'Api Keys', href: '/api-keys' }]} />

<div class="flex flex-col items-center h-full w-full gap-6 p-6 bg-background">
  <div class="flex w-full place-content-between">
    <div>
      <H1>API keys</H1>
      <Paragraph variant="muted">Securely manage API keys for your providers and services</Paragraph>
    </div>
    <div class="flex gap-3">
      <Button
        variant="default"
        onclick={() => {
          createModalOpen = true;
        }}
      >
        Create new
      </Button>
    </div>
  </div>
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>Name</Table.Head>
        <Table.Head>Status</Table.Head>
        <Table.Head>Key</Table.Head>
        <Table.Head>Created at</Table.Head>
        <Table.Head></Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#if keysLoading}
        <Table.Row>
          <Table.Cell colspan={5}>
            <div class="flex items-center space-x-4">
              <Skeleton class="h-8 w-full" />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell colspan={5}>
            <div class="flex items-center space-x-4">
              <Skeleton class="h-8 w-full" />
            </div>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell colspan={5}>
            <div class="flex items-center space-x-4">
              <Skeleton class="h-8 w-full" />
            </div>
          </Table.Cell>
        </Table.Row>
      {:else}
        {#each keys as key}
          {#if key.status !== 'deleted'}
            <Table.Row>
              <Table.Cell class="max-w-[10rem]">
                <Paragraph class="truncate">{key.name}</Paragraph>
              </Table.Cell>
              <Table.Cell class="w-[7rem]">
                <Badge
                  variant={key.status === 'active' ? 'default' : key.status === 'revoked' ? 'destructive' : 'secondary'}
                >
                  {key.status}
                </Badge>
              </Table.Cell>
              <Table.Cell class="max-w-[15rem]">
                <Paragraph class="truncate ">
                  <span class="flex w-full max-w-xs items-center space-x-2">
                    <!-- allows see the first 5 chars, replace the rest with * -->
                    <Input type="text" class="password" value={key.key} disabled />
                    <Button onclick={() => copyKey(key.key)} disabled={key.status !== 'active'}>
                      <Copy />
                    </Button>
                  </span>
                </Paragraph>
              </Table.Cell>

              <Table.Cell class="max-w-[10rem]">
                <Paragraph class="truncate ">{getLocalDateTime(key.created_at)}</Paragraph>
              </Table.Cell>
              <Table.Cell class="max-w-[5rem]">
                <Paragraph class="truncate ">
                  <AvatarUser {user} />
                </Paragraph>
              </Table.Cell>
              <Table.Cell class="max-w-[10rem] flex justify-end">
                {#if key.status === 'active'}
                  <PromiseButton
                    variant="destructive_outline"
                    promise={async () => {
                      revokeKey(key.id);
                    }}
                  >
                    Revoke
                  </PromiseButton>
                {:else if key.status === 'revoked'}
                  <PromiseButton
                    variant="outline"
                    promise={async () => {
                      restoreKey(key.id);
                    }}
                  >
                    Restore
                  </PromiseButton>
                {/if}
              </Table.Cell>
            </Table.Row>
          {/if}
        {/each}
      {/if}
    </Table.Body>
  </Table.Root>
</div>

<Dialog.Root bind:open={createModalOpen}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Create API Key</Dialog.Title>
      <Dialog.Description>Make sure you name it well, you won't be able to change it later.</Dialog.Description>
    </Dialog.Header>

    <div class="flex w-full max-w-sm flex-col gap-1.5">
      <Label for="email">Name</Label>
      <Input type="text" placeholder="Name" bind:value={createKeyData.name} />
      {#if createKeyData.error}
        <Paragraph variant="error" size="sm">{createKeyData.error}</Paragraph>
      {/if}
    </div>

    <Dialog.Footer>
      <div>
        <PromiseButton class="min-w-[10rem]" promise={createKey} type="submit">Save changes</PromiseButton>
      </div>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
