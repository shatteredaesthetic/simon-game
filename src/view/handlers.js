import { status, wrongGuess } from '../utils';

function correct(data, send) {
  send('game:playSelect', data);
  send('game:advanceGuess', null);
}

function incorrect(send) {
  wrongGuess();
  send('game:newMessage', "Nope, Listen!");
  send('game:changeStatus', { status: status.PLAYING });
  send('game:resetCurrent', null);
  setTimeout(() => { send('game:playSeq', null); }, 1500);
}

function incorrectStrict(send) {
  wrongGuess();
  send('game:newMessage', "You're Wrong and You're Finished.");
  send('game:changeStatus', { status: status.STOPPED });
  setTimeout(() => { send('game:newGame', null); }, 3000);
}

export function makeGuess(state, send, e) {
  e.preventDefault();
  let classes = e.target.classList;
  if(classes.contains("game")) {
    let idx = state.game.sequence[state.game.current],
        data = {
          note: { pitch: state.game.quadrants[idx].note },
          el: e.target,
          color: state.game.quadrants[idx].color
        };

    if(classes.contains(state.game.quadrants[idx].color)) {
      correct(data, send);
    } else {
      if(!state.game.strict) {
        incorrect(send);
      } else {
        incorrectStrict(send);
      }
    }
  }
}

export function toggleStrict(send, e) {
  e.preventDefault();
  send('game:switchStrict', null);
}

export function resetGame(send, e) {
  e.preventDefault();
  send('game:newGame', null);
}
