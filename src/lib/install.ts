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

    const confirm = (): Promise<boolean> => {
        return Container.get(Dialog).confirm({
            type: 'info',
            message: 'Not inside of the Applications folder.',
            buttons: ['Move', 'Cancel'],
        })
    }

    return from(confirm()).pipe(
        concatMap(confirmed => {
            if (confirmed) {
                app.moveToApplicationsFolder()
            }

            app.exit()

            return EMPTY
        }),
    )
}
