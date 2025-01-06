<script lang="ts">
  import GithubSvg from '$lib/components/svg/GithubSvg.svelte';
  import GoogleSvg from '$lib/components/svg/GoogleSvg.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card/index.js';
  import Divider from '$lib/components/ui/divider/Divider.svelte';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import PromiseButton from '$lib/components/ui/promiseButton/PromiseButton.svelte';
  import H1 from '$lib/components/ui/text/H1.svelte';
  import Paragraph from '$lib/components/ui/text/Paragraph.svelte';
  import { UsersStore } from '$lib/services/stores/UsersStore';

  const userdata = $state({
    email: { error: '', value: '' },
    password: { error: '', value: '' },
  });

  const onLogin = async () => {
    let errors = false;
    // validate
    if (!userdata.email.value) {
      userdata.email.error = 'Email is required';
      errors = true;
    }
    if (!userdata.password.value || userdata.password.value.length < 8) {
      userdata.password.error = 'Password is required';
      errors = true;
    }

    if (errors) {
      throw new Error('Validation failed');
    }

    await UsersStore.signInWithEmailPassword({
      email: userdata.email.value,
      password: userdata.password.value,
    });
  };
</script>

<div class="min-h-screen flex items-center justify-center">
  <div class="flex flex-col gap-8 max-w-lg">
    <Card.Root class="px-6 rounded-xl min-w-full">
      <Card.Header class="flex flex-col items-center justify-center">
        <H1>Sign in to Promptable</H1>
        <Paragraph variant="muted">Welcome back! Please sign in to continue.</Paragraph>
      </Card.Header>
      <Card.Content>
        <form class="flex flex-col gap-4">
          <div class="flex gap-2">
            <PromiseButton variant="outline" promise={UsersStore.signInWithGithub}>
              <GithubSvg />
            </PromiseButton>

            <PromiseButton variant="outline" promise={UsersStore.signInWithGoogle}>
              <GoogleSvg />
            </PromiseButton>
          </div>

          <Divider>OR</Divider>

          <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label for="email">Email</Label>
            <Input
              type="mail"
              placeholder="Email"
              bind:value={userdata.email.value}
              class={userdata.email.error ? 'border-destructive' : ''}
            />
            {#if userdata.email.error}
              <Paragraph variant="error" size="sm">{userdata.email.error}</Paragraph>
            {/if}
          </div>
          <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label for="email-2">Password</Label>
            <Input
              type="password"
              placeholder="Password"
              autocomplete="current-password"
              class={userdata.password.error ? 'border-destructive' : ''}
              bind:value={userdata.password.value}
            />
            <Paragraph variant={userdata.password.error ? 'error' : 'muted'} size="sm">Minimum 8 characters.</Paragraph>
          </div>

          <PromiseButton promise={onLogin}>Continue</PromiseButton>

          <div class="flex gap-1 justify-center">
            <Paragraph variant="muted">Don't have an account?</Paragraph>
            <a class="leading-7 text-foreground underline" href="/register">Sign up</a>
          </div>
        </form>
      </Card.Content>
    </Card.Root>
    <div class="flex justify-between">
      <Paragraph variant="muted">© 2025 Promptable</Paragraph>
      <div class="flex gap-2">
        <a href="">
          <Paragraph variant="muted" class="underline">Terms</Paragraph>
        </a>
        <a href="">
          <Paragraph variant="muted" class="underline">Privacy</Paragraph>
        </a>
      </div>
    </div>
  </div>
</div>
