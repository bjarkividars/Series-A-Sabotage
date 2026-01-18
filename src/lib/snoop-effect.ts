import { playMemberAudio } from './audio';

export function createSnoopEffect(
  avatarElement: HTMLElement,
  onComplete: () => void
): void {
  playMemberAudio('snoop');

  // Hide the original avatar
  avatarElement.style.visibility = 'hidden';

  const rect = avatarElement.getBoundingClientRect();
  const centerX = window.innerWidth / 2 - rect.width / 2;
  const centerY = window.innerHeight / 2 - rect.height / 2;

  // Create overlay (starts hidden)
  const overlay = document.createElement('div');
  overlay.className = 'snoop-overlay';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.4s ease-out';
  document.body.appendChild(overlay);

  // Create smoking images in a grid (start hidden)
  const images: HTMLImageElement[] = [];
  const cols = 8;
  const rows = 6;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const img = document.createElement('img');
      img.src = '/headshots/snoop-smoking.png';
      img.className = 'snoop-bg-image';
      img.style.left = `${(col + 0.5) * (100 / cols)}%`;
      img.style.top = `${(row + 0.5) * (100 / rows)}%`;
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.4s ease-out';
      overlay.appendChild(img);
      images.push(img);
    }
  }

  // Create avatar clone (starts at card position)
  const clone = document.createElement('div');
  clone.className = 'snoop-avatar-clone';
  clone.style.position = 'fixed';
  clone.style.left = `${rect.left}px`;
  clone.style.top = `${rect.top}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.zIndex = '999999';
  clone.style.opacity = '0';
  clone.style.transition = 'opacity 0.3s ease-out';
  clone.style.pointerEvents = 'none';

  const cloneImg = document.createElement('img');
  cloneImg.src = '/headshots/snoop.png';
  cloneImg.alt = 'Snoop Dogg';
  clone.appendChild(cloneImg);
  document.body.appendChild(clone);

  // Phase 1: Fade in overlay
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
  });

  // Phase 1: Fade in images with stagger
  images.forEach((img, i) => {
    setTimeout(() => {
      img.style.opacity = '1';
    }, 100 + i * 15);
  });

  // Phase 1: Fade in avatar clone
  setTimeout(() => {
    clone.style.opacity = '1';
  }, 200);

  // Phase 2: Move avatar to center
  setTimeout(() => {
    clone.style.transition = 'left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out';
    clone.style.left = `${centerX}px`;
    clone.style.top = `${centerY}px`;
    clone.style.transform = 'scale(1.5)';
  }, 600);

  // Phase 3: Wait 3 seconds then spin for 5 seconds (one rotation)
  setTimeout(() => {
    clone.style.transition = 'transform 5s linear';
    clone.style.transform = 'scale(1.5) rotate(360deg)';
  }, 2600);

  // Phase 4: Move avatar back
  setTimeout(() => {
    clone.style.transition = 'left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.transform = 'scale(1) rotate(360deg)';
  }, 8800);

  // Phase 4: Fade out images
  setTimeout(() => {
    images.forEach((img) => {
      img.style.opacity = '0';
    });
  }, 9100);

  // Phase 4: Fade out clone
  setTimeout(() => {
    clone.style.transition = 'opacity 0.3s ease-out';
    clone.style.opacity = '0';
  }, 9300);

  // Phase 4: Fade out overlay
  setTimeout(() => {
    overlay.style.opacity = '0';
  }, 9500);

  // Cleanup
  setTimeout(() => {
    avatarElement.style.visibility = 'visible';
    overlay.remove();
    clone.remove();
    onComplete();
  }, 9900);
}
