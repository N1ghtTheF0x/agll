import { EOL } from "node:os"
import { HeaderBuilder } from "../cpp/header.mjs"
import { existsSync, rmSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { NIGHTSDK_SOURCE_FOLDER } from "../utils.mjs"
import { getCommands } from "./gen-commands.mjs"

export const OPENGL_CPP_FILEPATH = "opengl.gen.cpp"

export function generateCode()
{
    const commands = getCommands()
    const declare_commands = commands.map((cmd) =>
    {
        return `${cmd.name} ${cmd.realname} = nullptr;`
    })
    const init_commands = commands.map((cmd) =>
    {
        return `Commands::${cmd.realname} = (Commands::${cmd.name})loader("${cmd.realname}");`
    })
    const cpp_content = [
        "namespace Commands",
        "{",
        ...declare_commands,
        "}",
        "",
        "void Context::init(OpenGLLoader loader)",
        "{",
        ...init_commands,
        "}"
    ].join(EOL)
    const content = new HeaderBuilder()
    .addInclude("NightSDK/OpenGL/Commands.gen.hpp",false)
    .addInclude("NightSDK/OpenGL/Context.hpp",false)
    .addNamespace("OpenGL")
    .get(cpp_content)
    const path = resolve(NIGHTSDK_SOURCE_FOLDER,OPENGL_CPP_FILEPATH)
    if(existsSync(path))
        rmSync(path)
    writeFileSync(path,content,"utf-8")
}