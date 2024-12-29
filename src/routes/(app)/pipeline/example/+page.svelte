<script lang="ts">
  import { ApiNode } from '$lib/services/pipeline/ApiNode';
  import { OpenAINode } from '$lib/services/pipeline/OpenAINode';
  import { Pipeline } from '$lib/services/pipeline/Pipeline';

  const test = async () => {
    const pipeline = new Pipeline();

    // First node gets a joke
    const getJokeNode = new ApiNode({ id: 'get-joke' });
    getJokeNode.inputs = {
      url: 'https://icanhazdadjoke.com/',
      method: 'GET',
      headers: { Accept: 'application/json' },
    };

    // OpenAI node to enhance the joke
    const enhanceJokeNode = new OpenAINode({ id: 'enhance-joke' });
    enhanceJokeNode.inputs = {
      model: 'gpt-3.5-turbo',
      prompt: 'Make this joke more funny: {{get-joke.response.joke}}',
      temperature: 0.8,
    };

    // Post the enhanced joke
    const postNode = new ApiNode({ id: 'post-joke' });
    postNode.inputs = {
      url: 'https://6769a8f7863eaa5ac0dc5785.mockapi.io/save',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        originalJoke: '{{get-joke.response.joke}}',
        enhancedJoke: '{{enhance-joke.completion}}',
      },
    };

    pipeline.addNode(getJokeNode);
    pipeline.addNode(enhanceJokeNode);
    pipeline.addNode(postNode);

    const results = await pipeline.execute('post-joke');

    console.log('Results:', results);
  };
</script>

<button onclick={test}> TEST </button>
