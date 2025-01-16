import React from 'react';
import StoryCard from './StoryCard';
import { Story, StoryCategory } from '../types/Story';

const stories: Story[] = [
  {
    id: 1,
    title: "El Principito",
    description: "Un clásico de Antoine de Saint-Exupéry sobre un pequeño príncipe que viaja por diferentes planetas.",
    duration: "45 minutos",
    category: "educational",
    content: "En un pequeño planeta vivía un principito. Un día, decidió explorar el universo y comenzó a visitar diferentes planetas, cada uno habitado por un personaje peculiar..."
  },
  {
    id: 2,
    title: "La Sirenita",
    description: "Una hermosa historia sobre una sirena que sueña con vivir en el mundo terrestre.",
    duration: "30 minutos",
    category: "fun",
    content: "En lo profundo del océano vivía una joven sirena con una hermosa voz. Ella soñaba con conocer el mundo de los humanos y especialmente al apuesto príncipe que había visto una vez..."
  },
  {
    id: 3,
    title: "El Patito Feo",
    description: "Un cuento sobre la aceptación y la transformación personal.",
    duration: "25 minutos",
    category: "sleep",
    content: "En una granja nació un patito diferente a sus hermanos. Era más grande y de un color distinto. Los otros animales se burlaban de él, pero no sabían que estaba destinado a convertirse en algo hermoso..."
  },
  {
    id: 4,
    title: "Caperucita Roja",
    description: "La clásica historia de una niña, su abuela y un lobo astuto.",
    duration: "20 minutos",
    category: "adventure",
    content: "Había una vez una niña que siempre llevaba una capa roja. Un día, su madre le pidió que llevara una cesta con comida a su abuela enferma..."
  },
  {
    id: 5,
    title: "Los Tres Cerditos",
    description: "Una historia sobre la importancia del trabajo bien hecho.",
    duration: "25 minutos",
    category: "educational",
    content: "Tres cerditos decidieron construir sus propias casas. El primero la hizo de paja, el segundo de madera y el tercero, más trabajador, la construyó de ladrillos..."
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