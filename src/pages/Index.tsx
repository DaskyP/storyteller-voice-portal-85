import React, { useState } from 'react';
import StoryList from '@/components/StoryList';
import AudioPlayer from '@/components/AudioPlayer';

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStory, setCurrentStory] = useState("El Principito");

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    console.log("Siguiente historia");
  };

  const handlePrevious = () => {
    console.log("Historia anterior");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" tabIndex={0}>
            Cuentacuentos Accesible
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" tabIndex={0}>
            Disfruta de hermosas historias narradas especialmente para personas con discapacidad visual
          </p>
        </header>

        <section 
          aria-label="Lista de cuentos disponibles"
          className="mb-24"
        >
          <StoryList />
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