import { EOL } from "node:os"
import { fetchGL } from "./gl/fetch-gl.mjs"
import { fetchKHR } from "./gl/fetch-khr.mjs"
import { fetchWGL } from "./gl/fetch-wgl.mjs"
import { getCommands } from "./gl/gen-commands.mjs"
import { getEnums } from "./gl/gen-enums.mjs"
import { getTypes } from "./gl/gen-types.mjs"
import { AGLL_C, AGLL_H } from "./gl/utils.mjs"
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { AGLL_INCLUDE_FOLDER, AGLL_SOURCE_FOLDER } from "./utils.mjs"
import { fetchGLX } from "./gl/fetch-glx.mjs"

await fetchGL()
await fetchWGL()
await fetchGLX()
await fetchKHR()

const agll_h = readFileSync(AGLL_H,"utf-8")
const agll_c = readFileSync(AGLL_C,"utf-8")

const types = getTypes()
const commands = getCommands()
const enums = getEnums()

const OPENGL_TYPES = [
    ...types,
    ...enums,
    ...commands.map((c) => c.build()),
    ...commands.map((c) => `AGLL_API extern ${c.name} agll_${c.realname};${EOL}#define ${c.realname} agll_${c.realname}`)
].join(EOL)
const agll_gen_h = agll_h
.replace("//{{OPENGL_TYPES}}",OPENGL_TYPES)
.replaceAll("//#include","#include")
const HEADER_PATH = resolve(AGLL_INCLUDE_FOLDER,"agll","agll.gen.h")
mkdirSync(dirname(HEADER_PATH),{recursive: true})
if(existsSync(HEADER_PATH))
    rmSync(HEADER_PATH)
writeFileSync(HEADER_PATH,agll_gen_h,"ascii")

const OPENGL_DECLARE = [
    ...commands.map((c) => `${c.name} agll_${c.realname} = 0;`)
].join(EOL)

const OPENGL_CONTENT = [
    ...commands.map((c) => `agll_${c.realname} = (${c.name})loader("${c.realname}");`),
    "return 0;"
].join(EOL + "    ")

const agll_gen_c = agll_c
.replace("//{{OPENGL_DECLARE}}",OPENGL_DECLARE)
.replace("//{{OPENGL_CONTENT}}",OPENGL_CONTENT)
.replace('#include "agll.h"','#include <agll/agll.gen.h>')
const SOURCE_PATH = resolve(AGLL_SOURCE_FOLDER,"agll.gen.c")
mkdirSync(dirname(SOURCE_PATH),{recursive: true})
if(existsSync(SOURCE_PATH))
    rmSync(SOURCE_PATH)
writeFileSync(SOURCE_PATH,agll_gen_c,"ascii")

console.info("generated AGLL")