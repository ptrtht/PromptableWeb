import { Errors } from './Errors';
import { supabase } from './init';
import { Users } from './Users';

export class ApiKeys {
  static async getKeys() {
    const user = await Users.getCurrentUser();
    if (!user) throw Errors.error('User not found');

    const { data, error } = await supabase.from('api_keys').select().eq('user_id', user.id);

    if (error) throw Errors.error(error);

    return data || [];
  }

  static async createKey(name: string) {
    const user = await Users.getCurrentUser();
    if (!user) throw Errors.error('User not found');

    const { error } = await supabase.from('api_keys').insert({
      name,
      user_id: user.id,
    });

    if (error) throw Errors.error(error);
  }
}
