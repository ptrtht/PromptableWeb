<script lang="ts">
  import InputWithCopy from '$lib/components/InputWithCopy.svelte';
  import BaseNode from '$lib/components/Pipeline/Nodes/BaseNode.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import { WebhookTriggerNode } from '$lib/services/pipeline/triggers/WebhookTriggerNode';
  import ApiSvg from '$lib/SVG/ApiSvg.svelte';

  //     node,
  // open = $bindable(false),
  // icon,
  // children,
  // editing,

  let {
    open = $bindable(false),
    node = $bindable<WebhookTriggerNode>(new WebhookTriggerNode({ id: 'Webhook Trigger' })),
  }: {
    open: boolean;
    node: WebhookTriggerNode;
  } = $props();
</script>

<BaseNode bind:open {node}>
  {#snippet icon()}
    <ApiSvg />
  {/snippet}

  {#snippet children()}
    <div class="flex flex-col gap-3">
      <label class="flex flex-col gap-1">
        <span class="opacity-50">Webhook URL</span>
        <InputWithCopy value={node.inputs.url} />
      </label>

      <label class="flex flex-col gap-1">
        <span class="opacity-50">Promptable SDK</span>
        <CodeBlock
          value={`const response =\n  await promptable\n  .pipeline('${node.inputs.webhookId}')`}
          language="typescript"
        />
      </label>
    </div>
  {/snippet}

  {#snippet editing()}
    <p>A webhook is a way to trigger a pipeline from an external source.</p>
    <label class="flex flex-col gap-2">
      <span class="opacity-50">Webhook URL</span>
      <InputWithCopy value={node.inputs.url} />
    </label>
    <label class="flex flex-col gap-2">
      <span class="opacity-50">Promptable SDK</span>
      <CodeBlock
        value={`const response =\n  await promptable\n  .pipeline('${node.inputs.webhookId}')`}
        language="typescript"
      />
    </label>
  {/snippet}
</BaseNode>
