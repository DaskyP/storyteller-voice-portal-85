import React, { useState, useEffect } from 'react';
import StoryList, { stories } from '@/components/StoryList';
import AudioPlayer from '@/components/AudioPlayer';
import { Button } from '@/components/ui/button';
import { StoryCategory } from '../types/Story';
import { Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNarration } from '@/hooks/useNarration';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast';

const Index = () => {
  const {
    isPlaying,
    storyFinished,
    currentStory,
    handlePlayStory,
    handlePlayPause,
    handlePause,
    cancelNarration,
    setNarrationVolume,
    isPaused
  } = useNarration();

  const [selectedCategory, setSelectedCategory] = useState<StoryCategory | undefined>();
  const [commandToastOpen, setCommandToastOpen] = useState(false);
  const [commandMessage, setCommandMessage] = useState("");

  const showCommandToast = (msg: string) => {
    setCommandMessage(msg);
    setCommandToastOpen(true);
  };

  const speakFeedback = (text: string) => {
    speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'es-ES';
    utt.rate = 0.9;
    speechSynthesis.speak(utt);
  };

  const listCurrentStories = () => {
    if (!selectedCategory) {
      speakFeedback("Por favor, selecciona primero una sección");
      return;
    }

    const filtered = stories.filter(s => s.category === selectedCategory);
    
    if (filtered.length === 0) {
      speakFeedback("No hay cuentos disponibles en esta sección");
      return;
    }

    const msg = `En la sección ${mapCategory(selectedCategory)}, los cuentos disponibles son: ${
      filtered.map(s => s.title).join(', ')
    }`;
    
    speakFeedback(msg);
  };

  const {
    voiceControlActive,
    startVoiceControl,
    stopRecognition
  } = useVoiceRecognition({
    onPlayPause: () => {
      showCommandToast("Comando: reproducir/pausar");
      handlePlayPause();
    },
    onPlayStory: (title) => {
      showCommandToast(`Comando: reproducir «${title}»`);
      const filtered = selectedCategory
        ? stories.filter(s => s.category === selectedCategory)
        : stories;
      const found = filtered.find(st => 
        st.title.toLowerCase().includes(title.toLowerCase())
      );
      if (found) {
        cancelNarration();
        handlePlayStory(found);
      } else {
        speakFeedback("No se encontró esa historia.");
      }
    },
    onListStories: () => {
      showCommandToast("Comando: listar");
      listCurrentStories();
    },
    onSetCategory: (cat) => {
      showCommandToast(`Comando: sección => ${cat}`);
      setSelectedCategory(cat);
      cancelNarration();
      speakFeedback(`Cambiando a la sección ${mapCategory(cat)}`);
    },
    onNext: handleNext,
    onPrevious: handlePrevious,
    onPause: () => {
      showCommandToast("Comando: pausa");
      handlePause();
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        if (!voiceControlActive) {
          startVoiceControl();
          showCommandToast("Control → Activar voz");
        }
      }
      else if (e.key.toLowerCase() === 'z') {
        e.preventDefault();
        stopRecognition();
        speakCommands();
        showCommandToast("Z → Mostrar comandos");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [voiceControlActive, startVoiceControl, stopRecognition]);

  function handleNext() {
    if (!currentStory) return;
    
    const stories = document.querySelectorAll('[role="article"]');
    const currentIndex = Array.from(stories).findIndex(
      story => story.getAttribute('aria-label')?.includes(currentStory.title)
    );
    
    if (currentIndex < stories.length - 1) {
      speakFeedback("Siguiente cuento");
      const nextStory = stories[currentIndex + 1];
      nextStory.querySelector('button')?.click();
    }
  }

  function handlePrevious() {
    if (!currentStory) return;
    
    const stories = document.querySelectorAll('[role="article"]');
    const currentIndex = Array.from(stories).findIndex(
      story => story.getAttribute('aria-label')?.includes(currentStory.title)
    );
    
    if (currentIndex > 0) {
      speakFeedback("Cuento anterior");
      const previousStory = stories[currentIndex - 1];
      previousStory.querySelector('button')?.click();
    }
  }

  function mapCategory(cat: StoryCategory): string {
    const categoryMap = {
      sleep: 'dormir',
      fun: 'diversión',
      educational: 'educativo',
      adventure: 'aventuras'
    };
    return categoryMap[cat];
  }

  function speakCommands() {
    speakFeedback(`
      Comandos de voz disponibles:
      - "reproducir" para pausar o reanudar
      - "reproducir" seguido del título para una historia específica
      - "pausa" para pausar
      - "siguiente" para el siguiente cuento
      - "anterior" para el cuento anterior
      - "dormir", "diversión", "educativo", "aventuras" para cambiar de sección
      - "listar" para escuchar los cuentos disponibles
      Presiona Control para activar la voz, Z para ver los comandos
    `);
  }

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
            Presiona <strong>Control</strong> para activar el control por voz, o <strong>Z</strong> para escuchar los comandos disponibles.
          </p>
          <Button
            onClick={startVoiceControl}
            className={`bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto ${
              voiceControlActive ? 'ring-2 ring-green-400' : ''
            }`}
          >
            <Mic className="w-5 h-5" />
            {voiceControlActive ? 'Control por Voz Activo' : 'Activar Control por Voz'}
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

        <section aria-label="Lista de cuentos disponibles" className="mb-24">
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