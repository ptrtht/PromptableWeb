<script lang="ts" module>
  import TEST from './TEST.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'TEST',
    component: TEST,
    tags: ['autodocs'],
    argTypes: {},
    args: {},
  });
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Primary" />
