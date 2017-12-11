import choo from 'choo'
import gameStore from './state'
import view from './view'

const app = choo()
app.use(gameStore)
app.route('/', view)
app.mount('body')
