import { writable } from 'svelte/store';
import { Pipeline } from './pipeline/Pipeline';

export const pipelineEditing = writable(new Pipeline());
