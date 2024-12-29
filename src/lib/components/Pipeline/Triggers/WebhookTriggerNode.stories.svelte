<script lang="ts" module>
    import WebhookTriggerNode from './WebhookTriggerNode.svelte';
    import { defineMeta } from '@storybook/addon-svelte-csf';
  
    // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
    const { Story } = defineMeta({
      title: 'Pipeline/Triggers/WebhookTriggerNode',
      component: WebhookTriggerNode,
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
  