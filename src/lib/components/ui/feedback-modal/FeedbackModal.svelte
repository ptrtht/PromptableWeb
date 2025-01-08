<script lang="ts">
  import type { Snippet } from 'svelte';
  import * as Dialog from '../dialog';
  import PromiseButton from '../promiseButton/PromiseButton.svelte';
  import { Send } from 'lucide-svelte';
  import H4 from '../text/H4.svelte';
  import { Textarea } from '../textarea';
  import { UsersStore } from '$lib/services/stores/UsersStore';
  import { toast } from 'svelte-sonner';
  import { LoggingService } from '$lib/services/pipeline/LoggingService';
  import { getUserFullName } from '$lib/utils/utils';

  const { children, ...props }: { children: Snippet } = $props();

  let feedback = $state('');
  let isOpen = $state(false);

  const handleFeedback = async () => {
    try {
      // send feedback
      const user = await UsersStore.getCurrentUser();

      LoggingService.debug('user.user_metadata', user.user_metadata);

      const payload = {
        feedback,
        user: {
          id: user.id,
          email: user.email,
          name: getUserFullName(user),
        },
      };

      const response = await fetch('/api/internal/addFeedbackToNotion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to send feedback');
      }

      toast.info('Feedback sent!');

      isOpen = false;
    } catch {
      toast.error('Failed to send feedback');
    }
  };
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Trigger {...props}>
    {@render children()}
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px] text-foreground">
    <Dialog.Header>
      <Dialog.Title>
        <H4>Quick Feedback</H4>
      </Dialog.Title>
      <Dialog.Description>This goes straight to the creators :)</Dialog.Description>
    </Dialog.Header>
    <Textarea placeholder="Your feedback goes here..." bind:value={feedback} />
    <Dialog.Footer>
      <div>
        <PromiseButton type="submit" promise={handleFeedback} class="min-w-24">
          <span class="flex gap-2 items-center justify-center">
            <span>Send</span>
            <Send />
          </span>
        </PromiseButton>
      </div>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
