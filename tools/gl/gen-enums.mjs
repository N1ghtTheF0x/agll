import { existsSync, rmSync, writeFileSync } from "node:fs"
import { EOL } from "node:os"
import { HeaderBuilder } from "../cpp/header.mjs"
import { TYPES_FILEPATH } from "./gen-types.mjs"
import { glregistry, glxregistry, wglregistry } from "./registry.mjs"
import { AGLL_INCLUDE_FOLDER, resolveOA } from "../utils.mjs"
import { resolve } from "node:path"
import { DefineMacroBuilder } from "../cpp/macro.mjs"
import { INCLUDE_GLX, INCLUDE_WGL } from "../args.mjs"

export const ENUMS_FILEPATH = "Enums.gen.hpp"
export const WGLENUMS_FILEPATH = "WGL" + ENUMS_FILEPATH

/**
 * @param {GLRegistry} registry 
 */
function get_enums(registry)
{
    const mapper = (/** @type {GLEnum}*/e) => 
    {
        if(typeof e.enum === "undefined")
            return null
        const values = resolveOA(e.enum)
        const results = []
        for(const value of values)
        {
            const vname = value["@_name"]
            const vvalue = value["@_value"]
            results.push(
                new DefineMacroBuilder()
                .setName(vname)
                .setValue(vvalue)
                .setCheck(true)
            )
        }
        return results
    }
    const enums = registry.enums.map(mapper)
    .filter((a) => a != null)
    .map((b) => b.map((m) => m.build()))
    .map((str) => str.join(EOL))
    return enums
}
/**
 * @param {GLRegistry} registry 
 * @param {string} filepath 
 */
function generate_enums(registry,filepath)
{
    const enums_content = new HeaderBuilder()
    .setName(`GL_${filepath.substring(0,filepath.indexOf(".")).toUpperCase()}`)
    .addInclude(TYPES_FILEPATH,true)
    .build(get_enums(registry).join(EOL))

    const path = resolve(AGLL_INCLUDE_FOLDER,filepath)
    if(existsSync(path))
        rmSync(path)
    writeFileSync(path,enums_content,"utf-8")
}

export function getEnums()
{
    const enums = get_enums(glregistry())
    if(INCLUDE_WGL)
        enums.push(...get_enums(wglregistry()))
    if(INCLUDE_GLX)
        enums.push(...get_enums(glxregistry()))
    return enums
}

export function generateEnums()
{
    generate_enums(glregistry(),ENUMS_FILEPATH)
    if(INCLUDE_WGL)
        generate_enums(wglregistry(),WGLENUMS_FILEPATH)
}