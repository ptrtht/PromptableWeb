<script lang="ts" module>
  import BaseDrawer from '$lib/components/BaseDrawer.svelte';
  import { ApiNode } from '$lib/services/pipeline/ApiNode';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from '@storybook/test';

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'BaseDrawer',
    component: BaseDrawer,
    tags: ['autodocs'],
    argTypes: {
      open: {
        control: {
          type: 'boolean',
        },
      },
      onClose: fn(),
    },
    args: {
      open: false,
    },
  });
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Open" args={{ open: true }} />
<Story name="Closed" args={{ open: false }} />
