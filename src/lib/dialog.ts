import { BrowserWindow, dialog, MessageBoxOptions } from 'electron'
import { Service } from 'typedi'
import pick from 'lodash-es/pick'
import omit from 'lodash-es/omit'

/**
 *
 */
export interface DialogOptions extends MessageBoxOptions {
    window?: BrowserWindow
}

/**
 *
 */
@Service()
export class Dialog {
    /**
     *
     */
    public async confirm(options: DialogOptions): Promise<boolean> {
        try {
            if (options.window) {
                const { window } = pick(options, ['window'])
                const index = await dialog.showMessageBox(window, omit(options, ['window']))

                return index.response === 0
            } else {
                const index = await dialog.showMessageBox(omit(options, ['window']))
                return index.response === 0
            }
        } catch (error) {
            throw error
        }
    }
}
