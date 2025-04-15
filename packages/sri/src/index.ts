import type { OutputAsset, OutputChunk } from 'rollup'
import type { UnpluginFactory, UnpluginOptions } from 'unplugin'
import type { ComputeResourceType, Options } from './types'

import { Buffer } from 'node:buffer'

import { createUnplugin } from 'unplugin'
import { calculateDigest } from './utils/calculate'
import { mergeOptions } from './utils/options'
import { extractResourceMatches, getReplacementContent } from './utils/regexp'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (
  options,
) => {
  const { algorithm = 'sha256' } = mergeOptions(options)
  const calculate = calculateDigest(algorithm)
  const replacementProcessor = getReplacementContent(algorithm)

  const processHtmlAssets = async (
    html: string,
    getAssetContent: (filePath: string) => string | Buffer | Uint8Array | undefined,
    replace: (newHtml: string) => void,
  ): Promise<void> => {
    const matches = extractResourceMatches(html)

    for (const match of matches) {
      if (!match.groups?.tag || !match.groups?.filepath)
        continue

      const tag = match.groups.tag as ComputeResourceType
      const fileName = match.groups.filepath
      const assetContent = getAssetContent(fileName)

      if (!assetContent)
        continue

      const digest = calculate(assetContent)

      html = replacementProcessor(html, fileName, digest, tag)
    }

    replace(html)
  }

  const rollupCompatiblePlugin: UnpluginOptions['rollup'] = {
    generateBundle: {
      order: 'post',
      async handler(_, bundle) {
        const htmlFiles = Object.entries(bundle).filter(([name]) => name.endsWith('.html'))

        await Promise.all(htmlFiles.map(async ([_htmlFileId, htmlFile]) => {
          if (htmlFile.type !== 'asset')
            return

          let html = htmlFile.source.toString()
          processHtmlAssets(html, (filePath) => {
            const output: OutputAsset | OutputChunk | undefined = bundle[filePath.replace(/^\//, '')]

            if (!output)
              return undefined

            return output.type === 'chunk' ? output.code : output.source
          }, newHtml => html = newHtml)
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
        const rawSource = asset.source()
        let html = Buffer.isBuffer(rawSource)
          ? rawSource.toString('utf-8')
          : rawSource

        processHtmlAssets(html, (filePath) => {
          const targetAsset = compilation.getAsset(filePath.replace(/^\//, ''))

          return targetAsset?.source.source()
        }, newHtml => html = newHtml)
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
