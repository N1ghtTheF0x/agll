cmake_minimum_required(VERSION 3.30)

project(agll)

find_program(NODEJS_EXE_PATH node REQUIRED)

execute_process(COMMAND ${NODEJS_EXE_PATH} "--run" "build" WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/tools)

if(${CMAKE_SYSTEM_NAME} STREQUAL "Linux")
    set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fPIC")
endif()
add_library(${PROJECT_NAME} SHARED
    source/agll.gen.c
)
target_include_directories(${PROJECT_NAME} PRIVATE include)
set_target_properties(
    ${PROJECT_NAME}
    PROPERTIES
    OUTPUT_NAME AGLL
    POSITION_INDEPENDENT_CODE TRUE
    WINDOWS_EXPORT_ALL_SYMBOLS TRUE
)