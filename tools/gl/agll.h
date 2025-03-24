#ifndef __ANOTHER_OPENGL_LODER_H
#define __ANOTHER_OPENGL_LODER_H

//#include <KHR/khrplatform.gen.h>
#if __has_include(<X11/Xlib.h>)
    #include <X11/Xlib.h>
#endif

#ifndef AGLL_API
#define AGLL_API
#endif

#ifndef AGLL_APIENTRY
    #if defined(_WIN32)
        #define AGLL_APIENTRY __stdcall
    #elif defined(__linux__)
        #define AGLL_APIENTRY
    #endif
#endif

#ifndef __gl_h_
#define __gl_h_
#endif

#ifdef __cplusplus
extern "C" {
#endif

typedef void* (*p_agll_get)(const char* name);

#define AGLL_RESULT_UNDEFINED -1
#define AGLL_RESULT_OK 0
#define AGLL_RESULT_FAIL 1
#define AGLL_RESULT_LIBRARY_FAIL 2

AGLL_API int agllLoad();
AGLL_API int agllLoad2(p_agll_get loader);
AGLL_API void agllUnload();
AGLL_API void* agllGet(const char* name);

//{{OPENGL_TYPES}}

#ifdef __cplusplus
}
#endif

#endif