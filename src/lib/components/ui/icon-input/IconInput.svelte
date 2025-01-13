<script lang="ts">
  import { Input } from '../input';
  import type { Snippet } from 'svelte';
  import { Label } from '../label';

  let {
    children,
    value = $bindable(),
    disabled = false,
  }: {
    children: Snippet;
    value: string;
    disabled?: boolean;
  } = $props();
</script>

<div class="relative h-10 w-full">
  <Label class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
    {#if children}
      {@render children()}
    {/if}
  </Label>
  <Input type="text" placeholder="Enter your comment here" class="pl-10" bind:value {disabled} />
</div>
