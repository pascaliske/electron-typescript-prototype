import { Menu } from 'electron'
import { appMenu } from 'electron-util'
import { Service } from 'typedi'
import { Shortcuts } from './models/shortcuts'
import { Actions } from './models/actions'
import { Dispatcher } from './dispatcher'

/**
 *
 */
@Service()
export class Navigations {
    /**
     *
     */
    private static SEPARATOR: any = { type: 'separator' }

    /**
     *
     */
    public constructor(private dispatcher: Dispatcher) {}

    /**
     *
     */
    public setup(): void {
        Menu.setApplicationMenu(this.buildMenu())
    }

    /**
     *
     */
    private buildMenu(): Menu {
        return Menu.buildFromTemplate([
            appMenu([
                {
                    label: 'Preferences...',
                    accelerator: Shortcuts.SETTINGS,
                    click: () => this.dispatcher.dispatch(Actions.OPEN_PREFERENCES),
                },
            ]),
            {
                label: 'File',
                submenu: [
                    {
                        role: 'close',
                    },
                ],
            },
            {
                role: 'editMenu',
            },
            {
                label: 'View',
                submenu: [
                    {
                        role: 'reload',
                    },
                    {
                        role: 'forcereload',
                    },
                    Navigations.SEPARATOR,
                    {
                        role: 'resetzoom',
                    },
                    {
                        role: 'zoomin',
                    },
                    {
                        role: 'zoomout',
                    },
                    Navigations.SEPARATOR,
                    {
                        role: 'togglefullscreen',
                    },
                ],
            },
            {
                role: 'windowMenu',
            },
            {
                role: 'help',
                submenu: [
                    {
                        label: 'Learn More',
                        click: () => {
                            this.dispatcher.dispatch(Actions.OPEN_URL, 'https://electronjs.org')
                        },
                    },
                    {
                        label: 'Report Issue',
                        click: () => {
                            this.dispatcher.dispatch(Actions.OPEN_URL, `${REPOSITORY}/issues/new`)
                        },
                    },
                    Navigations.SEPARATOR,
                    {
                        label: 'View License',
                        click: () => {
                            this.dispatcher.dispatch(
                                Actions.OPEN_URL,
                                `${REPOSITORY}/blob/master/LICENSE.md`,
                            )
                        },
                    },
                    Navigations.SEPARATOR,
                    {
                        role: 'toggledevtools',
                    },
                ],
            },
        ])
    }
}
