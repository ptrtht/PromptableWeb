<script lang="ts">
  import type { User } from '@supabase/supabase-js';
  import * as Avatar from '../avatar';

  const {
    user,
  }: {
    user: User | null;
  } = $props();
</script>

<Avatar.Root>
  <Avatar.Image src={user?.user_metadata.avatar_url} alt={'@' + user?.user_metadata?.user_name} />
  <Avatar.Fallback>
    <!-- the initials of their name -->
    {user?.user_metadata.full_name
      ?.split(' ')
      .map((name: string) => name.charAt(0))
      .join('')}
  </Avatar.Fallback>
</Avatar.Root>
