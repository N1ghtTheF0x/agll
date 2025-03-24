export const FORCE = process.argv.includes("force")
export const TARGET_SYSTEM_WINDOWS = process.argv.includes("windows")
export const TARGET_SYSTEM_LINUX = process.argv.includes("linux")
export const INCLUDE_WGL = process.argv.includes("wgl") || TARGET_SYSTEM_WINDOWS
export const INCLUDE_GLX = process.argv.includes("glx") || TARGET_SYSTEM_LINUX