import 'reflect-metadata'
import { BrowserWindow } from 'electron'
import { Container } from 'typedi'
import { Application } from './lib/application'

/**
 * Startup.
 */
Container.get(Application).ready$.subscribe((window: BrowserWindow) => {
    if (ENVIRONMENT === 'development') {
        console.log('==>', VERSION, ENVIRONMENT)

        window.webContents.openDevTools({
            mode: 'detach',
        })
    }
})

/**
 * Safely shut down.
 */
Container.get(Application).quit$.subscribe(() => {
    if (ENVIRONMENT === 'development') {
        console.log('==> quit')
    }
})
