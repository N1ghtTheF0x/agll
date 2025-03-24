// 

import { dirname, resolve } from "node:path"
import { TOOLS_FOLDER } from "../utils.mjs"
import { existsSync, mkdirSync, write, writeFileSync } from "node:fs"
import { FORCE, INCLUDE_GLX } from "../args.mjs"
import { XMLParser } from "fast-xml-parser"

export const GLX_XML_URL = "https://raw.githubusercontent.com/KhronosGroup/OpenGL-Registry/refs/heads/main/xml/glx.xml"
export const OUTPUT_GLX_XML = resolve(TOOLS_FOLDER,"glx.xml")
export const OUTPUT_GLX_JSON = resolve(TOOLS_FOLDER,"glx.json")

export async function fetchGLX()
{
    if(!INCLUDE_GLX) return
    if(!existsSync(OUTPUT_GLX_XML) || FORCE)
    {
        const response = await fetch(GLX_XML_URL)
        const data = Buffer.from(await response.arrayBuffer())
        writeFileSync(OUTPUT_GLX_XML,data)
        const object = new XMLParser({ignoreAttributes: false}).parse(data)
        writeFileSync(OUTPUT_GLX_JSON,JSON.stringify(object,null,4))
    }
}