import { LoggingService } from '$lib/services/pipeline/LoggingService';
import type { PipelineConfigJson } from '$lib/services/schemas/PipelineConfig';
import { PipelineStore } from '$lib/services/stores/PipelineStore';
import throttle from 'lodash/throttle';
import { writable } from 'svelte/store';

export type PipelineEditingStoreType = { id: string; pipeline: PipelineConfigJson; version: number } | null;

export const pipelineEditingStore = writable<PipelineEditingStoreType>(null);


export const updateCount = writable<number>(0);

// on update, save to db.
pipelineEditingStore.subscribe((value) => {
  if (!value) return;
  updateCount.update((n) => n + 1);
  LoggingService.debug('Pipeline store update triggered');

  value.pipeline = PipelineStore.purgePipeline(value.pipeline);

  // reassign the pipeline
  // pipelineEditingStore.set(value);

  throttledFn(value);
});

const throttledFn = throttle(
  async (value: PipelineEditingStoreType) => {
    if (!value) return;

    // // add to commands
    // slashCommandsStore.update((commands) => {
    //   // start blank:
    //   commands = [];

    //   // each node should be a command, to get the node ID.
    //   // if the command already exists, update it

    //   // each property of the nodes should be a command as well in the form of "nodeId.property"
    //   // the commands should be in order of the nodes in the pipeline

    //   // get the node IDs
    //   const nodeIds = value.pipeline.executionOrder;

    //   // add the node commands
    //   nodeIds.forEach((nodeId) => {
    //     const node = value.pipeline.nodes[nodeId];
    //     const command = {
    //       id: nodeId,
    //       label: node.name || 'Unnamed Node',
    //       icon: node.type === 'api_call' ? '⚡️' : '🔗',
    //       value: nodeId,
    //     };

    //     // add the node command
    //     commands.push(command);

    //     // add the property commands
    //     if (node.type === 'api_call')
    //       Object.keys(node.config).forEach((property) => {
    //         const propertyCommand = {
    //           id: `${nodeId}.${property}`,
    //           label: `${node.name || 'Unnamed Node' + '.' + property}`,
    //           icon: '🔧',
    //           value: `${nodeId}.${property}`,
    //         };

    //         // add the property command
    //         commands.push(propertyCommand);
    //       });
    //   });

    //   return commands;
    // });

    LoggingService.debug('Saving pipeline', {
      id: value.id,
      pipeline: value.pipeline,
    });
    await PipelineStore.updatePipelineDraftJson(value.id, value.pipeline);
    LoggingService.debug('Pipeline saved');
  },
  2500,
  { leading: true, trailing: true }
);
