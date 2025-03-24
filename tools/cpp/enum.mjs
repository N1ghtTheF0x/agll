import { EOL } from "node:os"

export class Enum
{
    /** @readonly @type {string} */
    #name
    get name(){return this.#name}
    /** @type {string | undefined} */
    #extends
    get extends(){return this.#extends}
    /** @type {Map<string,string>} */
    #values = new Map
    get values(){return this.#values}
    /** @param {string} name */
    constructor(name)
    {
        this.#name = name
    }
    /** @param {string} name @param {string} value */
    addValue(name,value)
    {
        this.#values.set(name,value)
        return this
    }
    /** @param {string | undefined} extend  */
    setExtend(extend)
    {
        this.#extends = extend
        return this
    }
    build()
    {
        return [
            `enum struct ${this.#name}` + (typeof this.#extends === "string" ? ` : ${this.#extends}` : ""),
            "{",
            ...[...this.#values].map(([key,value]) => `${key} = ${value},`),
            "};"
        ].join(EOL)
    }
}