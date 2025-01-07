import { LoggingService } from '../pipeline/LoggingService';
import { supaAdmin } from '../utils/init.server';
import { VirtualKeyStore } from './VirtualKeyStore';

export class VirtualKeyServerStore extends VirtualKeyStore {
  static async getKey({
    user_id,
    virtualKeyId,
    provider,
  }: {
    user_id?: string;
    virtualKeyId: string;
    provider?: string;
  }) {
    let query = supaAdmin.from('virtual_keys').select('*').eq('id', virtualKeyId);

    if (user_id) {
      query = query.eq('user_id', user_id);
    }
    if (provider) {
      query = query.eq('provider', provider);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      throw LoggingService.error('Error getting virtual key', error);
    }

    return data[0];
  }
}
