# lua-browser-repl

[https://seb-jones.github.io/lua-browser-repl](https://seb-jones.github.io/lua-browser-repl)

Basic Lua Interpreter that runs in the web browser.

[Emscripten](https://emscripten.org/) is used to compile the Lua source code into WebAssembly.

## Compiling

Requires Emscripten's `emcc` and `emmake` commands to be in your `PATH`. Building is as simple as:

```sh
make
```

This will download and build the Lua source if it isn't already built, and then build the web page.

## Development

A local development server can be started by running:

```sh
npm start
```

This uses the [http-server](https://github.com/http-party/http-server) package to launch an HTTP server at `http://127.0.0.1:8080` with `./build` as the web root.

## Tests

Unit tests (using the [Mocha](https://mochajs.org/) runner) can be run with:

```sh
npm test
```

Alternatively they can be run in file-watching mode with:

```sh
npm run test:watch
```

End-to-end tests are implemented using [Cypress](https://docs.cypress.io/), which can be run using:

```sh
npm run cypress:open
```
