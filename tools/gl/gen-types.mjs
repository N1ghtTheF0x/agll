import { existsSync, rmSync, writeFileSync } from "node:fs"
import { HeaderBuilder } from "../cpp/header.mjs"
import { KHR_PLATFORM_PATH } from "./fetch-khr.mjs"
import { glregistry, glxregistry, wglregistry } from "./registry.mjs"
import { EOL } from "node:os"
import { resolve } from "node:path"
import { INCLUDE_GLX, INCLUDE_WGL } from "../args.mjs"
import { AGLL_INCLUDE_FOLDER } from "../utils.mjs"

export const TYPES_FILEPATH = "Types.gen.hpp"

// DECLAREmHandle();

export function getTypes()
{
    const filter = (/** @type {unknown} */ a) => typeof a === "string"
    const mapper = (/** @type {GLType} */type) =>
    {
        const name = type.name
        if(name === "_GPU_DEVICE")
            return type["#text"].replace("struct","struct _GPU_DEVICE").replace("\n",EOL)
        if(type["#text"] === "#include <KHR/khrplatform.h>")
            return
        if(type["#text"] === "DECLAREmHandle();")
            return `DECLAREmHandle(${name});`
        if(typeof name !== "string")
            return type["#text"]
        const comment = typeof type["@_comment"] === "string" ? `/** ${type["@_comment"]} */${EOL}` : ""
        const def = type["#text"]
        if(def.includes("(*)"))
        {
            return comment + def.replace("(*)",`(*${name})`)
        }
        if(def == "DECLARE_HANDLE();")
        {
            return comment + `DECLARE_HANDLE(${name});`
        }
        if(def.endsWith("*;"))
        {
            return comment + def.replace("*;",`* ${name};`)
        }
        if(def.startsWith("typedef struct") || def.startsWith("typedef union"))
        {
            return comment + def.replace("};",`} ${name};`)
        }
        return comment + def.replace(";",` ${name};`)
    }
    const types = glregistry().types.type.map(mapper).filter(filter)
    if(INCLUDE_GLX)
        types.push(
            ...glxregistry().types.type.map(mapper).filter(filter)
        )
    if(INCLUDE_WGL)
        types.push(
            ...wglregistry().types.type.map(mapper).filter(filter)
        )
    return types
}

export function generateTypes()
{
    
    const types_content = new HeaderBuilder()
    .setName("GL_TYPES")
    .addInclude(KHR_PLATFORM_PATH,true)
    .addNamespace("OpenGL")
    .addNamespace("Types")
    if(INCLUDE_WGL)
        types_content.addInclude("Windows.h",false)
    if(INCLUDE_GLX)
        types_content.addInclude("X11/Xlib.h",false)
    const path = resolve(AGLL_INCLUDE_FOLDER,TYPES_FILEPATH)
    if(existsSync(path))
        rmSync(path)
    writeFileSync(path,types_content.build(getTypes().join(EOL)),"utf-8")
}