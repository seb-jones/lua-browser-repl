#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <lua.h>
#include <lauxlib.h>
#include <lualib.h>

lua_State *L = NULL;

/* Prints error message at the top of the stack and then pops it */
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
    /* Allocate a copy of the input string and then pop it from the stack */
    char *input;
    {
        size_t length;

        const char *s = luaL_tolstring(L, 1, &length);

        input = malloc(length + 1);

        strcpy(input, s);

        /* Pop the original input argument and the string created by luaL_tolstring */
        lua_pop(L, 2);
    }

    /* Try running as an expression that returns a result first */
    int error;
    {
        const char *s = lua_pushfstring(L, "return %s", input);

        luaL_loadstring(L, s);

        /* Remove the string created by lua_pushfstring to the stack */
        lua_remove(L, -2);

        error = lua_pcall(L, 0, LUA_MULTRET, 0);
    }

    /* Try running code as a statement if 'return' expression fails */
    if (error != LUA_OK) {
        /* Remove the error from the failed 'return' expression first */
        lua_pop(L, 1);

        error = luaL_dostring(L, input);
    }

    if (error == LUA_OK)
        print_values_on_stack();
    else
        print_error();

    return LUA_OK;
}

void parse(const char *input)
{
    lua_pushcfunction(L, &protected_parse);

    lua_pushstring(L, (void *)input);

    lua_pcall(L, 1, 0, 0);
}
