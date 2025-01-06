import { LoggingService } from '../pipeline/LoggingService';
import { supabase } from '../utils/init';
import { UsersStore } from './UsersStore';

export class PromptLogsStore {
  static async getLogs() {
    const user = await UsersStore.getCurrentUser();
    if (!user) throw LoggingService.error('User not found');

    const { data, error } = await supabase.from('prompt_logs').select('*').eq('user_id', user.id);

    if (error) throw LoggingService.error('Error getting prompt logs', error);

    return data;
  }
}
