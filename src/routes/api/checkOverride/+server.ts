import { supabase } from '$lib/services/init';
import type { RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ request }) => {
  //   try {
  const body = await request.json();
  console.log('OpenAI Log:', body);

  //  remove whitespace
  let prompt = body.prompt.trim();

  // check if prompt is in the db
  const { data, error } = await supabase.from('prompt_overrides').select().eq('original_prompt', prompt);

  console.log('prompt: ', prompt);

  console.log('Data:', data);

  if (error) {
    throw error;
  }

  if (data.length > 0) {
    const override = data[0].override;
    console.log('Overriding prompt:', override);
    return Response.json(
      {
        override,
      },
      { status: 200 }
    );
  }

  //   else add this prompt to the db
  const insert = {
    original_prompt: prompt,
    override: null,
  };

  const { data: insertData, error: insertError } = await supabase.from('prompt_overrides').insert(insert).select();

  if (insertError) {
    throw insertError;
  }

  return Response.json(
    {
      override: false,
    },
    { status: 200 }
  );
  //   }
}) satisfies RequestHandler;
