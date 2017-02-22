import html from 'choo/html';
import { status } from '../utils';
import { toggleStrict, resetGame, makeGuess } from './handlers';

function quad(quadrant) {
  return html`
    <div class="quad">
      <div class="btn game ${quadrant.color}"></div>
    </div>
  `;
}

function ctrlBtns(state, send) {
  return html`
    <div class="btn-row">
      <div class="ctrl-btn" onclick=${e => resetGame(send, e)}>
        <i class="fa fa-2x ${state.game.status === status.STOPPED ? "fa-play" : "fa-refresh"}"></i>
      </div>
      <div class="ctrl-btn ${state.game.strict ? "ctrl-btn-on" : ""}" onclick=${e => toggleStrict(send, e)}>
        <i class="fa fa-2x fa-exclamation-circle"></i>
      </div>
    </div>
  `;
}

function control(state, send) {
  return html`<div class="btn ctrl">
    <div class="ctrl-char">${state.game.sequence.length}</div>
    <div class="ctrl-char">Simon</div>
    <div class="message">${state.game.message}</div>
    ${ctrlBtns(state, send)}
  </div>`;
}

function container(state, send, content) {
  return html`<div class="container" onclick=${e => makeGuess(state, send, e)}>
    ${content}
  </div>`;
}

export default function view(state, prev, send) {
  let content = state.game.quadrants.map(quad);
  content.push(control(state, send));
  return container(state, send, content);
}
