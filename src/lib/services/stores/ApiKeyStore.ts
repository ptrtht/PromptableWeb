import { LoggingService } from '../pipeline/LoggingService';
import { supabase } from '../utils/init';
import { UsersStore } from './UsersStore';

export class ApiKeyStore {
  static async getKeys() {
    const user = await UsersStore.getCurrentUser();
    if (!user) throw LoggingService.error('User not found');

    const { data, error } = await supabase.from('api_keys').select().eq('user_id', user.id);

    if (error) throw LoggingService.error('Error getting API keys', error);

    return data || [];
  }

  static async createKey(name: string) {
    const user = await UsersStore.getCurrentUser();
    if (!user) throw LoggingService.error('User not found');

    const { error } = await supabase.from('api_keys').insert({
      name,
      user_id: user.id,
    });

    if (error) throw LoggingService.error('Error creating API key', error);
  }
}
