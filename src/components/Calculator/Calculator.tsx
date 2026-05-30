'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { CalcState } from '@/lib/game/calculator';
import {
  initCalcState,
  pressNumber,
  pressIntermediate,
  pressOperator,
  pressEqual,
  pressStore,
  pressDelete,
  pressReset,
  getDisplayValue,
} from '@/lib/game/calculator';
import { computeScore } from '@/lib/game/score';
import { submitScore } from '@/app/actions/score';
import type { DailyDraw } from '@/lib/game/draw';
import { LcdScreen } from './LcdScreen';
import { Timer } from './Timer';
import { NumberPad } from './NumberPad';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Leaderboard } from '@/components/Leaderboard';
import { Link } from '@/i18n/navigation';

type GamePhase = 'pseudo' | 'playing' | 'submitted' | 'timeout';

interface FinalScore {
  result: number;
  ecart: number;
  score: number;
  tempsPasse: number;
}

interface CalculatorProps {
  draw: DailyDraw;
  locale: string;
}

/* ─── Shared header visual ──────────────────────────────────────────────────── */

function CalcHeader({ locale }: { locale: string }) {
  const other = locale === 'fr' ? 'en' : 'fr';
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
      {/* Solar cells */}
      <div
        style={{
          width: 70,
          height: 22,
          flexShrink: 0,
          borderRadius: 3,
          background: `
            repeating-linear-gradient(90deg,
              transparent 0px, transparent 12px,
              rgba(0,0,0,0.6) 12px, rgba(0,0,0,0.6) 13px),
            repeating-linear-gradient(0deg,
              transparent 0px, transparent 3px,
              rgba(0,0,0,0.35) 3px, rgba(0,0,0,0.35) 4px),
            linear-gradient(140deg, #1a2e1a 0%, #0e180e 100%)
          `,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.5)',
        }}
      />
      <span
        style={{
          marginLeft: 8,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: '0.22em',
          color: 'var(--text-brand)',
          textShadow: '0 1px 0 rgba(255,255,255,0.15)',
          userSelect: 'none',
        }}
      >
        CALCULUS
      </span>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ThemeToggle />
        <Link
          href="/"
          locale={other}
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: 'var(--text-label)',
            textDecoration: 'none',
            padding: '2px 4px',
          }}
        >
          {other.toUpperCase()}
        </Link>
      </div>
    </div>
  );
}

/* ─── Pseudo entry overlay ──────────────────────────────────────────────────── */

function PseudoOverlay({
  pseudo,
  onChange,
  onStart,
}: {
  pseudo: string;
  onChange: (v: string) => void;
  onStart: () => void;
}) {
  const t = useTranslations('game');
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        borderRadius: 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)',
        zIndex: 20,
      }}
    >
      <div
        className="anim-pop"
        style={{
          background: 'var(--calc-body)',
          border: '2px solid var(--calc-edge)',
          borderRadius: 10,
          padding: '24px 20px',
          width: '80%',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'var(--text-brand)',
            marginBottom: 16,
          }}
        >
          {t('yourPseudo').toUpperCase()}
        </p>
        <input
          autoFocus
          value={pseudo}
          onChange={(e) => onChange(e.target.value.slice(0, 20))}
          onKeyDown={(e) => e.key === 'Enter' && onStart()}
          placeholder="…"
          maxLength={20}
          style={{
            width: '100%',
            background: 'var(--lcd-bg)',
            border: '1px solid var(--lcd-bezel)',
            borderRadius: 5,
            color: 'var(--lcd-active)',
            fontFamily: 'monospace',
            fontSize: 18,
            padding: '8px 10px',
            textAlign: 'center',
            outline: 'none',
            marginBottom: 14,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
          }}
        />
        <button
          onClick={onStart}
          disabled={!pseudo.trim()}
          className="btn-key btn-e"
          style={{ width: '100%', height: 44, fontSize: 14 }}
        >
          {t('play').toUpperCase()}
        </button>
      </div>
    </div>
  );
}

/* ─── Result screen ─────────────────────────────────────────────────────────── */

