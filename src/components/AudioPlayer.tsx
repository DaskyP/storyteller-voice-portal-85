
interface AudioPlayerProps {
  title: string;
  isPlaying: boolean;
}

const AudioPlayer = ({ 
  title, 
}: AudioPlayerProps) => {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-blue-400 p-4 shadow-lg"
      role="region"
      aria-label="Reproductor de audio"
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-6">
          <h3 className="text-2xl text-gray-100 font-semibold truncate flex-1" tabIndex={0}>
            {title}
          </h3>
          
          <div className="flex items-center gap-4">
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;