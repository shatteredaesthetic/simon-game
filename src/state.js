import { player, status, newSeq, getQuads, randomPraise, keyFrames } from './utils'

const reset = {
  sequence: [],
  current: 0,
  strict: false,
  message: "Good luck!"
}

export default function gameStore(state, emitter) {
  state.quadrants = [
    { color: 'green', note: 'A3' },
    { color: 'red', note: 'E4' },
    { color: 'yellow', note: 'C4' },
    { color: 'blue', note: 'G4' }
  ]
  state.sequence = []
  state.current = 0
  state.status = status.STOPPED
  state.strict = false
  state.message = "Click Play to Start"

  emitter.on('toggleStrict', toggleStrict)
  emitter.on('resetGame', resetGame)
  emitter.on('newGame', newGame)
  emitter.on('nextRound', nextRound)
  emitter.on('playSeq', playSeq)
  emitter.on('playSelect', playSelect)
  emitter.on('incorrect', incorrect)
  emitter.on('incorrectStrict', incorrectStrict)

  function toggleStrict() {
    state = { ...state, strict: !state.strict }
    emitter.emit('render')
  }

  function resetGame() {
    state = { ...state, ...reset }
    emitter.emit('render')
  }

  function newGame() {
    state = { ...state, ...reset }
    nextRound(state, emit)
  }

  function nextRound() {
    state.sequence.length === 20 ? endGame() : advanceRound()
  }

  function playSeq() {
    getQuads(state).forEach(q => {
      const el = document.querySelector(`.${q.color}`)
      playSelect({ note: q.note, el, color: q.color })
    })
    setTimeout(() => {
      state = { ...state, status: status.WAITING }
    }, 500 * state.game.sequence.length + 1000)
  }

  function incorrect() {
    state = {
      ...state,
      current: 0,
      status: status.PLAYING,
      message: "Nope, Listen!"
    }
    emitter.emit('render')
  }

  function incorrectStrict() {
    state = {
      ...state,
      status: status.STOPPED,
      message: "You're Wrong and You're Finished."
    }
    emitter.emit('render')
  }

  function advanceGuess(state, data, send, done) {

    if(state.game.sequence.length - state.game.current === 1) {
      state = { ...state, message: randomPraise() }
      setTimeout(() => { nextRound() }, 500)
    } else {
      state = { ...state, current: current + 1 }
    }
  }

  function advanceRound() {
    state = {
      ...state,
      status: status.PLAYING,
      current: 0,
      sequence: newSeq(state.sequence)
    }
    playSeq()
    emitter.emit('render')
  }

  function endGame() {
    state = { ...state, message: "You are a Winner!", status: status.STOPPED }
    setTimeout(() => { send('newGame', null, done) }, 5000)
    emitter.emit('render')
  }

  function playSelect({ el, note, color }) {
    player.play(note)
    setTimeout(() => { el.animate(keyFrames(color), { duration: 500 }) }, note.wait * 1000)
  }
}
