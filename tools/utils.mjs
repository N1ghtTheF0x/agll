import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

/** @template T @param {ObjectOrArray<T>} a @returns {Array<T>} */
export function resolveOA(a)
{
    return Array.isArray(a) ? a : [a]
}

export const TOOLS_FOLDER = dirname(fileURLToPath(import.meta.url))
export const AGLL_ROOT = resolve(TOOLS_FOLDER,"..")
export const AGLL_INCLUDE_FOLDER = resolve(AGLL_ROOT,"include")
export const AGLL_SOURCE_FOLDER = resolve(AGLL_ROOT,"source")