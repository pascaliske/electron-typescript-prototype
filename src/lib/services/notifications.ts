import { Service } from 'typedi'
import { Notification, NotificationConstructorOptions, Event } from 'electron'
import { Observable, fromEvent } from 'rxjs'

export type NotificationOptions = Omit<NotificationConstructorOptions, 'title'>
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
    public send(options: NotificationOptions): NotificationActions {
        const notification = new Notification({ ...options, title: APP_NAME })

        notification.show()

        return {
            show$: fromEvent(notification, 'show') as Observable<Event>,
            close$: fromEvent(notification, 'close') as Observable<Event>,
            action$: fromEvent(notification, 'action') as Observable<Event>,
            click$: fromEvent(notification, 'click') as Observable<Event>,
            reply$: fromEvent(notification, 'reply') as Observable<Event>,
            close: () => notification.close(),
        }
    }
}
