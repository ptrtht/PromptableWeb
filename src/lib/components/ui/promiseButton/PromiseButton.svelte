<script lang="ts">
  import type { Snippet } from 'svelte';
  import Button, { buttonVariants } from '../button/button.svelte';
  import PulseSpinner from '../spinners/PulseSpinner.svelte';

  const {
    children,
    promise,
    ...restProps
  }: {
    children: Snippet;
    promise: () => Promise<any>;
  } & Record<string, any> = $props();

  let isPromisePending = $state<boolean>(false);

  const handleClick = async () => {
    isPromisePending = true;
    console.log('resolving promise');
    try {
      await promise();
    } catch (error) {
      console.error(error);
      isPromisePending = false;
    }
  };
</script>

<Button {...restProps} class="flex-grow" onclick={async () => await handleClick()} disabled={isPromisePending}>
  {#if isPromisePending}
    <PulseSpinner />
  {:else}
    <span>
      {@render children()}
    </span>
  {/if}
</Button>
