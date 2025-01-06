import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPA_URL } from '$env/static/public';
import { PRIAVTE_NOTION_API_KEY, PRIVATE_SUPA_JWT } from '$env/static/private';
import type { Database } from 'firebase/database';

export const supaAdmin = createClient<Database>(PUBLIC_SUPA_URL, PRIVATE_SUPA_JWT, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

import { Client } from '@notionhq/client';

// Initializing a client
export const notion = new Client({
  auth: PRIAVTE_NOTION_API_KEY,
});
