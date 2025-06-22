#include "agll.h"

static int load_lib();
static void unload_lib();
static void* get_p(const char* name);
static int load_p(p_agll_get loader);

#if defined(_WIN32)
    #ifndef WIN32_LEAN_AND_MEAN
        #define WIN32_LEAN_AND_MEAN
    #endif
    #include <windows.h>
    typedef PROC (WINAPI* p_agll_wgl_get)(LPCSTR name);
    static HMODULE opengl32;
    static p_agll_wgl_get agll_wgl_get;
    static int load_lib()
    {
        opengl32 = LoadLibrary(TEXT("opengl32.dll"));
        if(!opengl32)
            return AGLL_RESULT_LIBRARY_FAIL;
        agll_wgl_get = (p_agll_wgl_get)GetProcAddress(opengl32,"wglGetProcAddress");
        if(!agll_wgl_get)
            return AGLL_RESULT_LIBRARY_FAIL;
        return AGLL_RESULT_OK;
    }
    static void unload_lib()
    {
        FreeLibrary(opengl32);
    }
    static void* get_p(const char* name)
    {
        void* p = (void*)agll_wgl_get(name);
        if(!p)
            p = (void*)GetProcAddress(opengl32,name);
        return p;
    }
#elif defined(__linux__)
    #include <dlfcn.h>
    #include <GL/glx.h>
    typedef void* (*p_all_glx_get)(const char *name);
    static void* opengl;
    static p_all_glx_get agll_glx_get;
    static int load_lib()
    {
        opengl = dlopen("libGL.so",RTLD_LAZY | RTLD_GLOBAL);
        if(!opengl)
            return AGLL_RESULT_LIBRARY_FAIL;
        agll_glx_get = (p_all_glx_get)dlsym(opengl,"glXGetProcAddress");
        if(!agll_glx_get)
            return AGLL_RESULT_LIBRARY_FAIL;
        return AGLL_RESULT_OK;
    }
    static void* get_p(const char* name)
    {
        void* p = glXGetProcAddress((const GLubyte*)name);
        if(!p)
            p = dlsym(opengl,name);
        if(!p)
            p = agll_glx_get(name);
        return p;
    }
    static void unload_lib()
    {
        dlclose(opengl);
    }
#elif defined(__APPLE__)
    #error Oh you want Apple support? WELL YOU AIN'T GETTING IT FROM ME! EITHER CREATE A PULL REQUEST, IMPLEMENT IT OR CRY IN THE CORNER!
#else
    #error Your environment does not support OpenGL
#endif

//{{OPENGL_DECLARE}}

int agllLoad()
{
    int result = AGLL_RESULT_UNDEFINED;
    result = load_lib();
    if(result) return result;
    return agllLoad2(get_p);
}
int agllLoad2(p_agll_get loader)
{
    return load_p(loader);
}
void agllUnload()
{
    unload_lib();
}
void* agllGet(const char* name)
{
    return get_p(name);
}

static int load_p(p_agll_get loader)
{
    //{{OPENGL_CONTENT}}
    return AGLL_RESULT_OK;
}