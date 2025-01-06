<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { UsersStore } from '$lib/services/stores/UsersStore';

  onMount(async () => {
    const user = await UsersStore.getCurrentUser();
    if (user) {
      // redirect to home if user is already logged in
      goto('/');
    } else {
      // redirect to login page if user is not logged in
      alert('Please login to continue');
      goto('/login');
    }
  });
</script>

<div class="min-h-screen flex items-center justify-center">
    <span class="loading loading-ring self-center"></span>
</div>