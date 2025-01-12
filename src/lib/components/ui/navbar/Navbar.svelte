<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import type { Snippet } from 'svelte';
  import { cn } from 'tailwind-variants';
  import Divider from '../divider/Divider.svelte';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

  const {
    children,
    breadcrumbs,
  }: {
    children?: Snippet;
    breadcrumbs: {
      label: string;
      href: string;
    }[];
  } = $props();
</script>

<!-- make sticky to top -->
<div
  class="border-b w-full flex gap-2 h-16 items-center px-4 text-foreground bg-background
  sticky top-0 z-50 shadow-xs"
>
  <Sidebar.Trigger />
  <Divider direction="vertical" class="py-6" />
  <dir class="flex-grow m-0 p-0 ml-1 flex place-content-between">
    <nav class={' flex items-center space-x-4 justify-end'}>
      <Breadcrumb.Root class="">
        <Breadcrumb.List>
          {#each breadcrumbs as breadcrumb, idx}
            <Breadcrumb.Item>
              <Breadcrumb.Link href={breadcrumb.href}>
                {breadcrumb.label}
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            {#if idx < breadcrumbs.length - 1}
              <Breadcrumb.Separator />
            {/if}
          {/each}
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </nav>
    <div class="ml-auto flex items-center space-x-4">
      {#if children}
        {@render children()}
      {/if}
    </div>
  </dir>
</div>
