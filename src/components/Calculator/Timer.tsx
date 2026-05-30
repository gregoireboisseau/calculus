const FONT = "'DSEG7Classic', 'Courier New', monospace";
const GHOST = '8:88';

interface TimerProps {
  secondsLeft: number;
  isUrgent: boolean;
  label: string;
}

function formatTime(s: number): string {
  const total = Math.ceil(Math.max(0, s));
  const m = Math.floor(total / 60);
  const sec = total % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export function Timer({ secondsLeft, isUrgent, label }: TimerProps) {
  const timeStr = formatTime(secondsLeft);
  const progress = Math.max(0, secondsLeft / 100);

  return (
    <div style={{ marginBottom: 12 }}>
      {/* Row: label + LCD display */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--text-label)', opacity: 0.8 }}>
          {label.toUpperCase()}
        </span>

        <div
          style={{
            background: 'var(--lcd-bg)',
            border: '1px solid var(--lcd-bezel)',
            borderRadius: 4,
            padding: '3px 8px',
            boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.4)',
            animation: isUrgent ? 'blink 0.6s step-end infinite' : 'none',
          }}
        >
          {/* Ghost + active overlay */}
          <div style={{ position: 'relative', display: 'inline-block', lineHeight: 1 }}>
            <span
              aria-hidden="true"
              style={{
                fontFamily: FONT,
                fontSize: 18,
                letterSpacing: '0.04em',
                color: 'var(--lcd-inactive)',
                WebkitFontSmoothing: 'none',
                userSelect: 'none',
              }}
            >
              {GHOST}
            </span>
            <span
              style={{
                position: 'absolute',
                inset: 0,
                fontFamily: FONT,
                fontSize: 18,
                letterSpacing: '0.04em',
                color: 'var(--lcd-active)',
                WebkitFontSmoothing: 'none',
                textAlign: 'right',
              }}
            >
              {timeStr}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 5,
          background: 'rgba(0,0,0,0.2)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress * 100}%`,
            background: isUrgent ? 'var(--prog-bad)' : 'var(--prog-ok)',
            borderRadius: 3,
            transition: 'width 0.1s linear, background 0.5s ease',
          }}
        />
      </div>
    </div>
  );
}
