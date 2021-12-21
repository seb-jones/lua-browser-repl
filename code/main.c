#include <ctype.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include <strings.h>
#include <lua.h>
#include <lauxlib.h>
#include <lualib.h>

void parse(char *input)
{
    lua_State *L = luaL_newstate();

    luaL_openlibs(L);

    int error = luaL_loadstring(L, input) || lua_pcall(L, 0, 0, 0);

    if (error) {
        fprintf(stderr, "%s\n", lua_tostring(L, -1));
        lua_pop(L, 1);
    }

    // cache test

    lua_close(L);
}
