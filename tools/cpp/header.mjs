import { EOL } from "node:os"
import { AnyIncludeMacro, DefineMacroBuilder, IncludeMacroBuilder } from "./macro.mjs"

export class HeaderBuilder
{
    /** @type {string | undefined} */
    #name
    get name(){return this.#name}
    /** @type {Array<string>} */
    #nps = []
    get namespaces(){return this.#nps}
    /** @type {Array<AnyIncludeMacro>} */
    #includes = []
    get includes(){return this.#includes}
    /** @param {string} name  */
    setName(name)
    {
        this.#name = name
        return this
    }
    /** @param {string} np  */
    addNamespace(np)
    {
        this.#nps.push(np)
        return this
    }
    /** @param {string} path @param {boolean} local  */
    addInclude(path,local)
    {
        const macro = new IncludeMacroBuilder()
        .setPath(path)
        .setLocal(local)
        .build()
        this.#includes.push(macro)
        return this
    }
    /** @param {string} content  */
    build(content)
    {
        const n = this.#name?.toUpperCase()
        if(typeof n !== "string")
            throw new Error("'name' is undefined")
        return new DefineMacroBuilder()
        .setName(`__NIGHTSDK_GENERATED_${n}_HPP`)
        .setCheck(true)
        .build(["",this.get(content)].join(EOL))
    }
    /** @param {string} content  */
    get(content)
    {
        const namespaces = [
            "NightSDK",
            ...this.#nps
        ]
        const namespaceStart = namespaces.map((np) =>
        {
            return `namespace ${np}${EOL}{`
        }).join(EOL)
        return [
            ...this.#includes,
            "",
            namespaceStart,
            content,
            `}${EOL}`.repeat(namespaces.length),""
        ].join(EOL)
    }
}