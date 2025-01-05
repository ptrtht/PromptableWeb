<script lang="ts">
  import { PromptLogsStore } from '$lib/services/stores/PromptLogsStore';
  import { Json } from '$lib/services/util/init';
  import { onMount } from 'svelte';

  let selectedLogId = $state<number | null>(null);

  let logs = $state<
    {
      created_at: string;
      id: number;
      input: Json | null;
      output: Json | null;
      user_id: string | null;
    }[]
  >([]);

  onMount(async () => {
    logs = await PromptLogsStore.getLogs();
  });
</script>

<div class="overflow-x-auto min-w-full p-10">
  <table class="table">
    <!-- head -->
    <thead>
      <tr>
        <th>ID</th>
        <th>Created At</th>
        <th>Input</th>
        <th>Output</th>
      </tr>
    </thead>
    <tbody>
      {#each logs as log}
        <tr
          class={selectedLogId === log.id ? 'bg-base-300' : 'hover'}
          onclick={() => {
            selectedLogId = selectedLogId === log.id ? null : log.id;
          }}
        >
          <th>{log.id}</th>
          <td>{new Date(log.created_at).toLocaleString()}</td>
          <td>{log.input}</td>
          <td>{log.output}</td>
        </tr>
        {#if selectedLogId === log.id}
          <tr class="p-5 bg-base-300">
            <td colspan="4">
              <div class="grid grid-cols-2">
                <div>
                  <h2 class="text-lg font-bold">Input</h2>
                  <pre>{JSON.stringify(log.input, null, 2)}</pre>
                </div>
                <div>
                  <h2 class="text-lg font-bold">Output</h2>
                  <pre>{JSON.stringify(log.output, null, 2)}</pre>
                </div>
              </div>
            </td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>
</div>
