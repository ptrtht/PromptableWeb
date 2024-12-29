<script lang="ts" module>
  import APINode from './ApiNode.svelte';
  import { ApiNode } from '$lib/services/pipeline/ApiNode';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Pipeline/Nodes/ApiNode',
    component: APINode,
    tags: ['autodocs'],
    argTypes: {
      open: {
        control: 'boolean',
      },
    },
    args: {
      node: new ApiNode({ id: 'API Call Node' }),
    },
  });
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Primary" />
<!-- 
<Story name="Open" args={{ open: true }} />

<Story
  name="Filled with node"
  args={{
    open: true,
    node: new ApiNode({
      id: 'Filled API Node',
      inputs: {
        url: 'https://example.com',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: `{ "key": "value" }`,
      },
    }),
  }}
/> -->
