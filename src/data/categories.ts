import type { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'phone_media',
    label: 'Phone/Media',
    emoji: '📱',
    description: 'Scrolling, consuming content',
    color: '#3B82F6',
  },
  {
    id: 'worries_negative',
    label: 'Worries/Negative',
    emoji: '💭',
    description: 'Anxious or negative thoughts',
    color: '#EF4444',
  },
  {
    id: 'work_study',
    label: 'Work/Study',
    emoji: '📚',
    description: 'Thesis, medical school tasks',
    color: '#10B981',
  },
  {
    id: 'people_relationships',
    label: 'People/Relationships',
    emoji: '👥',
    description: 'Thinking about someone',
    color: '#F59E0B',
  },
  {
    id: 'planning_future',
    label: 'Planning/Future',
    emoji: '🎯',
    description: 'Goals, to-dos, what\'s next',
    color: '#8B5CF6',
  },
  {
    id: 'past_memories',
    label: 'Past/Memories',
    emoji: '🔄',
    description: 'Replaying events, nostalgia',
    color: '#EC4899',
  },
  {
    id: 'body_present_moment',
    label: 'Body/Present',
    emoji: '🧘',
    description: 'Sensations, breathing, awareness',
    color: '#14B8A6',
  },
  {
    id: 'observing_neutral',
    label: 'Observing/Neutral',
    emoji: '🌍',
    description: 'Just noticing, no focus',
    color: '#6B7280',
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id);
}
