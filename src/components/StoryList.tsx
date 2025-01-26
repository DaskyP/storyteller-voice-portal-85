import React from 'react';
import StoryCard from './StoryCard';
import { Story, StoryCategory } from '../types/Story';
import {elPatitoFeo , laSirenita , elPrincipito , caperucitaRoja ,losTresCerditos, hanselYGretel,laBellaDurmiente,elGatoConBotas}from './cuentos';


export const stories: Story[] = [
  {
    id: 1,
    title: "El Principito",
    description: "Un clásico que habla de un pequeño príncipe que viaja por diferentes planetas.",
    duration: "45 minutos",
    category: "educational",
    content: elPrincipito
  },
  {
    id: 2,
    title: "La Sirenita",
    description: "Una hermosa historia sobre una sirena que sueña con vivir en el mundo terrestre.",
    duration: "30 minutos",
    category: "fun",
    content: laSirenita
  },
  {
    id: 3,
    title: "El Patito Feo",
    description: "Un cuento sobre la aceptación y la transformación personal.",
    duration: "25 minutos",
    category: "sleep",
    content: elPatitoFeo
  },
  {
    id: 4,
    title: "Caperucita Roja",
    description: "La clásica historia de una niña, su abuela y un lobo astuto.",
    duration: "20 minutos",
    category: "adventure",
    content: caperucitaRoja
  },
  {
    id: 5,
    title: "Los Tres Cerditos",
    description: "Una historia sobre la importancia del trabajo bien hecho.",
    duration: "25 minutos",
    category: "educational",
    content: losTresCerditos
  },
  {
    id: 6,
    title: "Hansel y Gretel",
    description: "Una aventura de dos hermanos en un bosque mágico.",
    duration: "35 minutos",
    category: "adventure",
    content: hanselYGretel
  },
  {
    id: 7,
    title: "La Bella Durmiente",
    description: "Un cuento mágico sobre una princesa y una maldición.",
    duration: "30 minutos",
    category: "sleep",
    content: laBellaDurmiente
  },
  {
    id: 8,
    title: "El Gato con Botas",
    description: "Las astutas aventuras de un gato muy especial.",
    duration: "28 minutos",
    category: "fun",
    content: elGatoConBotas
  }
];

interface StoryListProps {
  selectedCategory?: StoryCategory;
  onPlayStory: (story: Story) => void;
}

const StoryList = ({ selectedCategory, onPlayStory }: StoryListProps) => {
  const filteredStories = selectedCategory 
    ? stories.filter(story => story.category === selectedCategory)
    : stories;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredStories.map((story) => (
        <StoryCard
          key={story.id}
          title={story.title}
          description={story.description}
          duration={story.duration}
          onPlay={() => onPlayStory(story)}
        />
      ))}
    </div>
  );
};


export default StoryList;