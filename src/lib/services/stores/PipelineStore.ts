import { LoggingService } from '../pipeline/LoggingService';
import type { PipelineConfig } from '../schemas/PipelineConfig';
import { supabase, type Tables } from '../utils/init';
import { UsersStore } from './UsersStore';

export class PipelineStore {
  static async getPipeline(id: string) {
    const { data, error } = await supabase.from('pipelines').select().eq('id', id).single();
    if (error) {
      throw LoggingService.error('Error getting pipeline', error);
    }
    return data;
  }

  static async createNewPipeline(): Promise<Tables['pipelines']['Row']> {
    const user = await UsersStore.getCurrentUser();

    const pipelinedata: PipelineConfig = {
      id: 'pipelnie_' + crypto.randomUUID(),
      name: 'New Pipeline',
      user_id: user.id,
      pipeline: {
        nodes: {},
        executionOrder: [],
        input: {
          type: 'webhook',
          validate: false,
          schema: {},
        },
      },
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
      version: 0,
    };

    const { data, error } = await supabase.from('pipelines').insert([pipelinedata]).select('*').single();
    if (error || !data) {
      throw LoggingService.error('Error creating pipeline', error);
    }
    return data;
  }

  static async updatePipeline(pipeline: Tables['pipelines']['Row']) {
    const { data, error } = await supabase.from('pipelines').upsert([pipeline]).select('*').single();
    if (error || !data) {
      throw LoggingService.error('Error updating pipeline', error);
    }
    return data;
  }

  static async updatePipelineJson(id: string, pipeline: PipelineConfig['pipeline']) {
    const { data, error } = await supabase
      .from('pipelines')
      .update({ pipeline, modified_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    if (error || !data) {
      throw LoggingService.error('Error updating pipeline', error);
    }
    return data;
  }
}
