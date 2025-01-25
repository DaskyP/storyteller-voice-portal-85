
interface AudioPlayerProps {
  title: string;
  isPlaying: boolean;
}

const AudioPlayer = ({ 
  title, 
}: AudioPlayerProps) => {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg"
      role="region"
      aria-label="Reproductor de audio"
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold truncate flex-1" tabIndex={0}>
            {title}
          </h3>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              aria-label="Cuento anterior"
            >
              <SkipBack className="w-6 h-6" />
            </Button>

            <Button
              className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700"
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;