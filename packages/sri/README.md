# unplugin-sri-inject

[![NPM version](https://img.shields.io/npm/v/unplugin-sri-inject?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-sri-inject)

`unplugin-sri-inject` is a plugin that injects the [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) (SRI) attribute into the HTML files.

## Features

- Support for Vite, Rollup, Webpack, Nuxt, Vue CLI, and others
- Support various hashing algorithms (e.g., SHA-256, SHA-384, SHA-512)

## Install

```bash
# npm
npm i unplugin-sri-inject

# pnpm
pnpm add unplugin-sri-inject

# yarn
yarn add unplugin-sri-inject
```

## Usage

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import SRI from 'unplugin-sri-inject/vite'

export default defineConfig({
  plugins: [
    SRI({ /* options */ }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import SRI from 'unplugin-sri-inject/rollup'

export default {
  plugins: [
    SRI({ /* options */ }),
  ],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-sri-inject/webpack')({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    ['unplugin-sri-inject/nuxt', { /* options */ }],
  ],
})
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-sri-inject/webpack')({ /* options */ }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import SRI from 'unplugin-sri-inject/esbuild'

build({
  plugins: [SRI()],
})
```

<br></details>

## Options

```ts
import type { Options } from 'unplugin-sri-inject/types'

const options: Options = {
  /* ... */
}
```
