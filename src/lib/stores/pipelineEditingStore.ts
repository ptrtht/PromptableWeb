import { LoggingService } from '$lib/services/pipeline/LoggingService';
import type { PipelineConfigJson } from '$lib/services/schemas/PipelineConfig';
import { PipelineStore } from '$lib/services/stores/PipelineStore';
import throttle from 'lodash/throttle';
import { writable } from 'svelte/store';

export const pipelineEditingStore = writable<{ id: string; pipeline: PipelineConfigJson } | null>(null);

// on update, save to db.
pipelineEditingStore.subscribe((value) => {
  if (!value) return;
  LoggingService.debug('Pipeline store update triggered');

  //? make the vars "safe" -> instead of null values for optional fields, we want to remove them
  // Input
  if (value.pipeline.input.name === null || value.pipeline.input.name === undefined)
    delete value.pipeline.input.name;

  // nodes
  Object.entries(value.pipeline.nodes).forEach(([key, node]) => {
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

  // reassign the pipeline
  // pipelineEditingStore.set(value);

  throttledSave(value.id, value.pipeline);
});

const throttledSave = throttle(
  async (id: string, pipeline: PipelineConfigJson) => {
    LoggingService.debug('Saving pipeline', {
      id,
      pipeline,
    });
    await PipelineStore.updatePipelineJson(id, pipeline);
    LoggingService.debug('Pipeline saved');
  },
  1000,
  { leading: true, trailing: true }
);
