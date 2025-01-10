<script>
  import AddTriggerSidebar from '../../node-sidebar/AddTriggerSidebar.svelte';
  import BaseNodeView from '../BaseNodeView.svelte';

  const { children } = $props();

  let active = $state(true);
</script>

<BaseNodeView class="border-dashed border border-width:5 border-primary/25" onclick={() => (active = true)}>
  {@render children()}
</BaseNodeView>

<AddTriggerSidebar bind:open={active} />
