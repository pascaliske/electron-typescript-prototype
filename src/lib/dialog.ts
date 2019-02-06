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
    public confirm(options: DialogOptions): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                if (options.window) {
                    const { window } = pick(options, ['window'])

                    dialog.showMessageBox(window, omit(options, ['window']), index => {
                        resolve(index === 0)
                    })
                } else {
                    dialog.showMessageBox(omit(options, ['window']), index => {
                        resolve(index === 0)
                    })
                }
            } catch (error) {
                reject(error)
            }
        })
    }
}
