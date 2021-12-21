#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <lua.h>
#include <lauxlib.h>
#include <lualib.h>

lua_State *L = NULL;

void initialise_lua()
{
    L = luaL_newstate();

    luaL_openlibs(L);

    luaL_loadstring(L, "print('Welcome! This REPL is using ' .. _VERSION)");

    lua_pcall(L, 0, 0, 0);
}

void parse(char *input)
{
    int error = luaL_loadstring(L, input) || lua_pcall(L, 0, 0, 0);

    if (error) {
        fprintf(stderr, "%s\n", lua_tostring(L, -1));
        lua_pop(L, 1);
    }
}
