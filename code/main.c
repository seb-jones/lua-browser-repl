#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <lua.h>
#include <lauxlib.h>
#include <lualib.h>

lua_State *L = NULL;

/* assumes an error message is on the top of the stack */
void print_error()
{
    fprintf(stderr, "%s\n", lua_tostring(L, -1));

    lua_pop(L, 1);
}

void print_values_on_stack()
{
    int n = lua_gettop(L);

    if (n > 0) {
        luaL_checkstack(L, LUA_MINSTACK, "too many results to print");

        lua_getglobal(L, "print");

        lua_insert(L, 1);

        if (lua_pcall(L, n, 0, 0) != LUA_OK) print_error();
    }
}

void initialise_lua()
{
    L = luaL_newstate();

    luaL_openlibs(L);

    luaL_loadstring(L, "print('Welcome! This REPL is using ' .. _VERSION)");

    lua_pcall(L, 0, 0, 0);
}

int protected_parse(lua_State *L)
{
    const char *input = lua_tostring(L, 1);

    const char *s = lua_pushfstring(L, "return %s", input);

    luaL_loadstring(L, s);

    lua_remove(L, -2);

    if (lua_pcall(L, 0, LUA_MULTRET, 0)) print_error();

    /* Remove original input line from stack */
    lua_remove(L, 1);

    print_values_on_stack();

    return LUA_OK;
}

void parse(const char *input)
{
    lua_pushcfunction(L, &protected_parse);

    lua_pushstring(L, (void *)input);

    lua_pcall(L, 1, 0, 0);
}
