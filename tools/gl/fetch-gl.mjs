import { resolve } from "node:path"
import { FORCE } from "../args.mjs"
import { existsSync, writeFileSync } from "node:fs"
import { XMLParser } from "fast-xml-parser"
import { TOOLS_FOLDER } from "../utils.mjs"

export const GL_XML_URL = "https://raw.githubusercontent.com/KhronosGroup/OpenGL-Registry/refs/heads/main/xml/gl.xml"
export const OUTPUT_GL_XML = resolve(TOOLS_FOLDER,"gl.xml")
export const OUTPUT_GL_JSON = resolve(TOOLS_FOLDER,"gl.json")

export async function fetchGL()
{
    if(!existsSync(OUTPUT_GL_XML) || FORCE)
    {
        const response = await fetch(GL_XML_URL)
        const data = Buffer.from(await response.arrayBuffer())
        writeFileSync(OUTPUT_GL_XML,data)
        const object = new XMLParser({ignoreAttributes: false}).parse(data)
        writeFileSync(OUTPUT_GL_JSON,JSON.stringify(object,null,4))
    }
}