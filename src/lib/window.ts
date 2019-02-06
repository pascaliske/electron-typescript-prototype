import { BrowserWindow } from 'electron'
import { Container } from 'typedi'
import { Observable } from 'rxjs'

/**
 * Global window instance to prevent GC.
 */
let window: BrowserWindow = null

/**
 * Creates a new window with the given dimensions.
 *
 * @param width - The window width
 * @param height - The window height
 * @returns - An {@link Observable} containing the {@link BrowserWindow}
 */
export function createWindow(
    title: string = APP_NAME,
    width: number = 1920,
    height: number = 1080,
): Observable<BrowserWindow> {
    return new Observable<BrowserWindow>(observer => {
        // return existing window
        if (window !== null) {
            observer.next(window)
            observer.complete()
            return
        }

        // create window
        window = new BrowserWindow({
            title,
            width,
            height,
            show: false,
            center: true,
            webPreferences: {
                nodeIntegration: true,
            },
        })

        // inject window into container
        Container.set(BrowserWindow, window)

        // load contents
        window.loadFile('index.html')

        // register event handlers
        window.on('close', () => (window = null))
        window.webContents.on('did-finish-load', () => {
            window.show()
            observer.next(window)
            observer.complete()
        })
    })
}
