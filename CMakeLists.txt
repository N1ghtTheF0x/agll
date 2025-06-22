cmake_minimum_required(VERSION 3.30)

project(agll)

find_program(NODEJS_EXE_PATH node REQUIRED)

execute_process(COMMAND ${NODEJS_EXE_PATH} "--run" "build" WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/tools)

if(${CMAKE_SYSTEM_NAME} STREQUAL "Linux")
    set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fPIC")
endif()

find_package(OpenGL REQUIRED)

add_library(${PROJECT_NAME} SHARED
    source/agll.gen.c
)
target_include_directories(${PROJECT_NAME} PRIVATE include ${OPENGL_INCLUDE_DIRS})
target_link_libraries(${PROJECT_NAME} PRIVATE ${OPENGL_LIBRARIES})
set_target_properties(
    ${PROJECT_NAME}
    PROPERTIES
    OUTPUT_NAME AGLL
    POSITION_INDEPENDENT_CODE TRUE
    WINDOWS_EXPORT_ALL_SYMBOLS TRUE
)

add_custom_command(TARGET ${PROJECT_NAME} PRE_BUILD COMMAND ${NODEJS_EXE_PATH} "--run" "build" WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/tools)

if(${PROJECT_SOURCE_DIR} STREQUAL ${CMAKE_SOURCE_DIR})
    add_executable(${PROJECT_NAME}_version tests/version.c)
    target_link_libraries(${PROJECT_NAME}_version PRIVATE ${PROJECT_NAME})
    target_include_directories(${PROJECT_NAME}_version PRIVATE include)
    
    find_package(X11)
    if(X11_FOUND)
        target_link_libraries(${PROJECT_NAME}_version PRIVATE ${X11_LIBRARIES} ${OPENGL_LIBRARIES})
        target_include_directories(${PROJECT_NAME}_version PRIVATE ${X11_INCLUDE_DIR} ${OPENGL_INCLUDE_DIRS})
    endif()
endif()