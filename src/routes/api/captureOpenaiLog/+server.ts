import { supabase } from '$lib/services/init';
import type { RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ request }) => {
  //   try {
  const body = await request.json();
  console.log('OpenAI Log:', body);

  let insert = {
    prompt: body.prompt,
    input: body.input,
    output: body.output,
  };

  const { data, error } = await supabase.from('prompt_logs').insert(insert).select();

  if (error) {
    throw error;
  }

  console.log('Inserted:', data);
  //   } catch {
  //   } finally {
  return new Response('OK', { status: 200 });
  //   }
}) satisfies RequestHandler;
