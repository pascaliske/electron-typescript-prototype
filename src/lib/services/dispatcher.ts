import { Service } from 'typedi'
import { Observable, Subject } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { Actions } from 'models/actions'

/**
 *
 */
interface Action<P = any> {
    type: Actions
    payload: P
}

/**
 *
 */
@Service()
export class Dispatcher {
    /**
     *
     */
    private stream$: Subject<Action> = new Subject()

    /**
     * Dispatch an action.
     *
     * @param type - The action type
     * @param payload - Optional payload for the dispatched action
     */
    public dispatch<P = any>(type: Actions, payload?: P): void {
        this.stream$.next({ type, payload })
    }

    /**
     * Watch for action events.
     *
     * @param type - The action type to watch for
     * @returns - An {@link Observable} with all events for the given action type
     */
    public watch(type: Actions): Observable<any> {
        return this.stream$.pipe(
            filter(event => event.type === type),
            map(event => event.payload),
        )
    }

    /**
     * Cancels all active actions watchers and prevents dispatching new actions.
     */
    public shutdown(): void {
        this.stream$.complete()
    }
}
