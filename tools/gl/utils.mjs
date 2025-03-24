import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const thisfolder = dirname(fileURLToPath(import.meta.url))
export const AGLL_C = resolve(thisfolder,"agll.c")
export const AGLL_H = resolve(thisfolder,"agll.h")