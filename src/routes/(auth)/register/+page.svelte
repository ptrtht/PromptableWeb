<script lang="ts">
  import { ShieldCheck, SquareDashedMousePointer, TextSearch } from 'lucide-svelte';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import GoogleSvg from '$lib/components/svg/GoogleSvg.svelte';
  import GithubSvg from '$lib/components/svg/GithubSvg.svelte';
  import H1 from '$lib/components/ui/text/H1.svelte';
  import H4 from '$lib/components/ui/text/H4.svelte';
  import Paragraph from '$lib/components/ui/text/Paragraph.svelte';
  import Divider from '$lib/components/ui/divider/Divider.svelte';
  import { UsersStore } from '$lib/services/stores/UsersStore';
  import PromiseButton from '$lib/components/ui/promiseButton/PromiseButton.svelte';

  const userdata = $state({
    name: {
      error: '',
      value: '',
    },
    lastName: {
      error: '',
      value: '',
    },
    email: {
      error: '',
      value: '',
    },
    password: {
      error: '',
      value: '',
    },
  });

  const handleSignup = async () => {
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

    if (!userdata.name.value) {
      userdata.name.error = 'Name is required';
      errors = true;
    }
    if (!userdata.lastName.value) {
      userdata.lastName.error = 'Last name is required';
      errors = true;
    }

    if (errors) {
      throw new Error('Validation failed');
    }

    await UsersStore.signUpWithEmailPassword({
      email: userdata.email.value,
      password: userdata.password.value,
      name: userdata.name.value,
      lastName: userdata.lastName.value,
    });
  };
</script>

<div class="min-h-screen flex items-center justify-center">
  <div class="grid lg:grid-cols-2 items-center justify-center max-w-6xl">
    <div class="flex flex-col gap-8 p-8">
      <div class="flex flex-col gap-4">
        <H1>Start building powerful LLM pipelines today</H1>
        <Paragraph variant="muted">Visually build, test and deploy production-ready pipelines</Paragraph>
      </div>
      <div class="flex gap-4">
        <div class="w-6 flex">
          <SquareDashedMousePointer />
        </div>
        <div class="flex flex-col gap-2">
          <H4>Connect LLM operations on a visual canvas</H4>
          <Paragraph variant="muted">
            Chain together webhooks, API requests and LLM calls using a drag-and-drop interface.
          </Paragraph>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-6 flex">
          <TextSearch />
        </div>
        <div class="flex flex-col gap-2">
          <H4>Test and validate before you deploy</H4>
          <Paragraph variant="muted">
            QA your pipeline with live data: validate inputs, inspect node outputs, and test LLM responses before
            deploying.
          </Paragraph>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-6 flex">
          <ShieldCheck />
        </div>
        <div class="flex flex-col gap-2">
          <H4>Ready to run in production</H4>
          <Paragraph variant="muted">
            Build with proper safeguards: encrypted API keys, version control for tracking changes. Monitoring coming
            soon.
          </Paragraph>
        </div>
      </div>
    </div>
    <form class="flex p-8">
      <Card.Root class="p-8 rounded-xl min-w-full">
        <Card.Content>
          <div class="flex flex-col gap-4">
            <div class="flex gap-4">
              <div class="flex w-full max-w-sm flex-col gap-1.5">
                <Label for="email">Name</Label>
                <Input
                  type="text"
                  placeholder="Name"
                  bind:value={userdata.name.value}
                  autocomplete="given-name"
                  class={userdata.name.error ? 'border-destructive' : ''}
                />
                {#if userdata.name.error}
                  <Paragraph variant="error" size="sm">{userdata.name.error}</Paragraph>
                {/if}
              </div>
              <div class="flex w-full max-w-sm flex-col gap-1.5">
                <Label for="email">Last Name</Label>
                <Input
                  type="text"
                  placeholder="Name"
                  bind:value={userdata.lastName.value}
                  autocomplete="family-name"
                  class={userdata.lastName.error ? 'border-destructive' : ''}
                />
                {#if userdata.lastName.error}
                  <Paragraph variant="error" size="sm">{userdata.lastName.error}</Paragraph>
                {/if}
              </div>
            </div>
            <div class="flex w-full max-w-sm flex-col gap-1.5">
              <Label for="email">Email</Label>
              <Input
                type="mail"
                placeholder="Email"
                class={userdata.email.error ? 'border-destructive' : ''}
                bind:value={userdata.email.value}
                autocomplete="email"
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
                autocomplete="new-password"
                class={userdata.password.error ? 'border-destructive' : ''}
                bind:value={userdata.password.value}
              />
              <Paragraph variant={userdata.password.error ? 'error' : 'muted'} size="sm"
                >Minimum 8 characters.</Paragraph
              >
            </div>

            <PromiseButton promise={handleSignup}>Sign up</PromiseButton>
            <div class="flex gap-1 justify-center">
              <Paragraph variant="muted">Already have an account?</Paragraph>
              <a class="leading-7 text-foreground underline" href="/login">Sign in</a>
            </div>
            <Divider>OR</Divider>
            <div class="flex gap-2">
              <PromiseButton variant="outline" promise={UsersStore.signInWithGithub}>
                <GithubSvg />
              </PromiseButton>
              <PromiseButton variant="outline" promise={UsersStore.signInWithGoogle}>
                <GoogleSvg />
              </PromiseButton>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    </form>
  </div>
</div>
