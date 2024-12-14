<script lang="ts">
  import { page } from '$app/stores';

  let { href, shouldShowExtendedContent, children, icon } = $props();
</script>

<li class={$page.url.pathname === href ? 'bg-base-100 rounded-lg' : ''}>
  <a {href}>
    {@render icon()}
    {#if shouldShowExtendedContent}
      {@render children()}
    {/if}
  </a>
</li>
