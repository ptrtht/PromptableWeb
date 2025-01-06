import { PRIAVTE_NOTION_API_KEY } from '$env/static/private';
import { LoggingService } from '$lib/services/pipeline/LoggingService';
import { notion } from '$lib/services/utils/init.server';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

export const POST = (async ({ request, params }) => {
  try {
    const incomingBody = await request.json();

    // validadte body
    const bodyValidator = z.object({
      feedback: z.string(),
      user: z.object({
        id: z.string(),
        email: z.string(),
        name: z.string(),
      }),
    });

    const body = bodyValidator.parse(incomingBody);

    const response = await notion.pages.create({
      parent: { database_id: '17309dfa54ac802cb250ea2a659d9986' },
      icon: { emoji: '🥬' },
      properties: {
        Feedback: {
          title: [
            {
              text: { content: `Feedback from ${body.user.name}` },
            },
          ],
        },
        From: {
          email: body.user.email,
        },
      },
      children: [
        {
          object: 'block',
          type: 'code',
          code: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: body.feedback,
                },
              },
            ],
            language: 'plain text', // Required field for code blocks
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: `User ID: ${body.user.id}`,
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: `User Email: ${body.user.email}`,
                },
              },
            ],
          },
        },
      ],
    });

    LoggingService.debug('Notion response', response);

    return Response.json(response, { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}) satisfies RequestHandler;
