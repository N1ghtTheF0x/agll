import { dirname, resolve } from "node:path"
import { TOOLS_FOLDER } from "../utils.mjs"
import { existsSync, mkdirSync, write, writeFileSync } from "node:fs"
import { FORCE, INCLUDE_WGL } from "../args.mjs"
import { XMLParser } from "fast-xml-parser"

export const WGL_XML_URL = "https://github.com/KhronosGroup/OpenGL-Registry/raw/refs/heads/main/xml/wgl.xml"
export const OUTPUT_WGL_XML = resolve(TOOLS_FOLDER,"wgl.xml")
export const OUTPUT_WGL_JSON = resolve(TOOLS_FOLDER,"wgl.json")

export async function fetchWGL()
{
    if(!INCLUDE_WGL) return
    if(!existsSync(OUTPUT_WGL_XML) || FORCE)
    {
        const response = await fetch(WGL_XML_URL)
        const data = Buffer.from(await response.arrayBuffer())
        writeFileSync(OUTPUT_WGL_XML,data)
        const object = new XMLParser({ignoreAttributes: false}).parse(data)
        writeFileSync(OUTPUT_WGL_JSON,JSON.stringify(object,null,4))
    }
}