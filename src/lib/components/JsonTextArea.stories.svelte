<script lang="ts" module>
  import JsonTextArea from '$lib/components/JsonTextArea.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'JsonTextArea',
    component: JsonTextArea,
    tags: ['autodocs'],
    argTypes: {
      value: {},
    },
    args: {
      value: '{\n  "key": "value"\n}',
    },
  });
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
 
<Story name="Primary" />
