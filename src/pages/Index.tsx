import React, { useState, useEffect } from 'react';
import StoryList, { stories } from '@/components/StoryList';
import AudioPlayer from '@/components/AudioPlayer';
import { Button } from '@/components/ui/button';
import { StoryCategory } from '../types/Story';
import { Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNarration } from '@/hooks/useNarration';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

const Index = () => {
  const { toast } = useToast();
  const {
    isPlaying,
    currentStory,
    handlePlayStory,
    handlePlayPause,
    handlePause,
    cancelNarration,
    setNarrationVolume,
  } = useNarration();

  const [selectedCategory, setSelectedCategory] = useState<StoryCategory | undefined>();
  const [lastCommand, setLastCommand] = useState<string>("");

  const speakFeedback = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    if (!isPlaying) {
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  };

  const showFeedback = (message: string) => {
    toast({
      title: "Comando de voz",
      description: message,
    });
    speakFeedback(message);
  };

  const listCurrentStories = () => {
    const currentStories = selectedCategory 
      ? stories.filter(s => s.category === selectedCategory)
      : stories;
    
    if (currentStories.length === 0) {
      showFeedback("No hay cuentos disponibles en esta sección");
      return;
    }

    const sectionName = selectedCategory 
      ? mapCategory(selectedCategory)
      : "todas las secciones";
    
    const msg = `En ${sectionName}, los cuentos disponibles son: ${
      currentStories.map(s => s.title).join(', ')
    }`;
    
    showFeedback(msg);
  };

  const handleVolumeChange = (value: number[]) => {
    setNarrationVolume(value[0] / 100);
  };

  const {
    voiceControlActive,
    startVoiceControl,
    stopRecognition
  } = useVoiceRecognition({
    onPlayPause: () => {
      setLastCommand("play_pause");
      if (currentStory) {
        const message = isPlaying ? "Pausando cuento" : "Reanudando cuento";
        showFeedback(message);
        setTimeout(() => {
          handlePlayPause();
        }, 1000);
      } else {
        showFeedback("No hay ningún cuento seleccionado");
      }
    },
    onPlayStory: (title) => {
      setLastCommand("play_story");
      const currentStories = selectedCategory
        ? stories.filter(s => s.category === selectedCategory)
        : stories;

      const found = currentStories.find(st => 
        st.title.toLowerCase().includes(title.toLowerCase())
      );

      if (found) {
        showFeedback(`Reproduciendo: ${found.title}`);
        if (currentStory) {
          cancelNarration();
        }
        setTimeout(() => {
          handlePlayStory(found);
        }, 1000);
      } else {
        showFeedback("No se encontró esa historia en la sección actual");
      }
    },
    onListStories: () => {
      setLastCommand("list");
      setTimeout(() => {
        listCurrentStories();
      }, 500);
    },
    onSetCategory: (cat) => {
      setLastCommand("set_category");
      showFeedback(`Cambiando a la sección ${mapCategory(cat)}`);
      setTimeout(() => {
        setSelectedCategory(cat);
        if (currentStory) {
          cancelNarration();
        }
      }, 500);
    },
    onNext: () => {
      setLastCommand("next");
      showFeedback("Siguiente cuento");
      handleNext();
    },
    onPrevious: () => {
      setLastCommand("previous");
      showFeedback("Cuento anterior");
      handlePrevious();
    },
    onPause: () => {
      setLastCommand("pause");
      if (currentStory && isPlaying) {
        showFeedback("Pausando cuento");
        setTimeout(() => {
          handlePause();
        }, 1000);
      } else {
        showFeedback("No hay ningún cuento reproduciéndose");
      }
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        if (!voiceControlActive) {
          startVoiceControl();
          showFeedback(`
            Control por voz activado. Di un comando.
            Comandos disponibles:
            "reproducir" para pausar o reanudar,
            "reproducir" seguido del título para una historia específica,
            "pausa" para pausar,
            "siguiente" para el siguiente cuento,
            "anterior" para el cuento anterior,
            "dormir", "diversión", "educativo", "aventuras" para cambiar de sección,
            "listar" para escuchar los cuentos disponibles
          `);
        }
      }
      else if (e.key.toLowerCase() === 'z') {
        e.preventDefault();
        stopRecognition();
        showFeedback(`
          Comandos disponibles:
          "reproducir" para pausar o reanudar,
          "reproducir" seguido del título para una historia específica,
          "pausa" para pausar,
          "siguiente" para el siguiente cuento,
          "anterior" para el cuento anterior,
          "dormir", "diversión", "educativo", "aventuras" para cambiar de sección,
          "listar" para escuchar los cuentos disponibles.
          Presiona Control para activar la voz, Z para ver los comandos
        `);
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

  const categories: { id: StoryCategory; name: string }[] = [
    { id: 'sleep', name: 'Para Dormir' },
    { id: 'fun', name: 'Diversión' },
    { id: 'educational', name: 'Educativos' },
    { id: 'adventure', name: 'Aventuras' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-green-400" tabIndex={0}>
            Cuentacuentos Accesible
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8" tabIndex={0}>
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

        <div className="mb-8 flex gap-4 justify-center flex-wrap">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                if (currentStory) {
                  cancelNarration();
                }
              }}
              className={`bg-gray-800 hover:bg-gray-700 text-white ${
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