# lua-browser-repl

[https://seb-jones.github.io/lua-browser-repl](https://seb-jones.github.io/lua-browser-repl)

Basic Lua Interpreter that runs in the web browser.

[Emscripten](https://emscripten.org/) is used to compile the Lua source code into WebAssembly.

## Compiling

Requires Emscripten's `emcc` and `emmake` commands to be in your `PATH`. Building is as simple as:

```sh
make
```

That will download and build the Lua source if it isn't already built, and then build the web page.
