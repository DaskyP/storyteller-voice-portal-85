import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoryCardProps {
  title: string;
  description: string;
  duration: string;
  onPlay: () => void;
}

const StoryCard = ({ title, description, duration, onPlay }: StoryCardProps) => {
  return (
    <div 
      className="bg-story-background border border-story-border rounded-lg p-6 hover:bg-story-hover transition-colors"
      role="article"
      aria-label={`Cuento: ${title}`}
    >
      <h2 className="text-2xl font-bold mb-2" tabIndex={0}>{title}</h2>
      <p className="text-lg mb-4 text-gray-600" tabIndex={0}>{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-gray-500" tabIndex={0}>Duración: {duration}</span>
        <Button
          onClick={onPlay}
          className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg flex items-center gap-2"
          aria-label={`Reproducir cuento: ${title}`}
        >
          <Play className="w-5 h-5" />
          <span>Reproducir</span>
        </Button>
      </div>
    </div>
  );
};

export default StoryCard;