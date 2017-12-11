import html from 'choo/html';
import { status, wrongGuess } from './utils';

function correct(data, emit) {
  emit('playSelect', data)
  emit('advanceGuess')
}

function incorrect(emit) {
  wrongGuess()
  emit('incorrect')
  setTimeout(() => { emit('playSeq') }, 1500)
}

function incorrectStrict(emit) {
  wrongGuess()
  emit('incorrectStrict')
  setTimeout(() => { emit('newGame') }, 3000)
}

function quad(quadrant) {
  return html`
    <div class="quad">
      <div class="btn game ${quadrant.color}"></div>
    </div>
  `
}

function ctrlBtns(state, emit) {
  return html`
    <div class="btn-row">
      <div class="ctrl-btn" onclick=${e => playGame(state, e)}>
        <i class="fa fa-2x ${state.status === status.STOPPED ? "fa-play" : "fa-refresh"}"></i>
      </div>
      <div class="ctrl-btn ${state.strict ? "ctrl-btn-on" : ""}" onclick=${e => toggleStrict(e)}>
        <i class="fa fa-2x fa-exclamation-circle"></i>
      </div>
    </div>
  `

  function toggleStrict(e) {
    e.preventDefault()
    emit('switchStrict')
  }

  function playGame(state, e) {
    e.preventDefault()
    state.status === status.STOPPED ? emit('resetGame') : emit('newGame')
  }
}

function control(state, emit) {
  return html`<div class="btn ctrl">
    <div class="ctrl-char">${state.sequence.length}</div>
    <div class="ctrl-char">Simon</div>
    <div class="message">${state.message}</div>
    ${ctrlBtns(state, emit)}
  </div>`
}

function container(state, emit, content) {
  return html`<body class="container" onclick=${e => makeGuess(e)}>
    ${content}
  </body>`

  function makeGuess(e) {
    e.preventDefault()
    const idx = state.sequence[state.current]
    const color = state.quadrants[idx].color
    const data = {
      note: { pitch: state.quadrants[idx].note },
      el: e.target,
      color
    }
    e.target.classList.contains(color) ?
      correct(data, emit) :
      state.strict ?
        incorrectStrict(emit) :
        incorrect(emit)
  }
}

export default function view(state, emit) {
  let content = state.quadrants.map(quad)
  content.push(control(state, emit))
  return container(state, emit, content)
}
