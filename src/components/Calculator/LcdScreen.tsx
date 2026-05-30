const GHOST_DIGITS = 6;
const FONT = "'DSEG7Classic', 'Courier New', monospace";
const LETTER_SPACING = '0.04em';

interface LcdScreenProps {
  target: number;
  expression: string;
  displayValue: number | null;
  isUrgent: boolean;
  isResultState?: boolean;
  targetLabel: string;
  resultHint: string;
}

export function LcdScreen({ target, expression, displayValue, isUrgent, isResultState, targetLabel, resultHint }: LcdScreenProps) {
  const rawStr = displayValue !== null ? String(Math.abs(displayValue)) : '0';
  const isNegative = displayValue !== null && displayValue < 0;
  const ghostStr = '8'.repeat(GHOST_DIGITS);

  return (
    <div
      style={{
        background: 'var(--lcd-bg)',
        border: '2px solid var(--lcd-bezel)',
        borderRadius: 6,
        padding: '10px 12px 14px',
        marginBottom: 12,
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(0,0,0,0.2)',
        animation: isUrgent ? 'lcd-pulse 0.7s ease-in-out infinite' : 'none',
      }}
    >
      {/* Target row */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--lcd-active)', opacity: 0.55 }}>
          {targetLabel.toUpperCase()}
        </span>
        <span style={{ fontFamily: FONT, fontSize: 17, letterSpacing: LETTER_SPACING, color: 'var(--lcd-active)' }}>
          {target}
        </span>
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: 'var(--lcd-active)', opacity: 0.12, marginBottom: 6 }} />

      {/* Expression — right-aligned, overflows left */}
      <div
        style={{
          fontSize: 11,
          fontFamily: 'monospace',
          letterSpacing: '0.05em',
          color: 'var(--lcd-active)',
          opacity: 0.7,
          minHeight: 16,
          marginBottom: 8,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textAlign: 'right',
        }}
      >
        {isResultState ? resultHint : (expression || ' ')}
      </div>

      {/* Main value: ghost + active overlay */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
        {isNegative && (
          <span style={{ fontFamily: FONT, fontSize: 30, color: 'var(--lcd-active)', lineHeight: 1 }}>
            -
          </span>
        )}
        {/* Wrapper: inline-block so ghost text sets the width */}
        <div style={{ position: 'relative', display: 'inline-block', lineHeight: 1 }}>
          {/* Ghost — always full 6 digits to set container width */}
          <span
            aria-hidden="true"
            style={{
              fontFamily: FONT,
              fontSize: 30,
              letterSpacing: LETTER_SPACING,
              color: 'var(--lcd-inactive)',
              WebkitFontSmoothing: 'none',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            {ghostStr}
          </span>
          {/* Active value — absolutely overlaid, right-aligned */}
          <span
            style={{
              position: 'absolute',
              inset: 0,
              fontFamily: FONT,
              fontSize: 30,
              letterSpacing: LETTER_SPACING,
              color: 'var(--lcd-active)',
              textShadow: '0 0 12px var(--lcd-glow)',
              WebkitFontSmoothing: 'none',
              textAlign: 'right',
            }}
          >
            {rawStr}
          </span>
        </div>
      </div>
    </div>
  );
}
