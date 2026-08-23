import power from './power';
import tech from './tech';
import planet from './planet';
import people from './people';
import economy from './economy';

// Registry of topic content modules. Add a topic = import + add here; site.js
// derives `live` from this registry, so there is no second place to edit.
export const topicModules = { power, tech, planet, people, economy };

export function getTopic(id) {
  return topicModules[id] || null;
}
