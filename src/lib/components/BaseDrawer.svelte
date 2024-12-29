<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  let {
    open = $bindable(false),
    children,
    title,
    onClose = () => {},
  }: {
    children: Snippet;
    title: Snippet;
    open: boolean;
    onClose?: () => void;
  } = $props();
</script>

{#if open}
  <div
    class="fixed top-0 left-0 h-screen w-full reverse"
    transition:fly={{
      delay: 0,
      duration: 300,
      x: 200,
    }}
  >
    <div class="drawer drawer-end drawer-open">
      <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="drawer-content bg-base-100 bg-opacity-50"
        in:fade={{ delay: 200, duration: 200 }}
        out:fade={{ delay: 0, duration: 0 }}
        onclick={() => (open = false)}
      >
        <!-- fill space and add blur, on click close modal -->
      </div>
      <div class="drawer-side">
        <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="menu bg-base-100 text-base-content min-h-full w-80 p-5">
          <!-- Title -->

          {#if title}
            <span class="font-semibold text-xl">
              {@render title()}
            </span>
          {:else}
            <span class="font-semibold text-xl"> Sidebar Title </span>
          {/if}
          <hr class="my-5" />

          {#if children}
            {@render children()}
          {:else}
            <!-- Sidebar content here -->
            <li><span>Sidebar Item 1</span></li>
            <li><span>Sidebar Item 2</span></li>
          {/if}
        </ul>
      </div>
    </div>
  </div>
{/if}
