import Wad from 'web-audio-daw';

export function wrongGuess() {
  const a = [{pitch: 'Bb3'}, {pitch: 'E4', wait: 0.25}, {pitch: 'Bb3', wait: 0.5}, {pitch: 'E4', wait: 0.75}];
  a.forEach(o => { wrongNote.play(o); });
  setTimeout(() => { wrongNote.stop(); }, 1000);
}

export const player = new Wad({
  source: 'triangle',
  volume: 0.8,
  env: {
    attack: 0.015,
    delay: 0.0,
    sustain: 1.0,
    hold: 0.35,
    release: 0.135
  }
});

const wrongNote = new Wad({
  source: 'square',
  volume: 0.5,
  env: {
    attack: 0.015,
    delay: 0.0,
    sustain: 1.0,
    hold: 0.35,
    release: 0.135
  }
});


export const status = {
  WAITING: Symbol('waiting'),
  STOPPED: Symbol('stopped'),
  PLAYING: Symbol('playing')
};
