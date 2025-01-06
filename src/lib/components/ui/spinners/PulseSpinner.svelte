<script lang="ts">
  const { class: className }: { class?: string } = $props();
</script>

<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class={className}>
  <style>
    .spinner_7NYg {
      animation: spinner_0KQs 1.2s cubic-bezier(0.52, 0.6, 0.25, 0.99) infinite;
    }
    @keyframes spinner_0KQs {
      0% {
        r: 0;
        opacity: 1;
      }
      100% {
        r: 11px;
        opacity: 0;
      }
    }
  </style>
  <circle class="spinner_7NYg" cx="12" cy="12" r="0" />
</svg>
