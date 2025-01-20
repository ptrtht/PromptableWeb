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

    const purged = PipelineStore.purgePipeline(data.pipeline as PipelineConfigJson);

    return {
      ...data,
      pipeline: purged,
    };
  }

  static async getPipelineDraft(id: string) {
    // get the pipeline data
    const { data: selectData, error: selectError } = await supabase.from('pipelines').select().eq('id', id).single();

    if (!selectData || selectError) throw LoggingService.error('Error getting pipeline', selectError);

    // try selecting from pipeline drafts
    const { data, error } = await supabase
      .from('pipeline_drafts')
      .select()
      .eq('pipeline_id', id)
      .eq('version', selectData.version);

    // if there is one, return it
    if (!error && data && data.length !== 0) {
      const p = data[0];
      const purged = PipelineStore.purgePipeline(p.pipeline as PipelineConfigJson);

      return {
        ...p,
        pipeline: purged,
      };
    }

    // if there is none found, create a new draft
    const { data: insertData, error: insertError } = await supabase
      .from('pipeline_drafts')
      .insert({
        pipeline_id: id,
        version: selectData.version,
        pipeline: selectData.pipeline,
      })
      .select();

    if (insertError || !insertData || insertData.length === 0)
      throw LoggingService.error('Error creating pipeline draft', insertError);

    const p = insertData[0];

    const purged = PipelineStore.purgePipeline(p.pipeline as PipelineConfigJson);

    return {
      ...p,
      pipeline: purged,
    };
  }

  static async publishPipeline(id: string) {
    // get the draft pipeline:
    const draft = await PipelineStore.getPipelineDraft(id);

    // bump the version
    draft.version += 1;

    // update the pipeline with the draft
    const updated = await PipelineStore.updatePipelineJson(id, draft.pipeline);

    //  keep the draft, for rollback purposes
  }

  static async checkStatus(id: string) {
    // compare if the pipeline and the draft are the same
    const pipeline = await PipelineStore.getPipeline(id);
    const draft = await PipelineStore.getPipelineDraft(id);

    return JSON.stringify(pipeline.pipeline) === JSON.stringify(draft.pipeline);
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

  static async getPipelinesWithWeeklyStats(): Promise<Views['v_pipeline_stats_weekly']['Row'][]> {
    const user = await UsersStore.getCurrentUser();

    // ? There is no RLS on this view need to manually filter for users.
    const { data, error } = await supabase.from('v_pipeline_stats_weekly').select('*').eq('user_id', user.id);
    if (error) {
      throw LoggingService.error('Error getting pipelines with weekly stats', error);
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

  static async updatePipelineDraftJson(id: string, pipeline: PipelineConfig['pipeline']) {
    const { data, error } = await supabase
      .from('pipeline_drafts')
      .update({ pipeline })
      .eq('pipeline_id', id)
      .select('*');
    if (error || !data) {
      throw LoggingService.error('Error updating pipeline draft', error);
    }
    return data;
  }

  static purgePipeline(pipeline: PipelineConfigJson): PipelineConfigJson {
    //? make the vars "safe" -> instead of null values for optional fields, we want to remove them
    // Input
    if (pipeline.input.name === null || pipeline.input.name === undefined) delete pipeline.input.name;

    // nodes
    Object.entries(pipeline.nodes).forEach(([key, node]) => {
      // for text values, if empty, remove them
      if (!node.name) delete node.name;

      // nodes -> LLMNode
      if (node.type === 'llm') {
        // for number values we have to check explicitly
        if (node.config.frequency_penalty === null || node.config.frequency_penalty === undefined)
          delete node.config.frequency_penalty;

        if (node.config.max_tokens === null || node.config.max_tokens === undefined) delete node.config.max_tokens;

        if (node.config.presence_penalty === null || node.config.presence_penalty === undefined)
          delete node.config.presence_penalty;

        // for arrays we have to check if they are empty
        if (
          node.config.stop_sequences === null ||
          node.config.stop_sequences === undefined ||
          node.config.stop_sequences.length === 0
        )
          delete node.config.stop_sequences;

        if (!node.config.system) delete node.config.system;

        if (node.config.temperature === null || node.config.temperature === undefined) delete node.config.temperature;

        if (node.config.top_k === null || node.config.top_k === undefined) delete node.config.top_k;

        if (node.config.top_p === null || node.config.top_p === undefined) delete node.config.top_p;
      }

      // nodes -> apiNode
      if (node.type === 'api_call') {
        if (!node.config.body) delete node.config.body;
        if (!node.config.formData) delete node.config.formData;
        if (!node.config.formUrlEncoded) delete node.config.formUrlEncoded;
        if (!node.config.headers) delete node.config.headers;
        if (!node.config.queryParams) delete node.config.queryParams;
      }
    });

    return pipeline;
  }
}
