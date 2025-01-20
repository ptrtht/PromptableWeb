import type { NodeState } from '$lib/services/pipeline/context/ExecutionContext';
import { get, writable } from 'svelte/store';
import { pipelineEditingStore } from './pipelineEditingStore';
import { toast } from 'svelte-sonner';
import { LoggingService } from '$lib/services/pipeline/LoggingService';

export const nodeExecutionsStore = writable<{
  // output here is either LLM or apinodeoutput
  [nodeId: string]: NodeState | undefined;
}>({});

nodeExecutionsStore.subscribe((value) => {
  LoggingService.debug('Node executions store updated', value);
});

export const nodeWebhookTriggerInputStore = writable<Record<string, any>>({});

export function getAllKeys(obj: Record<string, any>, prefix = ''): string[] {
  return Object.entries(obj).reduce((acc: string[], [key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return [...acc, ...getAllKeys(value, newKey)];
    }

    return [...acc, newKey];
  }, []);
}

export const executeNode = async (untilNodeId: string) => {
  // first get the state
  const initialState = get(nodeExecutionsStore);

  const env = 'Pipeline builder';

  // the pipeline schema should already be saved.

  const payload = {
    initialState,
    untilNodeId,
  };

  const pipelineId = get(pipelineEditingStore)?.id;

  if (!pipelineId) {
    toast.error('Pipeline ID not provided');
    throw new Error('Pipeline ID not provided');
  }

  const response = await fetch(`/api/v0/pipelines/webhook/${pipelineId}/draft?env=${encodeURIComponent(env)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    toast.error('Failed to execute pipeline');
    throw new Error('Failed to execute pipeline');
  }

  toast.success('Node executed');
  const data = await response.json();

  // update nodeExecutionsStore
  nodeExecutionsStore.update((store) => {
    const newState = { ...store };

    // update the state of all the nodes
    for (const [nodeId, nodeState] of Object.entries(data.executionData.state)) {
      newState[nodeId] = nodeState as any;
    }

    return newState;
  });

  return data;
};
