import { Container } from 'typedi'
import { Dispatcher } from 'services/dispatcher'
import { Actions } from 'models/actions'

console.log('==>', VERSION)

document.addEventListener('click', () => {
    Container.get(Dispatcher).dispatch(Actions.NOTIFICATION, {
        body: 'Successfully clicked document!',
    })
})
