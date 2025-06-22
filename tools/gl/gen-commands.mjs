import { EOL, type } from "node:os"
import { glregistry, glxregistry, wglregistry } from "./registry.mjs"
import { AGLL_INCLUDE_FOLDER, resolveOA } from "../utils.mjs"
import { TypeDefFunctionBuilder } from "../cpp/typedef.mjs"
import { HeaderBuilder } from "../cpp/header.mjs"
import { TYPES_FILEPATH } from "./gen-types.mjs"
import { existsSync, rmSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { INCLUDE_GLX, INCLUDE_WGL, TARGET_SYSTEM_WINDOWS } from "../args.mjs"

export const COMMANDS_FILEPATH = "Commands.gen.hpp"

/**
 * @param {string} str 
 * @param {string} char 
 */
function count_char(str,char)
{
    let count = 0
    for(const c of str)
        if(c == char) count++
    return count
}

export function getCommands()
{
    const mapper = (/** @type {GLCommand} */ command) =>
    {
        const name = command.proto.name
        let retType = command.proto["#text"] ?? command.proto.ptype
        if(typeof retType !== "string")
            throw new Error(`no return type for '${name}'`)
        if(typeof command.proto["@_kind"] === "string")
        {
            switch(command.proto["@_kind"])
            {
                case "String":
                    retType = "const GLubyte*"
                    break
            }
        }
        command.proto
        const params = resolveOA(command.param ?? [])
        const tdef = new TypeDefFunctionBuilder()
        .setName(name)
        .setReturnType(retType)
        .setPrename("AGLL_APIENTRY*")
        for(const param of params)
        {
            let type = param.ptype ?? param["#text"]
            if(typeof type !== "string")
                throw new Error(`no type for '${name}'`)
            const text = param["#text"]
            if(typeof text == "string")
            {
                const ptrs = count_char(text,"*")
                const etype = text.replaceAll("const","").replaceAll("*","")
                if(etype.length > 0)
                    type = etype
                if(text.includes("const"))
                    type = "const " + type
                type += "*".repeat(ptrs)
            }
            tdef.addArgument(type,param.name)
        }
        return tdef
    }
    const cmds = glregistry().commands.command.map(mapper)
    if(INCLUDE_WGL)
        cmds.push(...wglregistry().commands.command.map(mapper))
    if(INCLUDE_GLX)
        cmds.push(...glxregistry().commands.command.map(mapper))
    return cmds
}

export function generateCommands()
{
    const commands = getCommands().map((cmd) =>
    {
        return [
            cmd.build(),
            `extern ${cmd.name} ${cmd.realname};`
        ].join(EOL)
    })
    
    const commands_content = new HeaderBuilder()
    .setName("GL_COMMANDS")
    .addNamespace("OpenGL")
    .addNamespace("Commands")
    .addInclude(TYPES_FILEPATH,true)
    .build(commands.join(EOL))
    
    const path = resolve(AGLL_INCLUDE_FOLDER,COMMANDS_FILEPATH)
    if(existsSync(path))
        rmSync(path)
    writeFileSync(path,commands_content,"utf-8")
}