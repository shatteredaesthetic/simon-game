import * as effects from './effects';
import * as reducers from './reducers';
import { status } from '../utils';

const model = {
  namespace: 'game',
  state: {
    quadrants: [
      { color: 'green', note: 'A3' },
      { color: 'red', note: 'E4' },
      { color: 'yellow', note: 'C4' },
      { color: 'blue', note: 'G4' }
    ],
    sequence: [],
    current: 0,
    status: status.STOPPED,
    strict: false,
    message: "Click Play to Start"
  },
  reducers: reducers,
  effects: effects
};

export default model;
