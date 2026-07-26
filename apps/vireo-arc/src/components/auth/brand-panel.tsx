/**
 * Brand panel shared by the mock authentication routes (`/login`,
 * `/forgot-password`). It is a fixed deep-navy signature surface in both
 * themes, so it intentionally uses raw brand colors instead of semantic
 * tokens. Hidden below `lg`, where the form stands alone.
 */
export function BrandPanel() {
  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#060d38] px-14 py-12 lg:flex">
      {/* Soft brand glows over the navy canvas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(52rem 32rem at 85% -10%, rgba(238, 91, 0, 0.16), transparent 60%),' +
            'radial-gradient(40rem 28rem at -10% 110%, rgba(58, 78, 214, 0.22), transparent 55%)',
        }}
      />

      {/* Product wordmark, same signature used in the sidebar. */}
      <p className="relative font-heading text-lg font-bold tracking-[0.12em] text-white">
        Vireo <span className="text-primary">ARC</span>
      </p>

      {/* ECG trace + product statement. */}
      <div className="relative space-y-10">
        <svg
          viewBox="0 0 900 200"
          fill="none"
          role="img"
          aria-label="Electrocardiogram trace"
          className="w-full max-w-xl"
        >
          <path
            d="M0 100 L150 100 Q160 100 165 88 Q170 100 180 100 L210 100 L220 92 L232 108 L242 30 L256 160 L268 108 L276 100 L330 100 Q345 100 355 76 Q365 100 380 100 L520 100 Q530 100 535 88 Q540 100 550 100 L580 100 L590 92 L602 108 L612 30 L626 160 L638 108 L646 100 L700 100 Q715 100 725 76 Q735 100 750 100 L900 100"
            stroke="rgba(255, 255, 255, 0.14)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M0 100 L150 100 Q160 100 165 88 Q170 100 180 100 L210 100 L220 92 L232 108 L242 30 L256 160 L268 108 L276 100 L330 100 Q345 100 355 76 Q365 100 380 100 L520 100 Q530 100 535 88 Q540 100 550 100 L580 100 L590 92 L602 108 L612 30 L626 160 L638 108 L646 100 L700 100 Q715 100 725 76 Q735 100 750 100 L900 100"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="brand-ecg-trace"
          />
        </svg>

        <div className="space-y-4">
          <p className="font-heading max-w-md text-4xl font-bold leading-tight text-white">
            Cardiac diagnostics, orchestrated.
          </p>
          <p className="max-w-md text-sm leading-relaxed text-white/60">
            One workspace for examinations, measurements and reports across your
            cardiology service line.
          </p>
        </div>
      </div>

      {/* Brand footer. */}
      <div className="relative">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
          Powered by Cardioline S.p.A.
        </p>
      </div>

      <style>{`
        .brand-ecg-trace {
          stroke-dasharray: 1500;
          stroke-dashoffset: 1500;
          filter: drop-shadow(0 0 6px rgba(238, 91, 0, 0.55));
          animation: brand-ecg-draw 7s ease-in-out infinite;
        }

        @keyframes brand-ecg-draw {
          0%   { stroke-dashoffset: 1500; opacity: 0; }
          6%   { opacity: 1; }
          62%  { stroke-dashoffset: 0; opacity: 1; }
          82%  { stroke-dashoffset: 0; opacity: 0; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .brand-ecg-trace {
            animation: none;
            stroke-dashoffset: 0;
            opacity: 0.7;
          }
        }
      `}</style>
    </aside>
  );
}
