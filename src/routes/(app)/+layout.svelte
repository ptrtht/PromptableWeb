<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import Paragraph from '$lib/components/ui/text/Paragraph.svelte';
  import { UsersStore } from '$lib/services/stores/UsersStore';
  import {
    BookOpen,
    ChevronDown,
    House,
    KeyRound,
    KeySquare,
    LayoutGrid,
    LifeBuoy,
    Send,
    SquareTerminal,
  } from 'lucide-svelte';

  let { children } = $props();
</script>

<Sidebar.Provider>
  <Sidebar.Root>
    <Sidebar.Header>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
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
      <Sidebar.MenuButton>
        <House />
        <a href="#"> Home </a>
      </Sidebar.MenuButton>
    </Sidebar.Header>

    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <SquareTerminal />
                <a href="#"> Pipelines </a>
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
      <Sidebar.Group>
        <Sidebar.GroupLabel>Settings</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <KeyRound />
                <a href="#"> API Keys </a>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <KeySquare />
                <a href="#"> Virtual Keys </a>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <LayoutGrid />
                <a href="#"> Account </a>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Footer>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton>
            <Send />
            <a href="#"> Feedback </a>
          </Sidebar.MenuButton>
          <Sidebar.MenuButton>
            <LifeBuoy />
            <a href="#"> Help </a>
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Footer>
  </Sidebar.Root>
  <main>
    <Sidebar.Trigger />
    {@render children?.()}
  </main>
</Sidebar.Provider>
