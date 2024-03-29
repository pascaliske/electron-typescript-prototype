import { Service } from 'typedi'
import { app, shell, Event, BrowserWindow } from 'electron'
import { Observable, fromEvent } from 'rxjs'
import { first, takeUntil, concatMap, tap } from 'rxjs/operators'
import { Actions } from 'models/actions'
import { Dispatcher } from 'services/dispatcher'
import { Notifications } from 'services/notifications'
import { Navigations } from 'services/navigations'
import { checkDestination } from './install'
import { createWindow } from './window'

/**
 * Application lifecycle service.
 */
@Service()
export class Application {
    /**
     *
     */
    public constructor(
        private dispatcher: Dispatcher,
        private notifications: Notifications,
        private navigations: Navigations,
    ) {}

    /**
     * Lifecycle {@link Observable} for the "quit" event.
     *
     * @returns - An {@link Observable} of an simple {@link Event}.
     */
    public get quit$(): Observable<Event> {
        const quit$ = fromEvent(app, 'quit').pipe(
            first(),
            tap(() => {
                this.dispatcher.shutdown()
            }),
        )

        return quit$ as Observable<Event>
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
                this.dispatcher.watch(Actions.APP_QUIT).subscribe(() => app.quit())
                this.dispatcher.watch(Actions.WINDOW_HIDE).subscribe(() => window.hide())
                this.dispatcher.watch(Actions.WINDOW_SHOW).subscribe(() => window.show())
                this.dispatcher.watch(Actions.OPEN_URL).subscribe(url => shell.openExternal(url))
                this.dispatcher.watch(Actions.NOTIFICATION).subscribe(notification => {
                    this.notifications.send(notification)
                })

                this.navigations.setup()

                fromEvent(app, 'window-all-closed')
                    .pipe(takeUntil(this.quit$))
                    .subscribe(() => {
                        app.quit()
                    })
            }),
        )
    }
}
