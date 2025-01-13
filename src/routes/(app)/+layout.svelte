<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import * as Collapsible from '$lib/components/ui/collapsible';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import FeedbackModal from '$lib/components/ui/feedback-modal/FeedbackModal.svelte';
  import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import Paragraph from '$lib/components/ui/text/Paragraph.svelte';
  import { UsersStore } from '$lib/services/stores/UsersStore';
  import {
    BookOpen,
    ChevronDown,
    FileTerminal,
    House,
    KeyRound,
    KeySquare,
    LayoutGrid,
    LifeBuoy,
    Network,
    Send,
    SquareTerminal,
  } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { cn } from 'tailwind-variants';

  let { children } = $props();

  onMount(async () => {
    try {
      await UsersStore.getCurrentUser();
    } catch (error) {
      toast.warning('You need to sign in to access this page');
      goto('/login');
    }
  });

  let currentPath = $state(browser ? window.location.pathname : '');
  page.subscribe((value) => {
    console.log('currentPath', value.url.pathname);
    currentPath = value.url.pathname;
  });
</script>

<Sidebar.Provider class="max-w-[100vw]">
  <Sidebar.Root collapsible="icon">
    <Sidebar.Header>
      <Sidebar.Menu>
        <Sidebar.MenuItem class="group-data-[collapsible=icon]:hidden">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              {#snippet child({ props })}
                <Sidebar.MenuButton {...props}>
                  <span class="flex items-center gap-2">
                    <Paragraph class="font-semibold">Acme Inc.</Paragraph>
                    <ChevronDown class="ml-auto w-4" />
                  </span>
                </Sidebar.MenuButton>
              {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="w-[--bits-dropdown-menu-anchor-width]">
              <DropdownMenu.Item
                onclick={async () => {
                  await UsersStore.signOut();
                }}
              >
                <span> Sign out </span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
      <Sidebar.MenuButton isActive={currentPath === '/'}>
        {#snippet child({ props })}
          <a href="/" {...props}>
            <House />
            Home
          </a>
        {/snippet}
      </Sidebar.MenuButton>
    </Sidebar.Header>

    <Sidebar.Content>
      <Collapsible.Root open class="group/collapsible">
        <Sidebar.Group>
          <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton isActive={currentPath.includes('/pipelines')}>
                  {#snippet child({ props })}
                    <a href="/pipelines" {...props}>
                      <SquareTerminal />
                      Pipelines
                    </a>
                  {/snippet}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton>
                  <BookOpen />
                  <a href="#"> Documentation </a>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
      </Collapsible.Root>
      <Sidebar.Group>
        <Collapsible.Root open class="group/collapsible">
          <Sidebar.Group>
            <Sidebar.GroupLabel>
              {#snippet child({ props })}
                <Collapsible.Trigger {...props}>
                  Settings
                  <ChevronDown class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </Collapsible.Trigger>
              {/snippet}
            </Sidebar.GroupLabel>
          </Sidebar.Group>
          <Collapsible.Content>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton isActive={currentPath === '/api-keys'}>
                    {#snippet child({ props })}
                      <a href="/api-keys" {...props}>
                        <KeyRound />
                        API Keys
                      </a>
                    {/snippet}
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton isActive={currentPath === '/providers'}>
                    {#snippet child({ props })}
                      <a href="/providers" {...props}>
                        <Network />
                        Providers
                      </a>
                    {/snippet}
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton isActive={currentPath === '/account'}>
                    {#snippet child({ props })}
                      <a href="/account" {...props}>
                        <LayoutGrid />
                        Account
                      </a>
                    {/snippet}
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Collapsible.Content>
        </Collapsible.Root>
      </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Footer>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton>
            {#snippet child({ props })}
              <FeedbackModal {...props}>
                <Send />
                <span> Feedback </span>
              </FeedbackModal>
            {/snippet}
          </Sidebar.MenuButton>
          <Sidebar.MenuButton>
            <LifeBuoy />
            <a href="#"> Help </a>
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Footer>
  </Sidebar.Root>
  <main class="flex flex-col min-h-screen w-full text-foreground">
    {@render children?.()}
  </main>
</Sidebar.Provider>
