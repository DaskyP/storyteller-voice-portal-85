import React, { useState, useEffect } from 'react';
import StoryList from '@/components/StoryList';
import AudioPlayer from '@/components/AudioPlayer';
import { useConversation } from '@11labs/react';
import { Button } from '@/components/ui/button';
import { StoryCategory, Story } from '../types/Story';
import { Mic } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory | undefined>();
  const [volume, setVolume] = useState(1);
  const conversation = useConversation();
  const { toast } = useToast();

  const handlePlayStory = async (story: Story) => {
    setCurrentStory(story);
    setIsPlaying(true);
    
    try {
      await conversation.startSession({
        agentId: "YOUR_AGENT_ID", // Necesitarás crear un agente en ElevenLabs
      });
      
      // Iniciar la narración del cuento
      conversation.setVolume({ volume });
    } catch (error) {
      console.error("Error al iniciar la narración:", error);
      toast({
        title: "Error",
        description: "No se pudo iniciar la narración. Por favor, intente nuevamente.",
        variant: "destructive"
      });
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!currentStory) return;
    
    const stories = document.querySelectorAll('[role="article"]');
    const currentIndex = Array.from(stories).findIndex(
      story => story.getAttribute('aria-label')?.includes(currentStory.title)
    );
    
    if (currentIndex < stories.length - 1) {
      const nextStory = stories[currentIndex + 1];
      nextStory.querySelector('button')?.click();
    }
  };

  const handlePrevious = () => {
    if (!currentStory) return;
    
    const stories = document.querySelectorAll('[role="article"]');
    const currentIndex = Array.from(stories).findIndex(
      story => story.getAttribute('aria-label')?.includes(currentStory.title)
    );
    
    if (currentIndex > 0) {
      const previousStory = stories[currentIndex - 1];
      previousStory.querySelector('button')?.click();
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0] / 100;
    setVolume(volumeValue);
    if (conversation) {
      conversation.setVolume({ volume: volumeValue });
    }
  };

  const startVoiceControl = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: "YOUR_AGENT_ID", // Necesitarás crear un agente en ElevenLabs
      });
      
      toast({
        title: "Control por voz activado",
        description: "Puede usar comandos de voz para controlar la reproducción.",
      });
    } catch (error) {
      console.error("Error al iniciar el control por voz:", error);
      toast({
        title: "Error",
        description: "No se pudo activar el control por voz. Por favor, verifique los permisos del micrófono.",
        variant: "destructive"
      });
    }
  };

  const categories: { id: StoryCategory; name: string }[] = [
    { id: 'sleep', name: 'Para Dormir' },
    { id: 'fun', name: 'Diversión' },
    { id: 'educational', name: 'Educativos' },
    { id: 'adventure', name: 'Aventuras' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" tabIndex={0}>
            Cuentacuentos Accesible
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8" tabIndex={0}>
            Disfruta de hermosas historias narradas especialmente para personas con discapacidad visual
          </p>
          <Button
            onClick={startVoiceControl}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
          >
            <Mic className="w-5 h-5" />
            Activar Control por Voz
          </Button>
        </header>

        <div className="mb-8 flex gap-4 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`bg-green-600 hover:bg-green-700 text-white ${
                selectedCategory === category.id ? 'ring-2 ring-green-400' : ''
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>

        <section 
          aria-label="Lista de cuentos disponibles"
          className="mb-24"
        >
          <StoryList 
            selectedCategory={selectedCategory}
            onPlayStory={handlePlayStory}
          />
        </section>

        {currentStory && (
          <AudioPlayer
            title={currentStory.title}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onVolumeChange={handleVolumeChange}
          />
        )}
      </main>
    </div>
  );
};

export default Index;