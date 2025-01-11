import { LoggingService } from '../pipeline/LoggingService';
import { Tables } from '../utils/init';
import { supaAdmin } from '../utils/init.server';

export class PipelineRunsServerStore {
  static async addPipelineRun(pipelineRun: Tables['pipeline_runs']['Insert']) {
    const { data, error } = await supaAdmin.from('pipeline_runs').insert([pipelineRun]);

    if (error) throw LoggingService.error('Error adding pipeline run', error);

    LoggingService.debug('Pipeline run added', data);

    return data;
  }
}
