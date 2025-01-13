import { LoggingService } from '../pipeline/LoggingService';
import { Tables } from '../utils/init';
import { supaAdmin } from '../utils/init.server';
import { VirtualKeyStore } from './VirtualKeyStore';

export class VirtualKeyServerStore extends VirtualKeyStore {
  // we overwrite tihs since no user, no login, so supa client doesnt work due to RLS

  static async getKey({ virtualKeyId }: { virtualKeyId: string }) {
    const { data, error } = await supaAdmin.from('virtual_keys').select('*').eq('id', virtualKeyId);

    // try log all keys
    // const { data: allKeys, error: allKeysError } = await supaAdmin.from('virtual_keys').select('*');
    // LoggingService.info('All virtual keys', {allKeys, allKeysError});

    if (error || !data || data.length === 0) {
      throw LoggingService.error('Error getting virtual key', { error, virtualKeyId });
    }

    return data[0];
  }

  static async getKeysForUser(params: { user_id: string }) {
    const { data, error } = await supaAdmin.from('virtual_keys').select('*').eq('user_id', params.user_id);

    if (error) {
      throw LoggingService.error('Error getting virtual keys for user', { error, params });
    }

    return data as Tables['virtual_keys']['Row'][];
  }
}