function ResultScreen({
  finalScore,
  target,
  pseudo,
  phase,
  date,
  locale,
}: {
  finalScore: FinalScore;
  target: number;
  pseudo: string;
  phase: 'submitted' | 'timeout';
  date: string;
  locale: string;
}) {
  const t = useTranslations('game');
  const isExact = finalScore.ecart === 0;
  const isTimeout = phase === 'timeout';

  const statusText = isTimeout
    ? t('timeout').toUpperCase()
    : isExact
      ? t('exact').toUpperCase()
      : t('off', { ecart: finalScore.ecart }).toUpperCase();

  const statusColor = isTimeout
    ? 'var(--btn-d-text)'
    : isExact
      ? 'var(--btn-o-text)'
      : 'var(--lcd-active)';

  return (
    <div className="anim-slide" style={{ color: 'var(--lcd-active)' }}>
      {/* Status label */}
      <p
        style={{
          textAlign: 'center',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.2em',
          color: statusColor,
          marginBottom: 8,
        }}
      >
        {statusText}
      </p>

      {/* Score big display */}
      <div
        style={{
          background: 'var(--lcd-bg)',
          border: '2px solid var(--lcd-bezel)',
          borderRadius: 6,
          padding: '14px 16px',
          marginBottom: 12,
          textAlign: 'center',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', opacity: 0.55, marginBottom: 4 }}>
          {t('score').toUpperCase()}
        </div>
        <div className="dseg" style={{ fontSize: 36, color: 'var(--lcd-active)' }}>
          {finalScore.score}
        </div>
        <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6, fontFamily: 'monospace' }}>
          {t('resultLine', { result: finalScore.result, target })}
        </div>
      </div>

      {/* Leaderboard */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.18em',
          opacity: 0.55,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        {t('leaderboardTitle').toUpperCase()}
      </div>
      <Leaderboard
        date={date}
        currentPseudo={pseudo}
        currentScore={finalScore.score}
        locale={locale}
      />
    </div>
  );
}

/* ─── Main Calculator component ─────────────────────────────────────────────── */

export function Calculator({ draw, locale }: CalculatorProps) {
  const t = useTranslations('game');
  const [phase, setPhase] = useState<GamePhase>('pseudo');
  const [pseudo, setPseudo] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(100);
  const [calcState, setCalcState] = useState<CalcState>(initCalcState());
  const [finalScore, setFinalScore] = useState<FinalScore | null>(null);

  const secondsLeftRef = useRef(100);
  const calcStateRef = useRef<CalcState>(calcState);

  useEffect(() => {
    calcStateRef.current = calcState;
  }, [calcState]);

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;

    const startMs = Date.now();

    const tick = setInterval(() => {
      const elapsed = (Date.now() - startMs) / 1000;
      const remaining = Math.max(0, 100 - elapsed);

      secondsLeftRef.current = remaining;
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(tick);
        setPhase('timeout');
        setFinalScore({
          result: calcStateRef.current.accumulator ?? 0,
          ecart: 999,
          score: 0,
          tempsPasse: 100,
        });
      }
    }, 100);

    return () => clearInterval(tick);
  }, [phase, draw.date]);

  const handleSubmit = useCallback(
    async (state: CalcState) => {
      if (!state.done || state.accumulator === null) return;

      const result = state.accumulator;
      const ecart = Math.abs(result - draw.target);
      const tempsPasse = 100 - secondsLeftRef.current;
      const score = computeScore(tempsPasse, ecart);

      try {
        await submitScore(pseudo, score, draw.date, tempsPasse, ecart, locale);
      } catch (e) {
        console.error('[submitScore]', e);
      }

      setFinalScore({ result, ecart, score, tempsPasse });
      setPhase('submitted');
    },
    [draw.target, draw.date, pseudo, locale],
  );

  const handleNumber = useCallback((val: number, idx: number) => {
    setCalcState((prev) => pressNumber(prev, val, idx));
  }, []);

  const handleOperator = useCallback((op: '+' | '-' | '×' | '÷') => {
    setCalcState((prev) => pressOperator(prev, op));
  }, []);

  const handleEqual = useCallback(() => {
    const next = pressEqual(calcState);
    setCalcState(next);
    if (next.done && next.accumulator !== null) {
      handleSubmit(next);
    }
  }, [calcState, handleSubmit]);

  const handleIntermediate = useCallback((val: number, id: number) => {
    setCalcState((prev) => pressIntermediate(prev, val, id));
  }, []);

  const handleStore = useCallback(() => {
    setCalcState((prev) => pressStore(prev));
  }, []);

  const handleDelete = useCallback(() => {
    setCalcState((prev) => pressDelete(prev));
  }, []);

  const handleReset = useCallback(() => {
    setCalcState(pressReset());
  }, []);

  const displayValue = getDisplayValue(calcState);
  const isUrgent = secondsLeft < 20 && phase === 'playing';
  const isResultState = calcState.accumulator !== null && calcState.input === '' && calcState.pendingOp === null && !calcState.done;
  const padDisabled = phase !== 'playing';

  const bodyStyle: React.CSSProperties = {
    background: `
      radial-gradient(ellipse at 28% 16%, var(--calc-hi) 0%, transparent 52%),
      linear-gradient(168deg, var(--calc-hi) 0%, var(--calc-body) 38%, var(--calc-edge) 100%)
    `,
    boxShadow: `
      0 0 0 2px var(--calc-edge),
      0 10px 28px rgba(0,0,0,0.42),
      0 28px 56px rgba(0,0,0,0.18),
      inset 0 1px 0 var(--calc-hi)
    `,
    borderRadius: '14px 14px 28px 28px',
    padding: '16px 16px 22px',
    position: 'relative',
    overflow: 'hidden',
    maxWidth: 380,
    width: '100%',
  };

  return (
    <div style={bodyStyle}>
      <CalcHeader locale={locale} />

      {phase === 'submitted' || phase === 'timeout' ? (
        <ResultScreen
          finalScore={finalScore!}
          target={draw.target}
          pseudo={pseudo}
          phase={phase}
          date={draw.date}
          locale={locale}
        />
      ) : (
        <>
          <LcdScreen
            target={draw.target}
            expression={calcState.expression}
            displayValue={displayValue}
            isUrgent={isUrgent}
            isResultState={isResultState}
            targetLabel={t('targetLabel')}
            resultHint={t('resultHint')}
          />
          {phase === 'playing' && <Timer secondsLeft={secondsLeft} isUrgent={isUrgent} label={t('timeLabel')} />}
          <NumberPad
            drawNumbers={draw.numbers}
            usedIndices={calcState.usedIndices}
            intermediates={calcState.intermediates}
            usedIntermediateIds={calcState.usedIntermediateIds}
            onNumber={handleNumber}
            onIntermediate={handleIntermediate}
            onOperator={handleOperator}
            onEqual={handleEqual}
            onStore={handleStore}
            onDelete={handleDelete}
            onReset={handleReset}
            disabled={padDisabled}
            isResultState={isResultState}
          />
        </>
      )}

      {phase === 'pseudo' && (
        <PseudoOverlay pseudo={pseudo} onChange={setPseudo} onStart={() => {
          if (pseudo.trim()) setPhase('playing');
        }} />
      )}
    </div>
  );
}
