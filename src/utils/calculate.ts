import type { HashAlgorithm } from '../types'

import { calculateSha256, calculateSha384, calculateSha512 } from '@unplugin-sri/algorithm-sha'

export function calculate(data: Uint8Array, algorithm: HashAlgorithm): string {
  switch (algorithm) {
    case 'sha256':
      return calculateSha256(data)
    case 'sha384':
      return calculateSha384(data)
    case 'sha512':
      return calculateSha512(data)
  }
}
