import { readFile, writeFile } from 'node:fs/promises'

const handlerPath = '.open-next/server-functions/default/handler.mjs'
const handler = await readFile(handlerPath, 'utf8')

const instrumentationRequirePattern =
  /}catch\((\w+)\)\{if\(\(0,_iserror\.default\)\(\1\)&&\1\.code!=="ENOENT"&&\1\.code!=="MODULE_NOT_FOUND"&&\1\.code!=="ERR_MODULE_NOT_FOUND"\)throw \1}/

const replacement =
  '}catch($1){if($1?.message?.includes("Dynamic require of ")&&$1?.message?.includes("/.next/server/instrumentation.js"))return null;if((0,_iserror.default)($1)&&$1.code!=="ENOENT"&&$1.code!=="MODULE_NOT_FOUND"&&$1.code!=="ERR_MODULE_NOT_FOUND")throw $1}'

let patched = handler.replace(instrumentationRequirePattern, replacement)

if (
  patched === handler &&
  !handler.includes('/.next/server/instrumentation.js"))return null')
) {
  throw new Error('OpenNext instrumentation patch did not match the generated handler')
}

const cacheHandlersNeedle = 'async loadCustomCacheHandlers'
let cacheHandlersStart = patched.indexOf(cacheHandlersNeedle)
let patchedCacheHandlers = 0

if (cacheHandlersStart === -1) {
  throw new Error('OpenNext cache handlers patch did not match the generated handler')
}

while (cacheHandlersStart !== -1) {
  if (patched.slice(cacheHandlersStart).startsWith('async loadCustomCacheHandlers(){return}')) {
    cacheHandlersStart = patched.indexOf(cacheHandlersNeedle, cacheHandlersStart + cacheHandlersNeedle.length)
    continue
  }

  const cacheHandlersEnd = patched.indexOf('async getIncrementalCache', cacheHandlersStart)

  if (cacheHandlersEnd === -1) {
    throw new Error('OpenNext cache handlers patch did not match the generated handler')
  }

  patched =
    patched.slice(0, cacheHandlersStart) +
    'async loadCustomCacheHandlers(){return}' +
    patched.slice(cacheHandlersEnd)

  patchedCacheHandlers += 1
  cacheHandlersStart = patched.indexOf(cacheHandlersNeedle, cacheHandlersStart + cacheHandlersNeedle.length)
}

await writeFile(handlerPath, patched)
console.log(`Patched OpenNext Cloudflare runtime fallbacks (${patchedCacheHandlers} cache handler copies)`)
