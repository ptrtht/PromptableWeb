<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
  import PromiseButton from '$lib/components/ui/promiseButton/PromiseButton.svelte';
  import { Separator } from '$lib/components/ui/separator';
  import PulseSpinner from '$lib/components/ui/spinners/PulseSpinner.svelte';
  import H1 from '$lib/components/ui/text/H1.svelte';
  import H4 from '$lib/components/ui/text/H4.svelte';
  import Paragraph from '$lib/components/ui/text/Paragraph.svelte';
  import { UsersStore } from '$lib/services/stores/UsersStore';
  import type { User } from '@supabase/supabase-js';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';

  let user: User | null = $state(null);

  onMount(async () => {
    user = await UsersStore.getCurrentUser();
  });

  const handleBasicInfoSave = async () => {
    if (!user) return;

    const currentUser = await UsersStore.getCurrentUser();

    try {
      await UsersStore.updateUser({
        email: user.email,
        name: user.user_metadata.first_name,
        lastName: user.user_metadata.last_name,
      });
      toast.success('User updated');
    } catch (error) {
      toast.error('Failed to update user');
    }

    // toast email change email
    if (currentUser.email !== user.email) {
      setTimeout(() => {
        toast.warning('Email verification email sent to both old and new email addresses');
      }, 1000);
    }
  };
</script>

<Navbar
  breadcrumbs={[
    {
      label: 'Account',
      href: '/account',
    },
  ]}
/>

<div class="flex flex-col items-center h-full w-full gap-6 p-6 bg-background">
  <div class="flex w-full place-content-between">
    <div>
      <H1>Account settings</H1>
      <Paragraph variant="muted">
        Manage your workspace,
        <!-- billing,  -->
        and preferences
      </Paragraph>
    </div>
  </div>
  {#if user}
    <div class="flex w-full gap-6 py-6 flex-wrap">
      <div>
        <H4>Basic information</H4>
        <Paragraph variant="muted">View and update your personal details and account information.</Paragraph>
      </div>
      <div class="flex flex-col gap-6 flex-grow max-w-md min-w-[15rem]">
        <!-- first name -->
        <div class="flex flex-col gap-2">
          <Label>First name</Label>
          <Input bind:value={user.user_metadata.first_name} />
        </div>
        <div class="flex flex-col gap-2">
          <Label>Last name</Label>
          <Input bind:value={user.user_metadata.last_name} />
        </div>
        <div class="flex flex-col gap-2">
          <Label>Email address</Label>
          <Input bind:value={user.email} />
        </div>
        <div>
          <PromiseButton class="min-w-20" promise={handleBasicInfoSave}>Save</PromiseButton>
        </div>
      </div>
      <!-- border div with dashes -->
    </div>
  {:else}
    <PulseSpinner class="self-start py-6" />
  {/if}
  <!-- <Separator /> -->
</div>
