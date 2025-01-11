import { LoggingService } from '../pipeline/LoggingService';
import { supaAdmin } from '../utils/init.server';
import { VirtualKeyStore } from './VirtualKeyStore';

export class VirtualKeyServerStore extends VirtualKeyStore {
  // we overwrite tihs since no user, no login, so supa client doesnt work due to RLS

  static async getKey({
    virtualKeyId,
  }: {
    virtualKeyId: string;
  }) {

    const { data, error } = await supaAdmin.from('virtual_keys').select('*').eq('id', virtualKeyId);

    // try log all keys
    // const { data: allKeys, error: allKeysError } = await supaAdmin.from('virtual_keys').select('*');
    // LoggingService.info('All virtual keys', {allKeys, allKeysError});

    if (error || !data || data.length === 0) {
      throw LoggingService.error('Error getting virtual key', {error, virtualKeyId});
    }

    return data[0];
  }
}
