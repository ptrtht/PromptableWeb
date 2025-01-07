import { Users } from 'lucide-svelte';
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
    const { error } = await supabase
      .from('virtual_keys')
      .update({ key: params.key })
      .eq('provider', params.provider)
    //   .eq('user_id', auth.user().id);

    if (error) {
      throw new Error('Error setting virtual key');
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
}
