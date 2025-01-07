import { supabase } from '$lib/services/utils/init';
import type { PageLoad } from './$types';
import type { Tables } from '$lib/services/utils/init';

export const load: PageLoad = async ({ params }) => {
  // get providers

  const { data, error } = await supabase.from('providers').select('*');

  if (error) {
    console.error('Error getting providers', error);
    return {
      status: 500,
      error: 'Error getting providers',
    };
  }

  return {
    providers: (data ?? []) as Tables['providers']['Row'][],
  };
};
