import type { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'acknowledgement',
    label: 'Acknowledgement',
    emoji: '',
    description: 'Wanting to be seen, recognized, appreciated',
    color: '#F59E0B',
  },
  {
    id: 'desires',
    label: 'Desires',
    emoji: '',
    description: 'Wanting, craving, longing for something',
    color: '#EF4444',
  },
  {
    id: 'significance',
    label: 'Significance',
    emoji: '',
    description: 'Wanting to matter, make an impact',
    color: '#8B5CF6',
  },
  {
    id: 'resistances',
    label: 'Resistances',
    emoji: '',
    description: 'Pushing against, avoidance, not wanting',
    color: '#64748B',
  },
  {
    id: 'control',
    label: 'Control',
    emoji: '',
    description: 'Wanting to manage outcomes, have certainty',
    color: '#3B82F6',
  },
  {
    id: 'safety_security',
    label: 'Safety/Security',
    emoji: '',
    description: 'Concern about stability, protection',
    color: '#10B981',
  },
  {
    id: 'connection',
    label: 'Connection',
    emoji: '',
    description: 'Longing for closeness, belonging, intimacy',
    color: '#EC4899',
  },
  {
    id: 'achievement',
    label: 'Achievement',
    emoji: '',
    description: 'Focus on accomplishment, progress, success',
    color: '#14B8A6',
  },
  {
    id: 'pleasure',
    label: 'Pleasure',
    emoji: '',
    description: 'Seeking comfort, enjoyment, gratification',
    color: '#F97316',
  },
  {
    id: 'identity',
    label: 'Identity',
    emoji: '',
    description: 'Thinking about who you are, self-image',
    color: '#6366F1',
  },
  {
    id: 'judgment',
    label: 'Judgment',
    emoji: '',
    description: 'Evaluating self or others, comparing',
    color: '#78716C',
  },
  {
    id: 'exhaustion',
    label: 'Exhaustion',
    emoji: '',
    description: 'Just tired, drained, low energy',
    color: '#94A3B8',
  },
  {
    id: 'emptiness',
    label: 'Emptiness',
    emoji: '',
    description: 'Feeling empty, pit in the stomach',
    color: '#475569',
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id);
}
