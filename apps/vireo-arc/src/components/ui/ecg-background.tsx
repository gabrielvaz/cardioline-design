'use client';

/**
 * EcgBackground
 * Animated SVG ECG waveform in the background.
 * Uses CSS animation to draw the line from left to right, looping.
 */
export function EcgBackground() {
  /* A simplified ECG PQRST waveform path */
  const ecgPath =
    'M0,50 L60,50 L70,50 L75,40 L80,50 L90,50 L95,50 L100,15 L105,85 L110,50 L115,58 L120,42 L125,50 L200,50 L260,50 L270,50 L275,40 L280,50 L290,50 L295,50 L300,15 L305,85 L310,50 L315,58 L320,42 L325,50 L400,50';

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 overflow-hidden"
    >
      {/* Top ECG line */}
      <svg
        className="absolute w-full opacity-20"
        style={{ top: '25%' }}
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={ecgPath}
          fill="none"
          stroke="#f83b3b"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 2000,
            strokeDashoffset: 0,
            animation: 'ecg-scroll 6s linear infinite',
          }}
        />
      </svg>

      {/* Center ECG line (brighter) */}
      <svg
        className="absolute w-full opacity-30"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={ecgPath}
          fill="none"
          stroke="#f83b3b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 2000,
            strokeDashoffset: 0,
            animation: 'ecg-scroll 5s linear infinite',
            animationDelay: '-2s',
          }}
        />
      </svg>

      {/* Bottom ECG line */}
      <svg
        className="absolute w-full opacity-15"
        style={{ top: '75%' }}
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={ecgPath}
          fill="none"
          stroke="#f83b3b"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 2000,
            strokeDashoffset: 0,
            animation: 'ecg-scroll 7s linear infinite',
            animationDelay: '-4s',
          }}
        />
      </svg>

      {/* ECG grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(45, 106, 224, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45, 106, 224, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow dot following the ECG */}
      <div
        className="absolute rounded-full"
        style={{
          width: '8px',
          height: '8px',
          background: '#f83b3b',
          boxShadow: '0 0 20px 6px rgba(248, 59, 59, 0.5)',
          top: 'calc(50% - 4px)',
          animation: 'glow-travel 5s linear infinite',
          animationDelay: '-2s',
        }}
      />

      <style jsx>{`
        @keyframes ecg-scroll {
          0%   { stroke-dashoffset: 2000; }
          100% { stroke-dashoffset: -2000; }
        }
        @keyframes glow-travel {
          0%   { left: -10px; }
          100% { left: calc(100% + 10px); }
        }
      `}</style>
    </div>
  );
}
