let cachedCanPlayM4a: boolean | null = null;

function canPlayM4a(): boolean {
  if (cachedCanPlayM4a !== null) return cachedCanPlayM4a;

  const audio = document.createElement('audio');
  cachedCanPlayM4a = audio.canPlayType('audio/mp4').replace('no', '') !== '';
  return cachedCanPlayM4a;
}

export function playMemberAudio(audioPath: string): void {
  const extension = canPlayM4a() ? 'm4a' : 'ogg';
  const src = `/audio/${audioPath}.${extension}`;

  const audio = new Audio(src);
  audio.volume = 0.7;
  audio.play().catch(() => {});
}
