import { LoggingService } from '../pipeline/LoggingService';
import { supaAdmin } from '../utils/init.server';
import { PipelineStore } from './PipelineStore';

export class PipelineServerStore extends PipelineStore {
  static async getPipeline(id: string) {
    const { data, error } = await supaAdmin.from('pipelines').select().eq('id', id);

    if (error) throw LoggingService.error('Error getting pipeline', error);

    const result = data[0];

    LoggingService.debug('PipelineServerStore.getPipeline', result);

    return result.pipeline;
  }
}
