import React from 'react';
import StoryCard from './StoryCard';

const stories = [
  {
    id: 1,
    title: "El Principito",
    description: "Un clásico de Antoine de Saint-Exupéry sobre un pequeño príncipe que viaja por diferentes planetas.",
    duration: "45 minutos"
  },
  {
    id: 2,
    title: "La Sirenita",
    description: "Una hermosa historia sobre una sirena que sueña con vivir en el mundo terrestre.",
    duration: "30 minutos"
  },
  {
    id: 3,
    title: "El Patito Feo",
    description: "Un cuento sobre la aceptación y la transformación personal.",
    duration: "25 minutos"
  }
];

const StoryList = () => {
  const handlePlay = (id: number) => {
    console.log(`Reproduciendo historia ${id}`);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          title={story.title}
          description={story.description}
          duration={story.duration}
          onPlay={() => handlePlay(story.id)}
        />
      ))}
    </div>
  );
};

export default StoryList;