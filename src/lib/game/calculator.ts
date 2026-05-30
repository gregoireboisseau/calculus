export type Operator = '+' | '-' | '×' | '÷';

export interface Intermediate {
  id: number;
  value: number;
}

export interface CalcState {
  accumulator: number | null;
  pendingOp: Operator | null;
  input: string;
  usedIndices: number[];
  expression: string;
  done: boolean;
  error: string | null;
  intermediates: Intermediate[];
  usedIntermediateIds: number[];
  nextIntermediateId: number;
}

export function initCalcState(): CalcState {
  return {
    accumulator: null,
    pendingOp: null,
    input: '',
    usedIndices: [],
    expression: '',
    done: false,
    error: null,
    intermediates: [],
    usedIntermediateIds: [],
    nextIntermediateId: 0,
  };
}

export function pressNumber(state: CalcState, value: number, index: number): CalcState {
  if (state.done) return state;
  if (state.usedIndices.includes(index)) return state;
  if (state.input !== '') return state;

  return {
    ...state,
    input: String(value),
    usedIndices: [...state.usedIndices, index],
    expression: state.expression
      ? `${state.expression} ${state.pendingOp ?? ''} ${value}`.trim()
      : String(value),
    error: null,
  };
}

export function pressIntermediate(state: CalcState, value: number, id: number): CalcState {
  if (state.done) return state;
  if (state.usedIntermediateIds.includes(id)) return state;
  if (state.input !== '') return state;

  return {
    ...state,
    input: String(value),
    usedIntermediateIds: [...state.usedIntermediateIds, id],
    expression: state.expression
      ? `${state.expression} ${state.pendingOp ?? ''} ${value}`.trim()
      : String(value),
    error: null,
  };
}

export function pressOperator(state: CalcState, op: Operator): CalcState {
  if (state.done) return state;
  if (state.input === '' && state.accumulator === null) return state;

  const currentNum = state.input !== '' ? Number(state.input) : null;

  let newAccumulator: number;
  if (state.accumulator === null || currentNum === null) {
    newAccumulator = currentNum ?? state.accumulator ?? 0;
  } else {
    const result = applyOp(state.accumulator, state.pendingOp!, currentNum);
    if (result === null) {
      return { ...state, error: 'Division non entière' };
    }
    newAccumulator = result;
  }

  return {
    ...state,
    accumulator: newAccumulator,
    pendingOp: op,
    input: '',
    error: null,
  };
}

export function pressEqual(state: CalcState): CalcState {
  if (state.done) return state;

  // Result state — nothing left to compute → submit
  if (state.input === '' && state.pendingOp === null && state.accumulator !== null) {
    return { ...state, done: true };
  }

  if (state.input === '') return state;

  const currentNum = Number(state.input);

  if (state.accumulator === null) {
    return { ...state, accumulator: currentNum, input: '', expression: String(currentNum), error: null };
  }

  const result = applyOp(state.accumulator, state.pendingOp!, currentNum);
  if (result === null) {
    return { ...state, error: 'Division non entière' };
  }

  // Intermediate result — keep playing
  return {
    ...state,
    accumulator: result,
    input: '',
    pendingOp: null,
    done: false,
    error: null,
  };
}

// Save current result as a reusable tile, then reset working state
export function pressStore(state: CalcState): CalcState {
  if (state.done) return state;
  if (state.accumulator === null) return state;
  if (state.input !== '' || state.pendingOp !== null) return state;

  return {
    ...state,
    intermediates: [
      ...state.intermediates,
      { id: state.nextIntermediateId, value: state.accumulator },
    ],
    nextIntermediateId: state.nextIntermediateId + 1,
    accumulator: null,
    pendingOp: null,
    input: '',
    expression: '',
    error: null,
  };
}

export function pressDelete(state: CalcState): CalcState {
  if (state.done) return state;
  if (state.input === '' && state.usedIndices.length === 0 && state.usedIntermediateIds.length === 0) return state;

  if (state.input !== '') {
    const prevUsed = state.usedIndices.slice(0, -1);
    const prevUsedIntermediate = state.usedIntermediateIds.slice(0, -1);
    const exprParts = state.expression.split(' ');
    const newExpression = exprParts.length <= 1
      ? ''
      : exprParts.slice(0, state.accumulator !== null ? -2 : -1).join(' ');

    return {
      ...state,
      input: '',
      usedIndices: prevUsed,
      usedIntermediateIds: prevUsedIntermediate,
      expression: newExpression,
      error: null,
    };
  }

  return state;
}

export function pressReset(): CalcState {
  return initCalcState();
}

export function getDisplayValue(state: CalcState): number | null {
  if (state.input !== '') return Number(state.input);
  return state.accumulator;
}

function applyOp(a: number, op: Operator, b: number): number | null {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '×': return a * b;
    case '÷':
      if (b === 0 || a % b !== 0) return null;
      return a / b;
  }
}
