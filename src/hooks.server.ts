import { supaAdmin } from '$lib/services/utils/init.server';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  if (!event.url.pathname.startsWith('/api/v0/')) {
    return await resolve(event);
  }
  // get the x-api-key header
  const apiKey = event.request.headers.get('x-api-key');

  if (!apiKey) {
    console.error('No API key provided');
    return Response.json({ error: 'Unautharized: no x-api-key provided.' }, { status: 403 });
  }

  //   query the database for the user
  //   if the user exists, set the user in the locals
  //   if the user does not exist, return a 403
  const { data, error } = await supaAdmin.from('api_keys').select().eq('key', apiKey);
  if (error || !data.length) {
    console.error(error);
    return Response.json({ error: 'Unautharized' }, { status: 403 });
  }

  event.locals.user_id = data[0].user_id;

  const response = await resolve(event);
  response.headers.set('x-custom-header', 'potato');

  return response;
};
