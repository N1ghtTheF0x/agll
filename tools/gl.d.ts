declare interface GLRegistry
{
    comment: string
    types: {type: Array<GLType>}
    kinds: [kind: Array<GLType>]
    enums: Array<GLEnum>
    commands: {command: Array<GLCommand>}
    feature: Array<GLFeature>
    extensions: {extension: Array<GLExtension>}
}

declare interface GLKind
{
    "@_name": string
    "@_desc": string
}

declare interface GLType
{
    name: string
    "#text": string
    "@_name"?: string
    "@_comment"?: string
    "@_requires"?: string
    apientry?: string
}

declare interface GLEnum
{
    enum?: ObjectOrArray<GLEnumValue>
    unused?: ObjectOrArray<GLEnumUnused>
    "@_namespace": string
    "@_group"?: string
    "@_type"?: string
    "@_comment"?: string
    "@_vendor"?: string
    "@_start"?: string
    "@_end"?: string
}

declare interface GLEnumValue
{
    "@_value": string
    "@_name": string
    "@_group"?: string
    "@_comment"?: string
    "@_alias"?: string
}

declare interface GLEnumUnused
{
    "@_start": string
    "@_end"?: string
    "@_comment"?: string
    "@_vendor"?: string
}

declare interface GLCommand
{
    proto: GLCommandProto
    param?: ObjectOrArray<GLCommandParameter>
    glx?: GLCommandGLX
    alias?: GLCommandAlias
}

declare interface GLCommandProto
{
    name: string
    "#text"?: string
    ptype?: string
    "@_kind"?: string
}

declare interface GLCommandParameter
{
    ptype?: string
    name: string
    "@_group"?: string
    "@_class"?: string
    "#text"?: string
    "@_len"?: string
    "@_kind"?: string
}

declare interface GLCommandGLX
{
    "@_type": string
    "@_opcode": string
}

declare interface GLCommandAlias
{
    "@_name": string
}

declare interface GLFeature
{
    require: ObjectOrArray<GLFeatureRequire>
    remove?: ObjectOrArray<GLFeatureRequire>
    "@_api": string
    "@_name": string
    "@_number": string
}

declare interface GLFeatureRequire
{
    type?: ObjectOrArray<GLFeatureRequireEntry>
    enum?: ObjectOrArray<GLFeatureRequireEntry>
    command?: ObjectOrArray<GLFeatureRequireEntry>
    "@_comment"?: string
}

declare interface GLFeatureRequireEntry
{
    "@_name": string
    "@_comment"?: string
}

declare interface GLExtension
{
    require?: ObjectOrArray<GLFeatureRequire>
    "@_name": string
    "@_supported": string
}