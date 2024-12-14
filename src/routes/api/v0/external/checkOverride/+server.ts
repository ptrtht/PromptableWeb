import { supabase } from '$lib/services/init';
import type { RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ request }) => {
  //   try {
  const body = await request.json();
  console.log('OpenAI Log:', body);

  //  remove whitespace
  let input = body.input;

  return new Response(JSON.stringify({ input }), { status: 200 });
}) satisfies RequestHandler;
