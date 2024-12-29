<script lang="ts">
  import { onMount } from 'svelte';
  import { Users } from '../../lib/services/Users';
  import { goto } from '$app/navigation';
  import LogoutSvg from '$lib/SVG/LogoutSvg.svelte';
  import { browser } from '$app/environment';
  import { tweened } from 'svelte/motion';
  import { quintOut } from 'svelte/easing';
  import SidebarNavigationItem from '$lib/components/SidebarNavigationItem.svelte';
  import SunSvg from '$lib/SVG/SunSvg.svelte';
  import MoonSvg from '$lib/SVG/MoonSvg.svelte';
  import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
  let { children } = $props();

  let isSidebarExpanded = $state(browser ? localStorage.getItem('isSidebarExpanded') === 'true' : false);
  let isSidebarHovered: boolean = $state(false);

  $effect(() => {
    // cache the sidebar state
    if (browser) localStorage.setItem('isSidebarExpanded', String(isSidebarExpanded));
  });

  let shouldShowExtendedContent = $state(false);

  $effect(() => {
    if (isSidebarHovered || isSidebarExpanded) {
      $sidebarWidth = 15;
      // set shouldShowExtendedContent to true, but delay it by 100 ms
      setTimeout(() => {
        shouldShowExtendedContent = true;
      }, 25);
    } else {
      $sidebarWidth = 5;
      shouldShowExtendedContent = false;
    }
  });

  const sidebarWidth = tweened(20, {
    duration: 200,
    easing: quintOut,
  });

  //   check if user is logged in
  onMount(async () => {
    const user = await Users.getCurrentUser();
    if (!user) {
      console.log('User not logged in');

      // redirect to login page if user is not logged in
      alert('Please login to continue');
      goto('/login');
    }
  });
</script>

<div class="drawer drawer-open">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex items-center justify-center bg-base-200">
    {@render children()}
  </div>
  <div class="drawer-side">
    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    <aside
      class={`menu p-4 min-h-full bg-base-100 text-base-content`}
      style="width: {$sidebarWidth}rem"
      onmouseenter={() => {
        // console.log('hovered');
        isSidebarHovered = true;
      }}
      onmouseleave={() => {
        // console.log('un-hovered');
        isSidebarHovered = false;
      }}
    >
      <div class="flex flex-row justify-between items-center">
        <span class="font-semibold">
          {shouldShowExtendedContent ? 'Promptable' : ''}
        </span>
        <button class="btn btn-ghost btn-square" onclick={() => (isSidebarExpanded = !isSidebarExpanded)}>
          {#if isSidebarExpanded}
            ←
          {:else}
            🟰
          {/if}
        </button>
      </div>
      <ul class="flex flex-col grow justify-center">
        <SidebarNavigationItem href={'/'} {shouldShowExtendedContent}>
          {#snippet icon()}
            🏠
          {/snippet}
          Home
        </SidebarNavigationItem>

        <SidebarNavigationItem href={'/pipeline'} {shouldShowExtendedContent}>
          {#snippet icon()}
            ⚙️
          {/snippet}
          Pipelines
        </SidebarNavigationItem>

        <SidebarNavigationItem href={'/promptLogs'} {shouldShowExtendedContent}>
          {#snippet icon()}
            📃
          {/snippet}
          Logs
        </SidebarNavigationItem>

        <SidebarNavigationItem href={'/apiKeys'} {shouldShowExtendedContent}>
          {#snippet icon()}
            🔐
          {/snippet}
          API Keys
        </SidebarNavigationItem>

        <!-- align this to the bottom -->
      </ul>
      <li class={'mt-auto ' + (shouldShowExtendedContent ? '' : 'hidden')}>
        <ThemeSwitcher />
      </li>
      <li class="mt-auto">
        <button onclick={() => Users.signOut()}>
          <span class="scale-x-[-1]">
            <LogoutSvg />
          </span>
          {#if shouldShowExtendedContent}
            Log Out
          {/if}
        </button>
      </li>
    </aside>
  </div>
</div>
