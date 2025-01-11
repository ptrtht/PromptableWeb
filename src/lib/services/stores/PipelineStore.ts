import { LoggingService } from '../pipeline/LoggingService';
import type { PipelineConfig, PipelineConfigJson } from '../schemas/PipelineConfig';
import { supabase, Views, type Tables } from '../utils/init';
import { UsersStore } from './UsersStore';

export class PipelineStore {
  static async getPipeline(id: string): Promise<Tables['pipelines']['Row']> {
    const { data, error } = await supabase.from('pipelines').select().eq('id', id).single();
    if (error) {
      throw LoggingService.error('Error getting pipeline', error);
    }
    return data;
  }

  static async getPipelines(): Promise<Tables['pipelines']['Row'][]> {
    const { data, error } = await supabase.from('pipelines').select('*');
    if (error) {
      throw LoggingService.error('Error getting pipelines', error);
    }
    return data as Tables['pipelines']['Row'][];
  }

  static async getPipelinesWithStats(): Promise<Views['v_pipeline_stats_total']['Row'][]> {
    const user = await UsersStore.getCurrentUser();

    // ? There is no RLS on this view need to manually filter for users.
    const { data, error } = await supabase.from('v_pipeline_stats_total').select('*').eq('user_id', user.id);
    if (error) {
      throw LoggingService.error('Error getting pipelines with stats', error);
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
