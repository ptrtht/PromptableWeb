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

  static async revokeKey(id: number) {
    const user = await UsersStore.getCurrentUser();
    if (!user) throw LoggingService.error('User not found');

    const { error } = await supabase.from('api_keys').update({ status: 'revoked' }).eq('id', id);

    if (error) throw LoggingService.error('Error revoking API key', error);
  }

  static async restoreKey(id: number) {
    const user = await UsersStore.getCurrentUser();
    if (!user) throw LoggingService.error('User not found');

    const { error } = await supabase.from('api_keys').update({ status: 'active' }).eq('id', id);

    if (error) throw LoggingService.error('Error restoring API key', error);
  }

  static async deleteKey(id: number) {
    const user = await UsersStore.getCurrentUser();
    if (!user) throw LoggingService.error('User not found');

    const { error } = await supabase.from('api_keys').update({ status: 'deleted' }).eq('id', id);

    if (error) throw LoggingService.error('Error deleting API key', error);
  }
}
