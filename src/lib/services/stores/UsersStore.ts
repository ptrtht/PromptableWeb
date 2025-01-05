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
        emailRedirectTo: new URL('/magiclink', CURRENT_URL.href).href,
      },
    });

    if (error) {
      // throw Errors.error(error);
    }
  }

  static async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw LoggingService.error('Error getting current user', error);
    return data.user;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw LoggingService.error('Error signing out', error);
    }
    if (browser) goto('/login');
  }
}
