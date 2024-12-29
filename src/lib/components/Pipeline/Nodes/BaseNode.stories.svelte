<script lang="ts" module>
  import BaseNodeComponent from './BaseNode.svelte';
  import { BaseNode } from '$lib/services/pipeline/BaseNode';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Pipeline/Nodes/BaseNode',
    component: BaseNodeComponent,
    tags: ['autodocs'],
    argTypes: {
      open: {
        control: 'boolean',
      },
    },
    args: {
      node: new BaseNode('API Call Node', 'Base Node'),
    },
  });
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Primary" />
<Story
  name="Open"
  args={{
    open: true,
  }}
/>
