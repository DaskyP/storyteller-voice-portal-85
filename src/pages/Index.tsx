import React, { useState } from 'react';
import StoryList from '@/components/StoryList';
import AudioPlayer from '@/components/AudioPlayer';
import { useConversation } from '@11labs/react';
import { Button } from '@/components/ui/button';
import { StoryCategory } from '../types/Story';
import { Mic } from 'lucide-react';

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStory, setCurrentStory] = useState("El Principito");
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory | undefined>();
  const conversation = useConversation();

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    console.log("Siguiente historia");
  };

  const handlePrevious = () => {
    console.log("Historia anterior");
  };

  const startVoiceControl = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: "YOUR_AGENT_ID", // Necesitarás crear un agente en ElevenLabs
      });
    } catch (error) {
      console.error("Error al iniciar el control por voz:", error);
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
          <StoryList selectedCategory={selectedCategory} />
        </section>

        <AudioPlayer
          title={currentStory}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </main>
    </div>
  );
};

export default Index;