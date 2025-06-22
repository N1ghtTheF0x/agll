#include <stdio.h>
#include <agll/agll.gen.h>

#if defined(_WIN32)
    #error TODO: make this work
#elif defined(__linux__)

#include <X11/Xlib.h>
#include <GL/glx.h>

static Display* dis = NULL;
static Window win = None;
static XVisualInfo* visualInfo = NULL;
static GLXContext ctx = NULL;

void loadContext()
{
    dis = XOpenDisplay(NULL);
    Window root = DefaultRootWindow(dis);
    GLint attr[] = {
        GLX_RGBA, GLX_DEPTH_SIZE, 24,
        GLX_DOUBLEBUFFER, None
    };
    visualInfo = glXChooseVisual(dis,0,attr);
    Colormap cmap = XCreateColormap(dis,root,visualInfo->visual,AllocNone);
    XSetWindowAttributes swa;
    swa.colormap = cmap;
    swa.event_mask = ExposureMask | KeyPressMask;
    win = XCreateWindow(dis,root,0,0,1280,720,0,visualInfo->depth,InputOutput,visualInfo->visual,CWColormap | CWEventMask,&swa);
    ctx = glXCreateContext(dis,visualInfo,NULL,GL_TRUE);
    glXMakeCurrent(dis,win,ctx);
}

void unloadContext()
{
    glXMakeCurrent(dis,None,NULL);
    glXDestroyContext(dis,ctx);
    XDestroyWindow(dis,win);
    XCloseDisplay(dis);
}

#endif

int main(int argc,char** argv)
{
    loadContext();
    int error = agllLoad();
    if(error)
    {
        printf("failed to load AGLL: %i",error);
        return 1;
    }

    printf("vendor: %s\n",glGetString(GL_VENDOR));
    printf("renderer: %s\n",glGetString(GL_RENDERER));
    printf("version: %s",glGetString(GL_VERSION));
    printf("shading language version: %s\n",glGetString(GL_SHADING_LANGUAGE_VERSION));
    GLint exts = 0;
    glGetIntegerv(GL_NUM_EXTENSIONS,&exts);
    printf("extensions: %i\n\n",exts);
    for(GLint i = 0;i < exts;i++)
        printf("%s, ",glGetStringi(GL_EXTENSIONS,i));

    unloadContext();
    agllUnload();
    return 0;
}