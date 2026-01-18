export function createFloatingQuote(quote: string, x: number, y: number): void {
  const el = document.createElement('div');
  el.className = 'floating-quote';
  el.textContent = `"${quote}"`;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  document.body.appendChild(el);

  let posY = y;

  const animate = () => {
    posY -= 2;
    el.style.top = `${posY}px`;

    if (posY > -100) {
      requestAnimationFrame(animate);
    } else {
      el.remove();
    }
  };

  requestAnimationFrame(animate);
}
