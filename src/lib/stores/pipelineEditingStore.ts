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
  throttledSave(value.id, value.pipeline);
});

const throttledSave = throttle(
  async (id: string, pipeline: PipelineConfigJson) => {
    LoggingService.debug('Saving pipeline');
    await PipelineStore.updatePipelineJson(id, pipeline);
    LoggingService.debug('Pipeline saved');
  },
  1000,
  { leading: true, trailing: true }
);
