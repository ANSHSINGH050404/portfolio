export function useClickSound() {
  return () => {
    const audio = new Audio("/click1.wav");
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };
}
