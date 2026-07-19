import power from './power';

// Registry of topic content modules. Add a topic = import + add here.
export const topicModules = { power };
export function getTopic(id) {
  return topicModules[id] || null;
}
