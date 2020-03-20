import { Container } from 'typedi'
import { app } from 'electron'
import { Observable, from, of, EMPTY } from 'rxjs'
import { concatMap } from 'rxjs/operators'
import { Dialog } from 'services/dialog'

/**
 *
 */
export function checkDestination(): Observable<boolean> {
    if (ENVIRONMENT !== 'production' || app.isInApplicationsFolder()) {
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
