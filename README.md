# Another OpenGL Loading Library

A basic OpenGL loading library for my own usage

## Usage

Use CMake to build and link

```cmake

add_subdirectory(agll)

target_link_libraries(<target> PRIVATE agll)
target_include_libraries(<target> PRIVATE agll/include)

```

Now use `agllLoad` and `agllUnload` to load/unload OpenGL:

```c
// 0 for ok, 1 is failed and 2 failed to load os opengl library (libOpenGL.so, opengl32.dll)
int result = agllLoad();
if(result == AGLL_RESULT_OK)
{
    // do OpenGL stuff here
    // (glClear, etc.)
}
// at end of runtime
agllUnload();
```

You can use `agllLoad2` to load OpenGL with a custom function loader callback thingy

```c
int result = agllLoad2(myOwnLoaderFunction);
// ...
```

## Building

You need:

- CMake
- NodeJS

CMake will run `./tools/gen_agll.mjs` and it does the following:

- fetch the OpenGL specification from Khronos
- generate function typedefs and declare enums of the OpenGL specifictation
- write to file `agll.gen.c`, `agll.gen.h`, `khrplatform.gen.h`

Then you can use it like any CMake library

### `gen_agll.mjs` usages

This script is a cli, following command line arguments are available:

- `force` - force to download the specification again
- `wgl` - include WGL specification (BROKEN RN)
- `glx` - include GLX specification (NOT TESTED)
- `windows` - alias for `wgl`
- `linux` - alias for `glx`

Just use it like this: `node ./tools/gen_agll.mjs force wgl ...`

## Licenses

This project is licensed under the [Nightly License](./LICENSE)

The Khronos specification is licensed under their [own license found online](https://www.khronos.org/legal/Khronos_Specification_Copyright_License_Header):

```LICENSE
Copyright 2025 The Khronos Group. 

This specification is protected by copyright laws and contains material proprietary 
to the Khronos Group, Inc. Except as described by these terms, it or any components 
may not be reproduced, republished, distributed, transmitted, displayed, broadcast 
or otherwise exploited in any manner without the express prior written permission 
of Khronos Group. 

Khronos Group grants a conditional copyright license to use and reproduce the 
unmodified specification for any purpose, without fee or royalty, EXCEPT no licenses 
to any patent, trademark or other intellectual property rights are granted under 
these terms. Parties desiring to implement the specification and make use of 
Khronos trademarks in relation to that implementation, and receive reciprocal patent 
license protection under the Khronos IP Policy must become Adopters and confirm the 
implementation as conformant under the process defined by Khronos for this 
specification; see https://www.khronos.org/adopters.

Khronos Group makes no, and expressly disclaims any, representations or warranties, 
express or implied, regarding this specification, including, without limitation: 
merchantability, fitness for a particular purpose, non-infringement of any 
intellectual property, correctness, accuracy, completeness, timeliness, and 
reliability. Under no circumstances will the Khronos Group, or any of its Promoters, 
Contributors or Members, or their respective partners, officers, directors, 
employees, agents or representatives be liable for any damages, whether direct, 
indirect, special or consequential damages for lost revenues, lost profits, or 
otherwise, arising from or in connection with these materials.

Vulkan is a registered trademark and Khronos, OpenXR, SPIR, SPIR-V, SYCL, WebGL, 
WebCL, OpenVX, OpenVG, EGL, COLLADA, glTF, NNEF, OpenKODE, OpenKCAM, StreamInput, 
OpenWF, OpenSL ES, OpenMAX, OpenMAX AL, OpenMAX IL, OpenMAX DL, OpenML and DevU are 
trademarks of the Khronos Group Inc. ASTC is a trademark of ARM Holdings PLC, 
OpenCL is a trademark of Apple Inc. and OpenGL and OpenML are registered trademarks 
and the OpenGL ES and OpenGL SC logos are trademarks of Hewlett Packard Enterprise 
used under license by Khronos. All other product names, trademarks, 
and/or company names are used solely for identification and belong to their 
respective owners.
```
