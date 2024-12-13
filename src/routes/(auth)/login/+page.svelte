<script lang="ts">
  import { Users } from '$lib/services/Users';

  let email = $state<string>('');

  // regex matching email
  let emailValid = $derived(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email));
  let showEmailError = $derived(email.length > 5 && !emailValid);

  let emailSent: 'none' | 'loading' | 'success' | 'error' = $state('none');

  async function handleLogin() {
    if (emailValid) {
      try {
        emailSent = 'loading';
        await Users.sendMagicLink(email);
        emailSent = 'success';
      } catch (error) {
        emailSent = 'error';
      }
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center">
  <div class="card card-body bg-base-300 max-w-md gap-5">
    <div class="card-title">Log in / Register</div>
    {#if emailSent === 'none'}
      <label class="form-control w-full max-w-xs">
        <input
          type="text"
          class={'input input-bordered ' + (showEmailError ? 'input-error' : 'input-primary')}
          bind:value={email}
          placeholder="me@organisation.com"
        />
        <div class="label">
          {#if showEmailError}
            <span class="label-text-alt text-error">Please enter a valid email</span>
          {/if}
        </div>
      </label>
      <div class="self-end">
        <button class="btn btn-primary" onclick={handleLogin}>Continue</button>
      </div>
    {:else if emailSent === 'loading'}
      <span class="loading loading-ring self-center"></span>
    {:else if emailSent === 'success'}
      <div class="underline decoration-2 decoration-success">Email sent. Check your inbox.</div>
    {:else if emailSent === 'error'}
      <div class="underline decoration-2 decoration-error">Error sending email. Please try again.</div>
    {/if}
  </div>
</div>
