import type { Options } from '../types'

export const DEFAULT_OPTIONS: Options = {
  algorithm: 'sha256',
  resourceType: {
    script: true,
    link: true,
  },
  crossOrigin: false,
}

export function mergeOptions(userOptions?: Options): Options {
  return {
    ...DEFAULT_OPTIONS,
    ...userOptions,
  }
}
