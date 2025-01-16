export type StoryCategory = 'sleep' | 'fun' | 'educational' | 'adventure';

export interface Story {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: StoryCategory;
  content: string;
  audioUrl?: string;
}