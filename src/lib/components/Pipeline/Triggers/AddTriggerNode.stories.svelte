<script lang="ts" module>
  import AddTriggerNode from './AddTriggerNode.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Pipeline/Triggers/AddTriggerNode',
    component: AddTriggerNode,
    tags: ['autodocs'],
    argTypes: {
      open: {
        control: 'boolean',
      },
    },
    args: {},
  });
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Primary" args={{}} />
<Story name="Open" args={{ open: true }} />
