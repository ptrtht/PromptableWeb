import { supaAdmin } from '$lib/services/server/init';
import type { RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ request, locals }) => {
  const user_id = locals.user_id;
  if (!user_id) {
    return new Response('Unauthorized', { status: 403 });
  }
  //   try {
  const body = await request.json();
  console.log('OpenAI Log:', body);

  let insert = {
    user_id,
    input: body.input,
    output: body.output,
  };

  const { data, error } = await supaAdmin.from('prompt_logs').insert(insert).select();

  if (error) {
    throw error;
  }

  console.log('Inserted:', data);
  //   } catch {
  //   } finally {
  return new Response('OK', { status: 200 });
  //   }
}) satisfies RequestHandler;
