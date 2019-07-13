import { app } from 'electron'
import { Container } from 'typedi'
import { Observable, from, of, EMPTY } from 'rxjs'
import { concatMap } from 'rxjs/operators'
import { Dialog } from './dialog'

/**
 *
 */
export function checkDestination(): Observable<boolean> {
    if (app.isInApplicationsFolder() || ENVIRONMENT === 'development') {
        return of(true)
    }

    const confirmation: Observable<boolean> = from(
        Container.get(Dialog).confirm({
            type: 'info',
            message: 'Not inside of the Applications folder.',
            buttons: ['Move', 'Cancel'],
        }),
    )

    return confirmation.pipe(
        concatMap(confirmed => {
            if (confirmed) {
                app.moveToApplicationsFolder()
            }

            app.exit()

            return EMPTY
        }),
    )
}
