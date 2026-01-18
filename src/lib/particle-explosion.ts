/**
 * Creates a particle explosion effect at the specified coordinates
 * @param x - The X coordinate of the explosion origin (clientX)
 * @param y - The Y coordinate of the explosion origin (clientY)
 */
export function createExplosion(x: number, y: number) {
  const particleCount = 20;
  const container = document.getElementById('particles');

  if (!container) {
    console.warn('Particles container not found');
    return;
  }

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    const size = Math.random() * 10 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    container.appendChild(particle);

    const angle = (Math.PI * 2 * i) / particleCount;
    const speed = Math.random() * 200 + 100;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    let posX = x;
    let posY = y;
    let velocityY = vy;
    let opacity = 1;
    let scale = 1;

    const animate = () => {
      posX += vx * 0.016; // ~60fps
      velocityY += 2; // gravity pulls down
      posY += velocityY * 0.016;
      opacity -= 0.02;
      scale -= 0.01;

      particle.style.left = `${posX}px`;
      particle.style.top = `${posY}px`;
      particle.style.opacity = String(opacity);
      particle.style.transform = `scale(${scale})`;

      if (opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        particle.remove();
      }
    };

    requestAnimationFrame(animate);
  }
}
