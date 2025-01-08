import { supabase, type Tables } from '$lib/services/utils/init';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  // get providers

  const { data, error } = await supabase.from('providers').select('*').in('name', ['OpenAI', 'Grok', 'Anthropic']);

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
