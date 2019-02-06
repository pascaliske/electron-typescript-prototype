import { Notification, NotificationConstructorOptions, Event } from 'electron'
import { Service } from 'typedi'
import { Observable, fromEvent } from 'rxjs'

export interface NotificationActions {
    show$: Observable<Event>
    close$: Observable<Event>
    action$: Observable<Event>
    click$: Observable<Event>
    reply$: Observable<Event>
    close: () => void
}

/**
 *
 */
@Service()
export class Notifications {
    /**
     * Sends a notification to the user.
     *
     * @param body - The body for the notification
     */
    public send(options: NotificationConstructorOptions): NotificationActions {
        const notification = new Notification({ ...options, title: APP_NAME })

        notification.show()

        return {
            show$: fromEvent(notification, 'show'),
            close$: fromEvent(notification, 'close'),
            action$: fromEvent(notification, 'action'),
            click$: fromEvent(notification, 'click'),
            reply$: fromEvent(notification, 'reply'),
            close: () => notification.close(),
        }
    }
}
