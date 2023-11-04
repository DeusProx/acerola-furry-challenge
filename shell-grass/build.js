#!/usr/bin/env node

import * as esbuild from 'esbuild'
import { glsl } from 'esbuild-plugin-glsl'

const isInArgv = term => process.argv.includes(term)
const getFlag = flag => isInArgv(`--${flag}`) || isInArgv(`-${flag[0]}`)

const isHelp = getFlag('help')
const isServing = getFlag('serve')
const isWatching = getFlag('watch')

if (isHelp) {
  const helpText =
`Usage: ./build.js <options>

Options:
  -h, --help       Show help
  -s, --serve      Start a file server
  -w, --watch      Watch for file changes
`
  console.log(helpText)
  process.exit()
}

const isDev = isWatching && isServing

const liveReload = () => new EventSource('/esbuild').addEventListener('change', () => location.reload())
const createBanner = (func) => '(' + func + ')()\n'
const liveReloadBanner = isDev ? createBanner(liveReload) : ''

const context = await esbuild.context({
  entryPoints: [ './src/app.ts'],
  outfile: './dist/app.js',
  bundle: true,
  treeShaking: true,
  minify: true,
  sourcemap: true,
  metafile: true,
  banner: { 'js': liveReloadBanner },
  logLevel: 'info',
  plugins: [
    glsl({ minify: !isDev }),
  ],
})

if (isWatching) {
  await context.watch()
} else {
  await context.rebuild()
  console.log('build finished')
}

if (isServing) {
  await context.serve({
    port: 3002,
    servedir: './',
  })
}

if (!isWatching && !isServing) {
  await context.dispose()
  console.log('exiting...')
}

