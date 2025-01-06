<script lang="ts">
  import Paragraph from '../text/Paragraph.svelte';

  const { children } = $props();
</script>

<div class="relative flex items-center">
  <div class="flex-grow border-t border-muted-foreground"></div>
  <Paragraph variant="muted" size="xs" class="flex-shrink leading-none mx-4">
    {#if children}
      {@render children()}
    {/if}
  </Paragraph>
  <div class="flex-grow border-t border-muted-foreground"></div>
</div>
