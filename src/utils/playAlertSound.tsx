export const playAlertSound = (level: string) => {
  let file = '/sounds/info.mp3';

  if (level === 'WARNING') file = '/sounds/warning.mp3';
  if (level === 'CRITIQUE') file = '/sounds/critique.mp3';

  const audio = new Audio(file);
  audio.play().catch((e) => console.warn('🔇 Erreur son :', e));
};
