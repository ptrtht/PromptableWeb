import { LoggingService } from '../pipeline/LoggingService';
import { supabase, Tables } from '../utils/init';

export class PipelineRunsStore {
  static async getPipelineRuns({
    pipelineId,
    page,
    limit = 20,
  }: {
    pipelineId: string;
    // page number starts from 1
    page: number;
    limit?: number;
  }): Promise<Tables['pipeline_runs']['Row'][]> {
    // paginate for every 50 results
    const { data, error } = await supabase
      .from('pipeline_runs')
      .select()
      .eq('pipeline_id', pipelineId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      throw LoggingService.error('Error getting pipeline runs', error);
    }

    return data;
  }

  static async getPipelineRunCount(pipelineId: string): Promise<number> {
    const { count, error } = await supabase
      .from('pipeline_runs')
      .select('id', { count: 'exact' })
      .eq('pipeline_id', pipelineId);

    if (error || !count) {
      throw LoggingService.error('Error getting pipeline run count', error);
    }

    return count;
  }
}
