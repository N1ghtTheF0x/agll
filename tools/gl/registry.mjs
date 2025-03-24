// @ts-nocheck
import { readFileSync } from "node:fs"
import { OUTPUT_GL_JSON } from "./fetch-gl.mjs"
import { OUTPUT_WGL_JSON } from "./fetch-wgl.mjs"
import { OUTPUT_GLX_JSON } from "./fetch-glx.mjs"

/** @returns {GLRegistry} */
export function glregistry()
{
    return JSON.parse(readFileSync(OUTPUT_GL_JSON,"utf-8")).registry
}

/** @returns {GLRegistry} */
export function wglregistry()
{
    return JSON.parse(readFileSync(OUTPUT_WGL_JSON,"utf-8")).registry
}

/** @returns {GLRegistry} */
export function glxregistry()
{
    return JSON.parse(readFileSync(OUTPUT_GLX_JSON,"utf-8")).registry
}