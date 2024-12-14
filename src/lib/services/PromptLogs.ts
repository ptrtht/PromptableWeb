import { Errors } from './Errors';
import { supabase } from './init';
import { Users } from './Users';

export class PromptLogs {
  static async getLogs() {
    const user = await Users.getCurrentUser();
    if (!user) throw Errors.error('User not found');

    const { data, error } = await supabase.from('prompt_logs').select('*').eq('user_id', user.id);

    if (error) throw Errors.error(error.message);

    return data;
  }
}
