# lua-browser-repl

[https://seb-jones.github.io/lua-browser-repl](https://seb-jones.github.io/lua-browser-repl)

Basic Lua Interpreter that runs in the web browser.

[Emscripten](https://emscripten.org/) is used to compile the Lua source code into WebAssembly.

## Compiling

Requires Emscripten's `emcc` and `emmake` commands to be in your `PATH`.

First fetch and build the Lua source:

```sh
make libraries
```

Then build the actual web page:

```sh
make
```