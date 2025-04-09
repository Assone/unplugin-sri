import type { UnpluginFactory, UnpluginOptions } from 'unplugin'
import type { ComputeResourceType, HashAlgorithm, Options } from './types'

import { Buffer } from 'node:buffer'
import { createUnplugin } from 'unplugin'
import { calculate } from './utils/calculate'
import { mergeOptions } from './utils/options'

const RESOURCE_REGEXP = /<(?<tag>link|script)([^>]*) (?:href|src)=["'](?<filepath>[^"']*)["']([^>]*)>/g
const calculateDigest = (algorithm: HashAlgorithm) => (content: string | Buffer | Uint8Array): string => calculate(Buffer.from(content), algorithm)

function buildReplacementProcessor(algorithm: HashAlgorithm) {
  return (html: string, fileName: string, digest: string, resourceType: ComputeResourceType) => {
    switch (resourceType) {
      case 'link':
        return html.replace(
          new RegExp(`<link([^>]*)href=["']/?${fileName}["']([^>]*)>`, 'g'),
          `<link$1href="${fileName}" integrity="${algorithm}-${digest}"$2>`,
        )
      case 'script':
        return html.replace(
          new RegExp(`<script([^>]*)src=["']/?${fileName}["']([^>]*)>`, 'g'),
          `<script$1src="${fileName}" integrity="${algorithm}-${digest}"$2>`,
        )
    }
  }
}

export const unpluginFactory: UnpluginFactory<Options | undefined> = (
  options,
) => {
  const { algorithm = 'sha256', resourceType } = mergeOptions(options)
  const calculate = calculateDigest(algorithm)
  const replacementProcessor = buildReplacementProcessor(algorithm)
  const isNeedCalculate = (resourceType?.link || resourceType?.script) ?? false

  const rollupCompatiblePlugin: UnpluginOptions['rollup'] = {
    generateBundle: {
      order: 'post',
      async handler(_, bundle) {
        if (!isNeedCalculate)
          return

        const htmlFiles = Object.keys(bundle).filter(id => id.endsWith('.html'))
        if (!htmlFiles.length)
          return

        await Promise.all(htmlFiles.map(async (htmlFileId) => {
          const htmlFile = bundle[htmlFileId]

          if (htmlFile.type !== 'asset')
            return

          let html = htmlFile.source.toString()
          const match = html.matchAll(RESOURCE_REGEXP)

          await Promise.all(Array.from(match).map((match) => {
            const tag = match.groups?.tag as ComputeResourceType
            const fileName = match.groups?.filepath as string
            const output = bundle[fileName?.slice(1)]

            if (!output || !resourceType?.[tag])
              return Promise.resolve()

            const digest = calculate(output.type === 'chunk' ? output.code : output.source)

            html = replacementProcessor(html, fileName, digest, tag)

            return Promise.resolve()
          }))

          htmlFile.source = html
        }))
      },
    },
  }
  const webpackCompatiblePlugin: UnpluginOptions['webpack'] = (compiler) => {
    compiler.hooks.emit.tap('unplugin-sri', (compilation) => {
      for (const [filename, asset] of Object.entries(compilation.assets)) {
        if (!filename.endsWith('.html'))
          continue

        // 处理webpack的asset.source类型
        const source = asset.source()
        let html = Buffer.isBuffer(source)
          ? source.toString('utf-8')
          : source
        const matches = html.matchAll(RESOURCE_REGEXP)

        for (const match of matches) {
          const tag = match.groups?.tag as ComputeResourceType
          const fileName = match.groups?.filepath as string
          const assetPath = fileName.startsWith('/') ? fileName.slice(1) : fileName
          const targetAsset = compilation.getAsset(assetPath)

          if (!targetAsset || !resourceType?.[tag])
            continue

          const digest = calculate(
            targetAsset.source.source(),
          )

          html = replacementProcessor(html, fileName, digest, tag)
        }

        compilation.updateAsset(filename, new compiler.webpack.sources.RawSource(html))
      }
    })
  }

  return {
    name: 'unplugin-sri',
    rollup: rollupCompatiblePlugin,
    vite: rollupCompatiblePlugin,
    webpack: webpackCompatiblePlugin,
    rspack: webpackCompatiblePlugin as unknown as UnpluginOptions['rspack'],
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
