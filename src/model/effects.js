import { status, player } from '../utils';

function keyFrames(color) {
  return [
    { background: '#000', offset: 0 },
    { background: color, offset: 0.5 },
    { background: '#000', offset: 1 }
  ];
}

function randomPraise() {
  const praise = [ "Great Job!", "Awesome!", "You're on Fire!", "Unstoppable!", "Fantastical!"  ];
  let idx = Math.random() * 5 | 0;
  return praise[idx];
}

function getQuads(state) {
  return state.sequence.slice()
                       .map(i => state.game.quadrants[i])
                       .map((n, j) => ({ color: n.color, note: { pitch: n.note, wait: (j * 0.5) + 1 } }));
}

function endGame(send, done) {
  send('game:winner', null, done);
  send('game:changeMessage', { message: "You're a Winner!" }, done);
  setTimeout(() => { send('game:newGame', null, done); }, 5000);
}

function advanceRound(send, done) {
  send('game:changeStatus', { status: status.PLAYING }, done);
  send('game:addToSeq', { next: Math.random() * 4 | 0 }, done);
  send('game:resetCurrent', null, done);
  send('game:playSeq', null, done);
}

function nextRound(state, send, done) {
  if(state.game.sequence.length === 20) {
    endGame(send, done);
  } else {
    advanceRound(send, done);
  }
}

export function playSelect(state, data, send, done) {
  player.play(data.note);
  setTimeout(() => { data.el.animate(keyFrames(data.color), { duration: 500 }); }, data.note.wait * 1000);
}

export function playSeq(state, data, send, done) {
  getQuads(state).forEach(q => {
    const el = document.querySelector(`.${q.color}`);
    send('game:playSelect', { note: q.note, el: el, color: q.color }, done);
  });
  setTimeout(() => {
    send('game:changeStatus', { status: status.WAITING }, done);
  }, 500 * state.game.sequence.length + 1000);
}

export function advanceGuess(state, data, send, done) {
  if(state.game.sequence.length - state.game.current === 1) {
    send('game:newMessage', randomPraise(), done);
    setTimeout(() => { nextRound(state, send, done); }, 500);
  } else {
    send('game:incCurrent', null, done);
  }
}

export function newGame(state, data, send, done) {
  send('game:init', null, done);
  send('game:newMessage', "Good Luck!", done);
  nextRound(state, send, done);
}

export function newMessage(state, data, send, done) {
  send('game:changeMessage', { message: data }, done);
  setTimeout(() => { send('game:changeMessage', { message: "" }, done); }, 3000);
}
