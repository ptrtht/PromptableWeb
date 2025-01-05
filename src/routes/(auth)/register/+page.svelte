<script lang="ts">
  import { ShieldCheck, SquareDashedMousePointer, TextSearch } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import GoogleSvg from '$lib/components/svg/GoogleSvg.svelte';
  import GithubSvg from '$lib/components/svg/GithubSvg.svelte';
</script>

<div class="min-h-screen flex items-center justify-center">
  <div class="grid lg:grid-cols-2 items-center justify-center max-w-6xl">
    <div class="flex flex-col gap-8 p-8">
      <div class="flex flex-col gap-4">
        <h1 class="scroll-m-20 text-4xl font-semibold tracking-tight ">
          Start building powerful LLM pipelines today
        </h1>
        <div class="text-muted-foreground">Visually build, test and deploy production-ready pipelines</div>
      </div>
      <div class="flex gap-4">
        <SquareDashedMousePointer />
        <div class="flex flex-col gap-2">
          <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">Connect LLM operations on a visual canvas</h4>
          <p class="leading-7 text-muted-foreground">
            Chain together webhooks, API requests and LLM calls using a drag-and-drop interface.
          </p>
        </div>
      </div>
      <div class="flex gap-4">
        <TextSearch />
        <div class="flex flex-col gap-2">
          <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">Test and validate before you deploy</h4>
          <p class="leading-7 text-muted-foreground">
            QA your pipeline with live data: validate inputs, inspect node outputs, and test LLM responses before
            deploying.
          </p>
        </div>
      </div>
      <div class="flex gap-4">
        <ShieldCheck />
        <div class="flex flex-col gap-2">
          <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">Ready to run in production</h4>
          <p class="leading-7 text-muted-foreground">
            Build with proper safeguards: encrypted API keys, version control for tracking changes. Monitoring coming
            soon.
          </p>
        </div>
      </div>
    </div>
    <div class="flex p-8">
      <Card.Root class="p-8 rounded-xl">
        <Card.Content>
          <div class="flex flex-col gap-4">
            <div class="flex gap-4">
              <div class="flex w-full max-w-sm flex-col gap-1.5">
                <Label for="email">Name</Label>
                <Input type="text" placeholder="Name" />
              </div>
              <div class="flex w-full max-w-sm flex-col gap-1.5">
                <Label for="email">Last Name</Label>
                <Input type="text" placeholder="Name" />
              </div>
            </div>
            <div class="flex w-full max-w-sm flex-col gap-1.5">
              <Label for="email">Email</Label>
              <Input type="mail" placeholder="Email" />
            </div>
            <div class="flex w-full max-w-sm flex-col gap-1.5">
              <Label for="email-2">Password</Label>
              <Input type="password" placeholder="Password" />
              <p class="text-muted-foreground text-sm">Minimum 8 characters.</p>
            </div>

            <Button>Sign up</Button>
            <div class="flex gap-1 justify-center">
              <p class="leading-7 text-muted-foreground">Already have an account?</p>
              <button class="leading-7 text-foreground underline">Sign in</button>
            </div>
            <div class="relative flex items-center">
              <div class="flex-grow border-t border-muted-foreground"></div>
              <span class="flex-shrink text-sm leading-none mx-4 text-muted-foreground">OR</span>
              <div class="flex-grow border-t border-muted-foreground"></div>
            </div>

            <div class="flex gap-2">
              <Button variant="outline" class="flex-grow">
                <GoogleSvg />
              </Button>
              <Button variant="outline" class="flex-grow">
                <GithubSvg />
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>
