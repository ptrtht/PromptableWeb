import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  return {
    pipeline: {
      id: params.pipelineId,
      name: `${params.pipelineId}`,
    },
  };
};
