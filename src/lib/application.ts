import { app, shell, Event, BrowserWindow } from 'electron'
import { Container, Service } from 'typedi'
import { Observable, fromEvent } from 'rxjs'
import { first, takeUntil, concatMap, tap } from 'rxjs/operators'
import { checkDestination } from './install'
import { createWindow } from './window'
import { Actions } from './models/actions'
import { Dispatcher } from './dispatcher'
import { Navigations } from './navigations'

/**
 * Application lifecycle service.
 */
@Service()
export class Application {
    /**
     *
     */
    public constructor(private dispatcher: Dispatcher) {}

    /**
     * Lifecycle {@link Observable} for the "quit" event.
     *
     * @returns - An {@link Observable} of an simple {@link Event}.
     */
    public get quit$(): Observable<Event> {
        return fromEvent<Event>(app, 'quit').pipe(
            first(),
            tap(() => {
                this.dispatcher.shutdown()
            }),
        )
    }

    /**
     * Lifecycle {@link Observable} for the "ready" event.
     *
     * @returns - An {@link Observable} of the {@link BrowserWindow}.
     */
    public get ready$(): Observable<BrowserWindow> {
        return fromEvent(app, 'ready').pipe(
            takeUntil(this.quit$),
            concatMap(() => checkDestination()),
            concatMap(() => createWindow()),
            tap(window => {
                Container.get(Navigations).setup()

                this.dispatcher.watch(Actions.APP_QUIT).subscribe(() => app.quit())
                this.dispatcher.watch(Actions.WINDOW_HIDE).subscribe(() => window.hide())
                this.dispatcher.watch(Actions.WINDOW_SHOW).subscribe(() => window.show())
                this.dispatcher.watch(Actions.OPEN_URL).subscribe(url => shell.openExternal(url))

                fromEvent<Event>(app, 'window-all-closed')
                    .pipe(takeUntil(this.quit$))
                    .subscribe(() => {
                        app.quit()
                    })
            }),
        )
    }
}
