'use client';

export function AmbientBackground() {
  return (
    <div className="ambient-shapes fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="absolute w-96 h-96 rounded-full bg-highlight-yellow/5 blur-3xl"
        style={{
          top: '10%',
          left: '5%',
          animation: 'float 20s infinite ease-in-out',
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full bg-highlight-yellow/3 blur-3xl"
        style={{
          top: '60%',
          right: '10%',
          animation: 'float 25s infinite ease-in-out reverse',
        }}
      />
      <div
        className="absolute w-72 h-72 rounded-full bg-white/5 blur-3xl"
        style={{
          bottom: '20%',
          left: '30%',
          animation: 'float 30s infinite ease-in-out',
          animationDelay: '5s',
        }}
      />
    </div>
  );
}
