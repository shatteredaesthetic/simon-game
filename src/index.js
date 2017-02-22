import choo from 'choo';
import model from './model';
import view from './view';
const app = choo();

app.model(model);

app.router([
  ['/', view]
]);

const tree = app.start();
document.body.appendChild(tree);
