import { EOL } from "node:os"
/** @typedef {`#include "${string}"`} */
export const LocalIncludeMacro = null
/** @typedef {`#include <${string}>`} */
export const IncludeMacro = null
/** @typedef {LocalIncludeMacro | IncludeMacro} */
export const AnyIncludeMacro = null

export class IncludeMacroBuilder
{
    /** @type {string | undefined} */
    #path
    get path(){return this.#path}
    /** @type {boolean} */
    #local = false
    get local(){return this.#path}
    /** @param {string} path */
    setPath(path)
    {
        this.#path = path
        return this
    }
    /** @param {boolean} local */
    setLocal(local)
    {
        this.#local = local
        return this
    }
    /** @returns {AnyIncludeMacro} */
    build()
    {
        return this.#local ? `#include "${this.#path}"` : `#include <${this.#path}>`
    }
}

export class DefineMacroBuilder
{
    /** @type {string | undefined} */
    #name
    get name(){return this.#name}
    /** @type {string | undefined} */
    #value
    get value(){return this.#value}
    #check = false
    get check(){return this.#check}
    /** @param {string} name */
    setName(name)
    {
        this.#name = name
        return this
    }
    /** @param {string} value */
    setValue(value)
    {
        this.#value = value
        return this
    }
    /** @param {boolean} check */
    setCheck(check)
    {
        this.#check = check
        return this
    }
    /** @param {string | undefined} inside  */
    build(inside = undefined)
    {
        const define = typeof this.#value === "string" ? `#define ${this.#name} ${this.#value}` : `#define ${this.#name}`
        if(this.#check)
        {
            const block = [
                `#ifndef ${this.#name}`,
                define
            ]
            if(typeof inside === "string")
                block.push(inside)
            block.push("#endif")
            return block.join(EOL)
        }
        return define
    }
}