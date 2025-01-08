<script lang="ts">
  import type { User } from '@supabase/supabase-js';
  import * as Avatar from '../avatar';
  import { getUserAvatarUrl, getUserInitials, getUserName } from '$lib/utils/utils';

  const {
    user,
  }: {
    user: User | null;
  } = $props();
</script>

<Avatar.Root>
  <Avatar.Image src={user ? getUserAvatarUrl(user) : ''} alt={'@' + (user ? getUserName(user) : '')} />
  <Avatar.Fallback>
    <!-- the initials of their name -->
    {#if user}
      {getUserInitials(user)}
    {/if}
  </Avatar.Fallback>
</Avatar.Root>
