import React, { useState, useEffect } from 'react';
import StoryList from '@/components/StoryList';
import AudioPlayer from '@/components/AudioPlayer';
import { Button } from '@/components/ui/button';
import { StoryCategory, Story } from '../types/Story';
import { Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Definición de historias de ejemplo (esto debería venir de tu base de datos o API)
const stories: Story[] = [
  {
    id: 1,
    title: "El bosque mágico",
    description: "Una aventura en un bosque encantado",
    duration: "5 min",
    category: "adventure",
    content: "Había una vez en un bosque mágico..."
  },
  {
    id: 2,
    title: "La estrella dormilona",
    description: "Un cuento para ir a dormir",
    duration: "3 min",
    category: "sleep",
    content: "En lo alto del cielo había una estrella..."
  },
  // ... Agrega más historias según necesites
];

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory | undefined>();
  const [volume, setVolume] = useState(1);
  const [voiceControlActive, setVoiceControlActive] = useState(false);
  const { toast } = useToast();
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
        startVoiceControl();
      } else if (event.key.toLowerCase() === 'z') {
        event.preventDefault();
        speakCommands();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const speakCommands = () => {
    if (!window.speechSynthesis) {
      toast({
        title: "Error",
        description: "Tu navegador no soporta la síntesis de voz.",
        variant: "destructive"
      });
      return;
    }

    window.speechSynthesis.cancel();

    const commands = `
      Comandos disponibles:
      Z: Escuchar lista de comandos
      Control: Activar control por voz
      Comandos de voz:
      "reproducir" o "play": Reproducir o pausar cuento actual
      "siguiente" o "next": Siguiente cuento
      "anterior" o "previous": Cuento anterior
      "dormir": Ir a sección para dormir
      "diversión": Ir a sección de diversión
      "educativo": Ir a sección educativa
      "aventuras": Ir a sección de aventuras
      "listar": Escuchar lista de cuentos en la sección actual
      "reproducir" seguido del título del cuento: Para reproducir un cuento específico
    `;

    const utterance = new SpeechSynthesisUtterance(commands);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const listCurrentStories = () => {
    const filteredStories = selectedCategory 
      ? stories.filter(story => story.category === selectedCategory)
      : stories;
    
    if (filteredStories.length === 0) {
      speakFeedback("No hay cuentos disponibles en esta sección");
      return;
    }

    let message = selectedCategory 
      ? `En la sección ${getCategoryName(selectedCategory)}, los cuentos disponibles son: `
      : "Los cuentos disponibles son: ";
    
    filteredStories.forEach((story, index) => {
      message += `${story.title}${index < filteredStories.length - 1 ? ', ' : '.'}`;
    });

    speakFeedback(message);
  };

  const getCategoryName = (category: StoryCategory): string => {
    const categoryMap = {
      sleep: 'dormir',
      fun: 'diversión',
      educational: 'educativo',
      adventure: 'aventuras'
    };
    return categoryMap[category];
  };

  const splitTextIntoChunks = (text: string): string[] => {
    const maxLength = 150; // Reducido para evitar cortes
    const chunks: string[] = [];
    
    // Dividir por oraciones usando puntuación
    const sentences = text.split(/([.!?]+)\s+/);
    let currentChunk = '';
    
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      
      if (!sentence) continue;
      
      if ((currentChunk + sentence).length <= maxLength) {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = sentence;
      }
    }
    
    if (currentChunk) chunks.push(currentChunk);
    return chunks;
  };

  const speakTextInChunks = async (text: string, volume: number) => {
    try {
      const chunks = splitTextIntoChunks(text);
      
      for (let i = 0; i < chunks.length; i++) {
        await new Promise<void>((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(chunks[i]);
          utterance.volume = volume;
          utterance.lang = 'es-ES';
          utterance.rate = 0.9;
          
          utterance.onend = () => resolve();
          utterance.onerror = () => reject();
          
          window.speechSynthesis.speak(utterance);
        });
      }
    } catch (error) {
      console.error('Error al reproducir el texto:', error);
      toast({
        title: "Error",
        description: "Hubo un error al reproducir el cuento.",
        variant: "destructive"
      });
    } finally {
      setIsPlaying(false);
    }
  };

  const handlePlayStory = async (story: Story) => {
    if (!window.speechSynthesis) {
      toast({
        title: "Error",
        description: "Tu navegador no soporta la síntesis de voz.",
        variant: "destructive"
      });
      return;
    }

    setCurrentStory(story);
    window.speechSynthesis.cancel();
    setIsPlaying(true);
    
    await speakTextInChunks(story.content, volume);
  };

  const handlePlayPause = () => {
    if (!window.speechSynthesis) return;
    
    if (isPlaying) {
      window.speechSynthesis.pause();
      speakFeedback("Comando recibido: pausar narración");
    } else {
      window.speechSynthesis.resume();
      speakFeedback("Comando recibido: reanudar narración");
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!currentStory) return;
    
    const stories = document.querySelectorAll('[role="article"]');
    const currentIndex = Array.from(stories).findIndex(
      story => story.getAttribute('aria-label')?.includes(currentStory.title)
    );
    
    if (currentIndex < stories.length - 1) {
      speakFeedback("Comando recibido: siguiente cuento");
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
      speakFeedback("Comando recibido: cuento anterior");
      const previousStory = stories[currentIndex - 1];
      previousStory.querySelector('button')?.click();
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0] / 100;
    setVolume(volumeValue);
    if (speechUtterance) {
      speechUtterance.volume = volumeValue;
    }
  };

  const startVoiceControl = async () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast({
          title: "Error",
          description: "Tu navegador no soporta el reconocimiento de voz.",
          variant: "destructive"
        });
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = true;
      
      recognition.onresult = (event) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
        
        if (command.includes('reproducir') || command.includes('play')) {
          if (command === 'reproducir' || command === 'play') {
            handlePlayPause();
          } else {
            const storyTitle = command.replace('reproducir', '').trim();
            const filteredStories = selectedCategory 
              ? stories.filter(story => story.category === selectedCategory)
              : stories;
            
            const foundStory = filteredStories.find(story => 
              story.title.toLowerCase().includes(storyTitle)
            );
            
            if (foundStory) {
              speakFeedback(`Reproduciendo ${foundStory.title}`);
              handlePlayStory(foundStory);
            } else {
              speakFeedback("No se encontró el cuento especificado");
            }
          }
        } else if (command.includes('siguiente') || command.includes('next')) {
          handleNext();
        } else if (command.includes('anterior') || command.includes('previous')) {
          handlePrevious();
        } else if (command.includes('dormir')) {
          setSelectedCategory('sleep');
          speakFeedback("Cambiando a sección dormir");
        } else if (command.includes('diversión')) {
          setSelectedCategory('fun');
          speakFeedback("Cambiando a sección diversión");
        } else if (command.includes('educativo')) {
          setSelectedCategory('educational');
          speakFeedback("Cambiando a sección educativa");
        } else if (command.includes('aventuras')) {
          setSelectedCategory('adventure');
          speakFeedback("Cambiando a sección aventuras");
        } else if (command.includes('listar')) {
          listCurrentStories();
        }
      };

      recognition.start();
      setVoiceControlActive(true);
      
      toast({
        title: "Control por voz activado",
        description: "Ahora puede usar los comandos de voz. Presione Z para escuchar los comandos disponibles.",
      });
      
      speakFeedback("Control por voz activado. Presiona Z para escuchar los comandos disponibles.");
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

