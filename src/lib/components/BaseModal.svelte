<script lang="ts">
  let dialogEl: HTMLDialogElement;

  let { children, title = '', onClose = () => {}, open = $bindable(false) } = $props();
</script>

<dialog bind:this={dialogEl} class="modal" {open}>
  <div class="modal-box">
    {#if title}
      <h3 class="text-lg font-bold">{title}</h3>
    {/if}

    <div class="py-4">
      {@render children()}
    </div>
  </div>

  <!-- Click outside to close -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-backdrop" onclick={() => (open = false)}></div>
</dialog>
