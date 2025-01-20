<script lang="ts">
  const { children } = $props();
</script>

<div class="relative h-full w-full">
  <!-- Adjust h-64 to your desired height -->
  <!-- Background Grid Layer -->
  <div class="absolute inset-0 bg-background">
    <svg
      class="text-muted/25
    "
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect class="text-foreground/10 opacity-75" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>

  <!-- Content Layer -->
  {@render children()}
</div>
