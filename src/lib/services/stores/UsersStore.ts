import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { LoggingService } from '../pipeline/LoggingService';
import { CURRENT_URL, supabase } from '../util/init';

export class UsersStore {
  static async sendMagicLink(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: new URL('/callback', CURRENT_URL.href).href,
      },
    });

    if (error) {
      // throw Errors.error(error);
    }
  }

  static async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: new URL('/callback', CURRENT_URL.href).href,
      },
    });

    if (error) {
      throw LoggingService.error('Error signing in with Google', error);
    }

    return data;
  }

  static async signInWithGithub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: new URL('/callback', CURRENT_URL.href).href,
      },
    });

    if (error) {
      throw LoggingService.error('Error signing in with Github', error);
    }

    return data;
  }

  static async signInWithEmailPassword({ email, password }: { email: string; password: string }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw LoggingService.error('Error signing in with email and password', error);
    }

    if (browser) goto('/callback');
  }

  static async signUpWithEmailPassword({ email, password }: { email: string; password: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {},
    });

    if (error) {
      throw LoggingService.error('Error signing up with email and password', error);
    }

    await this.signInWithEmailPassword({ email, password });
  }

  static async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw LoggingService.error('Error getting current user', error);
    return data.user;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      goto('/login');
      throw LoggingService.error('Error signing out', error);
    }
    if (browser) goto('/login');
  }
}
