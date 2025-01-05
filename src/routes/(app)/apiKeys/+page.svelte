<script lang="ts">
  import { ApiKeyStore } from '$lib/services/stores/ApiKeyStore';
  import type { Tables } from '$lib/services/util/init';
  import { onMount } from 'svelte';

  let keyName = $state('');
  let keys = $state<Tables['api_keys']['Row'][]>([]);

  const createKey = async () => {
    await ApiKeyStore.createKey(keyName);
    window.location.reload();
  };

  onMount(async () => {
    keys = await ApiKeyStore.getKeys();
  });
</script>

<div class="grid gap-10">
  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Created At</th>
          <th>Key</th>
        </tr>
      </thead>
      <tbody>
        {#if keys.length === 0}
          <tr>
            <td colspan="4">No keys available</td>
          </tr>
        {/if}

        {#each keys as key, i}
          {@const apiKey = key.key}
          <tr>
            <th>{i + 1}</th>
            <td>{key.name}</td>
            <td>{key.created_at}</td>
            {#if apiKey}
              <td class="join">
                <input type="password" class="input" value={key.key} />
                <button class="btn join-item" onclick={() => navigator.clipboard.writeText(apiKey)}> Copy </button>
              </td>
            {:else}
              <td>Not Available</td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="join justify-center items-center">
    <input class="input input-bordered join-item" placeholder="Key Name" bind:value={keyName} />
    <button class="btn btn-primary join-item" onclick={createKey}>Create New</button>
  </div>
</div>
