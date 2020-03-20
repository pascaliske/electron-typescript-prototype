import 'reflect-metadata'
import { Container } from 'typedi'
import { BrowserWindow } from 'electron'
import { Application } from './lib/application'

/**
 * Startup.
 */
Container.get(Application).ready$.subscribe((window: BrowserWindow) => {
    console.log(VERSION)

    if (ENVIRONMENT === 'development') {
        window.webContents.openDevTools({ mode: 'detach', activate: true })
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
