import { useState, useRef } from "react";
import { Story } from "../types/Story";

const WORDS_PER_CHUNK = 20;

export function useNarration() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [storyFinished, setStoryFinished] = useState(false);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [chunks, setChunks] = useState<string[]>([]);
  const [chunkIndex, setChunkIndex] = useState<number>(0);
  const [volume, setVolume] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  function splitTextByWords(text: string): string[] {
    const words = text.split(" ");
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += WORDS_PER_CHUNK) {
      chunks.push(words.slice(i, i + WORDS_PER_CHUNK).join(" "));
    }
    return chunks;
  }

  function playChunk(index: number) {
    if (!chunks[index]) {
      setStoryFinished(true);
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    currentUtteranceRef.current = utterance;

    utterance.volume = volume;
    utterance.lang = "es-ES";
    utterance.rate = 0.9;

    utterance.onend = () => {
      const nextIndex = index + 1;
      setChunkIndex(nextIndex);

      if (nextIndex < chunks.length) {
        playChunk(nextIndex);
      } else {
        setStoryFinished(true);
        setIsPlaying(false);
      }
    };

    utterance.onerror = (error) => {
      console.error("Error en utterance:", error);
      setIsPlaying(false);
    };

    speechSynthesis.speak(utterance);
  }

  function startReadingStory(fromIndex: number) {
    setStoryFinished(false);
    setChunkIndex(fromIndex);
    setIsPaused(false);
    playChunk(fromIndex);
  }

  function handlePlayStory(story: Story) {
    if (!speechSynthesis) {
      console.warn("No hay soporte para speechSynthesis");
      return;
    }

    speechSynthesis.cancel();
    setIsPaused(false);

    setCurrentStory(story);
    setStoryFinished(false);
    setChunkIndex(0);
    setChunks(splitTextByWords(story.content));
    setIsPlaying(true);

    startReadingStory(0);
  }

  function handlePlayPause() {
    if (!speechSynthesis) return;

    if (isPlaying && !storyFinished) {
      speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
    } else if (!isPlaying && !storyFinished) {
      if (isPaused) {
        speechSynthesis.resume();
        setIsPlaying(true);
        setIsPaused(false);
      } else {
        startReadingStory(chunkIndex);
      }
    } else if (storyFinished && currentStory) {
      speechSynthesis.cancel();
      setChunkIndex(0);
      setIsPlaying(true);
      startReadingStory(0);
    }
  }

  function handlePause() {
    if (isPlaying && !storyFinished) {
      speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  }

  function cancelNarration() {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setStoryFinished(true);
    setCurrentStory(null);
    setChunks([]);
    setChunkIndex(0);
    setIsPaused(false);
  }

  function setNarrationVolume(vol: number) {
    setVolume(vol);
  }

  return {
    isPlaying,
    storyFinished,
    currentStory,
    handlePlayStory,
    handlePlayPause,
    handlePause,
    cancelNarration,
    setNarrationVolume,
    chunkIndex,
    volume,
    isPaused
  };
}