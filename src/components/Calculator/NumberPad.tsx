import type { Intermediate, Operator } from '@/lib/game/calculator';

interface NumberPadProps {
  drawNumbers: number[];
  usedIndices: number[];
  intermediates: Intermediate[];
  usedIntermediateIds: number[];
  onNumber: (val: number, idx: number) => void;
  onIntermediate: (val: number, id: number) => void;
  onOperator: (op: Operator) => void;
  onEqual: () => void;
  onStore: () => void;
  onDelete: () => void;
  onReset: () => void;
  disabled: boolean;
  isResultState: boolean;
}

const OPERATORS: Operator[] = ['+', '-', '×', '÷'];

export function NumberPad({
  drawNumbers,
  usedIndices,
  intermediates,
  usedIntermediateIds,
  onNumber,
  onIntermediate,
  onOperator,
  onEqual,
  onStore,
  onDelete,
  onReset,
  disabled,
  isResultState,
}: NumberPadProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Intermediate results — only shown when at least one exists */}
      {intermediates.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {intermediates.map(({ id, value }) => {
            const used = usedIntermediateIds.includes(id);
            return (
              <button
                key={id}
                className={`btn-key btn-o${used ? ' is-pressed' : ''}`}
                onClick={() => onIntermediate(value, id)}
                disabled={disabled || used}
                style={{ height: 40, fontSize: 14, flex: '1 1 auto', minWidth: 48 }}
                aria-label={`Résultat intermédiaire ${value}`}
              >
                {value}
              </button>
            );
          })}
        </div>
      )}

      {/* Separator — only shown when intermediates exist */}
      {intermediates.length > 0 && (
        <div style={{ height: 1, background: 'var(--calc-lo)', opacity: 0.3 }} />
      )}

      {/* Draw numbers — 2 rows of 3 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {drawNumbers.map((num, idx) => {
          const used = usedIndices.includes(idx);
          return (
            <button
              key={idx}
              className={`btn-key btn-n${used ? ' is-pressed' : ''}`}
              onClick={() => onNumber(num, idx)}
              disabled={disabled || used}
              style={{ height: 50, fontSize: 16 }}
              aria-label={`Nombre ${num}`}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* Operators */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {OPERATORS.map((op) => (
          <button
            key={op}
            className="btn-key btn-o"
            onClick={() => onOperator(op)}
            disabled={disabled}
            style={{ height: 44, fontSize: 18 }}
            aria-label={`Opérateur ${op}`}
          >
            {op}
          </button>
        ))}
      </div>

      {/* Action row: DEL | STO | = | RAZ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 1fr', gap: 8 }}>
        <button
          className="btn-key btn-d"
          onClick={onDelete}
          disabled={disabled}
          style={{ height: 50, fontSize: 12 }}
          aria-label="Supprimer"
        >
          DEL
        </button>
        <button
          className="btn-key btn-o"
          onClick={onStore}
          disabled={disabled || !isResultState}
          style={{ height: 50, fontSize: 11, letterSpacing: '0.05em', opacity: isResultState ? 1 : 0.35 }}
          aria-label="Mémoriser le résultat"
          title="Mémoriser ce résultat comme tuile"
        >
          STO
        </button>
        <button
          className="btn-key btn-e"
          onClick={onEqual}
          disabled={disabled}
          style={{ height: 50, fontSize: 22, letterSpacing: 0 }}
          aria-label="Calculer ou soumettre"
        >
          =
        </button>
        <button
          className="btn-key btn-d"
          onClick={onReset}
          disabled={disabled}
          style={{ height: 50, fontSize: 11 }}
          aria-label="Recommencer"
        >
          RAZ
        </button>
      </div>
    </div>
  );
}
