import { Service } from 'typedi'
import { ipcMain, ipcRenderer } from 'electron'
import { Observable, Subject } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { Actions } from 'models/actions'

/**
 *
 */
@Service({ global: true })
export class Dispatcher {
    /**
     * Internal queue for dispatched actions.
     */
    private stream$: Subject<{ type: Actions; payload: any }> = new Subject()

    /**
     * Init dispatcher service and connect ipc communication.
     */
    public constructor() {
        if (!this.isRenderer()) {
            ipcMain.on('actions', (_, [type, payload]: [Actions, any?]) => {
                this.stream$.next({ type, payload })
            })
        }
    }

    /**
     * Dispatch an action.
     *
     * @param type - The action type
     * @param payload - Optional payload for the dispatched action
     */
    public dispatch<A extends Actions, P = any>(type: A, payload?: P): void {
        if (this.isRenderer()) {
            ipcRenderer.send('actions', [type, ...(payload ? [payload] : [])])
        } else {
            this.stream$.next({ type, payload })
        }
    }

    /**
     * Watch for action events.
     *
     * @param type - The action type to watch for
     * @returns - An {@link Observable} with all events for the given action type
     */
    public watch<A extends Actions, P = any>(type: A): Observable<P> {
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

    /**
     * Checks if script is currently ran in renderer process.
     */
    private isRenderer(): boolean {
        return require('is-electron-renderer')
    }
}
