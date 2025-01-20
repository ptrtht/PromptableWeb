import { LoggingService } from '../pipeline/LoggingService';
import { supabase } from '../utils/init';
import { UsersStore } from './UsersStore';

export class VirtualKeyStore {
  static async getKeyForProvider(params: { provider: string }) {
    const { data, error } = await supabase.from('virtual_keys').select().eq('provider', params.provider).single();
    // ^ we don't need to filter for user_id here because Supabse RLS will do that for us.

    if (error) {
      throw new Error('Error getting virtual key');
    }

    return data;
  }

  static async setKeyForProvider(params: { provider: string; key: string }) {
    try {
      // first we need to check if the key already exists
      await VirtualKeyStore.getKeyForProvider({ provider: params.provider });

      // if that doesn't throw an error, we can update the key
      const { error } = await supabase.from('virtual_keys').update({ key: params.key }).eq('provider', params.provider);
    } catch (error) {
      // if the key doesn't exist, we need to create it
      await this.createVirtualKey({ provider: params.provider, key: params.key });
    }
  }

  static async getCustomProviders() {
    const { data, error } = await supabase.from('v_orphaned_virtual_keys').select();

    if (error) {
      throw new Error('Error getting custom providers');
    }

    return data;
  }

  static async revokeKeyForProvider(params: { provider: string }) {
    // We don't need to filter for user_id here because Supabse RLS will do that for us.
    const { error } = await supabase.from('virtual_keys').update({ status: 'revoked' }).eq('provider', params.provider);

    if (error) {
      throw new Error('Error revoking virtual key');
    }
  }

  static async restoreKeyForProvider(params: { provider: string }) {
    // We don't need to filter for user_id here because Supabse RLS will do that for us.
    const { error } = await supabase.from('virtual_keys').update({ status: 'active' }).eq('provider', params.provider);

    if (error) {
      throw new Error('Error restoring virtual key');
    }
  }

  static async createVirtualKey(params: { provider: string; key: string }) {
    // name: string
    // key: string
    // provider: string
    // user_id: string
    const user = await UsersStore.getCurrentUser();

    const { error } = await supabase.from('virtual_keys').insert({
      name: `Custom ${params.provider}`,
      key: params.key,
      provider: params.provider,
      user_id: user.id,
    });

    if (error) {
      throw LoggingService.error('Error creating virtual key', error);
    }
  }
}
