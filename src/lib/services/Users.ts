import { Errors } from './Errors';
import { supabase } from './init';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

export class Users {
  static async sendMagicLink(email: string, currentUrl: URL) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: new URL('/magiclink', currentUrl.href).href,
      },
    });

    if (error) {
      throw Errors.error(error);
    }
  }

  static async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) Errors.warn(error);
    return data.user;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw Errors.error(error);
    }
    if (browser) goto('/login');
  }
}
