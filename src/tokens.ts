import { Container, Token } from 'typedi'

// declare tokens
export const IS_RENDERER = new Token<() => boolean>('is-electron-renderer')

// set token values
Container.set(IS_RENDERER, () => require('is-electron-renderer'))
