
/** @typedef {`typedef ${string} ${string};`} */
export const TypeDef = null
/** @typedef {`typedef ${string} (${string} ${string})(${string});`} */
export const TypeDefFunction = null

export class TypeDefBuilder
{
    /** @type {string | undefined} */
    #name
    get name(){return this.#name}
    /** @type {string | undefined} */
    #type
    get type(){return this.#type}
    /** @param {string} name  */
    setName(name)
    {
        this.#name = name
        return this
    }
    /** @param {string} type  */
    setType(type)
    {
        this.#type = type
        return this
    }
    /** @returns {TypeDef} */
    build()
    {
        return `typedef ${this.#type} ${this.#name};`
    }
}

export class TypeDefFunctionParameter
{
    name
    type
    comment
    /** @param {string} name @param {string} type @param {string} [comment=undefined]  */
    constructor(name,type,comment = undefined)
    {
        this.name = name
        this.type = type
        this.comment = comment
    }
}

export class TypeDefFunctionBuilder
{
    /** @type {`p_${string}` | undefined} */
    #name
    get name(){return this.#name}
    get realname(){return this.#name?.substring(2)}
    #prename = "*"
    get prename(){return this.#prename}
    /** @type {string | undefined} */
    #retType
    get retType(){return this.#retType}
    /** @type {Array<TypeDefFunctionParameter>} */
    #args = []
    get arguments(){return this.#args}
    /** @param {string} name */
    setName(name)
    {
        this.#name = `p_${name}`
        return this
    }
    /** @param {string} prename */
    setPrename(prename)
    {
        this.#prename = prename
        return this
    }
    /** @param {string} retType */
    setReturnType(retType)
    {
        this.#retType = retType
        return this
    }
    /** @param {string} name @param {string} type @param {string} [comment=undefined]  */
    addArgument(type,name,comment = undefined)
    {
        this.#args.push(new TypeDefFunctionParameter(name,type,comment))
    }
    /** @returns {TypeDefFunction} */
    build()
    {
        return `typedef ${this.#retType} (${this.#prename} ${this.#name})(${this.#args.map((arg) => `${arg.type} ${arg.name}`).join(", ")});`
    }
    toString()
    {
        return this.build()
    }
}