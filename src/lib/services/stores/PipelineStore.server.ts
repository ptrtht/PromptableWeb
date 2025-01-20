import { LoggingService } from '../pipeline/LoggingService';
import { PipelineConfig, PipelineConfigJson } from '../schemas/PipelineConfig';
import { type Database } from '../schemas/supabase.types';
import { Tables } from '../utils/init';
import { supaAdmin } from '../utils/init.server';
import { PipelineStore } from './PipelineStore';

export class PipelineServerStore {
  static async getPipeline(id: string) {
    const { data, error } = await supaAdmin.from('pipelines').select().eq('id', id);

    if (error) throw LoggingService.error('Error getting pipeline', error);

    const result = data[0] as PipelineConfig;

    LoggingService.debug('PipelineServerStore.getPipeline', result);

    return result;
  }

  static async getPipelineDraft(id: string): Promise<Tables['pipeline_drafts']['Row']> {
    const { data, error } = await supaAdmin.from('pipeline_drafts').select().eq('pipeline_id', id);

    if (error) throw LoggingService.error('Error getting pipeline', error);

    const result = data[0];

    LoggingService.debug('PipelineServerStore.getPipeline', result);

    return result;
  }

  static async getPipelineWithStats(id: string) {}
}
