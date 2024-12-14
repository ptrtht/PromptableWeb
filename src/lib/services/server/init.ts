import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPA_URL } from '$env/static/public';
import { PRIVATE_SUPA_JWT } from '$env/static/private';
import type { Database } from 'firebase/database';

export const supaAdmin = createClient<Database>(PUBLIC_SUPA_URL, PRIVATE_SUPA_JWT, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

