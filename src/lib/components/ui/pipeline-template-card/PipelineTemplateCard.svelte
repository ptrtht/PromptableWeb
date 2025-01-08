<script lang="ts">
  import type { Snippet } from 'svelte';
  import * as Card from '../card';
  import Paragraph from '../text/Paragraph.svelte';
  import H4 from '../text/H4.svelte';
  import { Button } from '../button';

  const {
    children: icon,
    title,
    description,
  }: {
    children: Snippet;
    title: string;
    description: string;
  } = $props();
</script>

<Card.Root class="max-w-lg">
  <Card.Header class="flex gap-2">
    {@render icon()}
    <div>
      <H4>{title}</H4>
      <Paragraph variant="muted">
        {description}
      </Paragraph>
    </div>
  </Card.Header>
  <Card.Content class="flex  justify-start">
    <Button variant="default">Use template</Button>
  </Card.Content>
</Card.Root>
