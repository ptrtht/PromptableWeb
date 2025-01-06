<script lang="ts">
  import type { Snippet } from 'svelte';
  import Button, { buttonVariants } from '../button/button.svelte';
  import PulseSpinner from '../spinners/PulseSpinner.svelte';
  import { cn } from '$lib/utils';

  const {
    children,
    promise,
    class: className,
    ...restProps
  }: {
    children: Snippet;
    className?: string;
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

<Button
  {...restProps}
  class={cn('flex-grow', className)}
  onclick={async () => await handleClick()}
  disabled={isPromisePending}
>
  {#if isPromisePending}
    <PulseSpinner class={restProps.variant === 'outline' ? '' : 'fill-primary-foreground'} />
  {:else}
    <span>
      {@render children()}
    </span>
  {/if}
</Button>
