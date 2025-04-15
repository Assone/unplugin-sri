import type { HashAlgorithm } from '../types'

import { Buffer } from 'node:buffer'

import { calculateSha256, calculateSha384, calculateSha512 } from '@unplugin-sri/algorithm-sha'

const digestCache = new Map<Buffer<ArrayBuffer>, string>()

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

export function calculateDigest(algorithm: HashAlgorithm) {
  return (content: string | Buffer | Uint8Array): string => {
    const buffer = Buffer.from(content)

    if (digestCache.has(buffer)) {
      return digestCache.get(buffer)!
    }

    const digest = calculate(buffer, algorithm)
    digestCache.set(buffer, digest)

    return digest
  }
}
