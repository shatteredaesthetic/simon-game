import { status } from '../utils';

export function addToSeq(state, data) {
  const newA = state.game.sequence.slice();
  newA.push(data.next);
  return { sequence: newA };
}

export function resetCurrent(state, data) {
  return { current: 0 };
}

export function changeStatus(state, data) {
  return { status: data.status };
}

export function incCurrent(state, data) {
  return { current: ++state.game.current };
}

export function switchStrict(state, data) {
  return { strict: !state.game.strict };
}

export function init(state, data) {
  return {
    sequence: [],
    strict: false
  };
}

export function changeMessage(state, data) {
  return { message: data.message };
}

export function winner(state, data) {
  return {
    message: "You are a Winner!",
    status: status.STOPPED
  };
}
