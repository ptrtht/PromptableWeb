<script lang="ts">
  import type { Snippet } from 'svelte';
  import Button, { buttonVariants } from '../button/button.svelte';
  import PulseSpinner from '../spinners/PulseSpinner.svelte';
  import { cn } from '$lib/utils';

  const {
    children,
    promise,
    class: className,
    variant = 'default',
    ...restProps
  }: {
    children: Snippet;
    className?: string;
    promise: () => Promise<any>;
    variant?: keyof (typeof buttonVariants)['variants']['variant'];
  } & Record<string, any> = $props();

  let isPromisePending = $state<boolean>(false);

  const handleClick = async () => {
    isPromisePending = true;
    console.log('resolving promise');
    try {
      await promise();
      setTimeout(() => {
        isPromisePending = false;
      }, 2000);
    } catch (error) {
      isPromisePending = false;
      console.error(error);
    }
  };
</script>

<Button
  {...restProps}
  class={cn('flex-grow', className)}
  onclick={async () => await handleClick()}
  disabled={isPromisePending}
  {variant}
>
  {#if isPromisePending}
    <PulseSpinner
      class={variant === 'destructive'
        ? 'fill-destructive'
        : variant === 'destructive_outline'
          ? 'fill-destructive'
          : variant === 'default'
            ? 'fill-primary-foreground'
            : ''}
    />
  {:else}
    <span>
      {@render children()}
    </span>
  {/if}
</Button>
