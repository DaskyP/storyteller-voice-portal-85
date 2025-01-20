import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  title: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (value: number[]) => void;
}

const AudioPlayer = ({ 
  title, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious,
  onVolumeChange 
}: AudioPlayerProps) => {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-story-background border-t border-story-border p-4 shadow-lg"
      role="region"
      aria-label="Reproductor de audio"
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold truncate flex-1 text-white" tabIndex={0}>
            {title}
          </h3>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              aria-label="Cuento anterior"
              className="text-gray-300 hover:text-white"
            >
              <SkipBack className="w-6 h-6" />
            </Button>

            <Button
              className="w-12 h-12 rounded-full bg-primary hover:bg-primary-hover"
              onClick={onPlayPause}
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              aria-label="Siguiente cuento"
              className="text-gray-300 hover:text-white"
            >
              <SkipForward className="w-6 h-6" />
            </Button>

            <div className="w-32">
              <Slider
                defaultValue={[100]}
                max={100}
                step={1}
                onValueChange={onVolumeChange}
                aria-label="Control de volumen"
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;