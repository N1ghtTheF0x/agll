import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { FORCE } from "../args.mjs"
import { AGLL_INCLUDE_FOLDER } from "../utils.mjs"

export const KHR_PLATFORM_URL = "https://registry.khronos.org/EGL/api/KHR/khrplatform.h"
export const KHR_PLATFORM_PATH = "khrplatform.gen.h"

export async function fetchKHR()
{
    const path = resolve(AGLL_INCLUDE_FOLDER,"KHR",KHR_PLATFORM_PATH)
    mkdirSync(dirname(path),{recursive: true})
    if(!existsSync(path) || FORCE)
    {
        const response = await fetch(KHR_PLATFORM_URL)
        const data = Buffer.from(await response.arrayBuffer())
        writeFileSync(path,data)
    }
}