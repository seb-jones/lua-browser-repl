LUA_SOURCE_PATH=code/libraries/lua-5.4.3/src

SHARED_OPTIONS=-I $(LUA_SOURCE_PATH) -L $(LUA_SOURCE_PATH) -Wall code/main.c -o build/compiled.js -s MODULARIZE=1 -s EXPORT_NAME=createModule -s EXPORTED_FUNCTIONS='["_initialise_lua", "_parse"]' -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' -l lua

MAKE_BUILD_DIRECTORY=mkdir -p ./build

COPY_STATIC_FILES=cp assets/* code/index.html code/index.js build

PREREQUISITES=assets/* code/* test/* code/libraries/lua-5.4.3/src/liblua.a

# Build the main web app in debug mode
build/index.html:	$(PREREQUISITES)
	$(MAKE_BUILD_DIRECTORY)
	emcc -g -O0 -fsanitize=undefined $(SHARED_OPTIONS)
	$(COPY_STATIC_FILES)

# Build the main web app in production mode
.PHONY: prod
prod:	$(PREREQUISITES)
	$(MAKE_BUILD_DIRECTORY)
	emcc -O2 $(SHARED_OPTIONS)
	$(COPY_STATIC_FILES)

# Fetch and build the Lua source code
.PHONY: libraries
code/libraries/lua-5.4.3/src/liblua.a:
	mkdir -p code/libraries
	wget https://www.lua.org/ftp/lua-5.4.3.tar.gz -O - | tar -xz --directory=code/libraries
	sed -i -e 's/^CC=\s*gcc/CC=emcc/g' code/libraries/lua-5.4.3/src/Makefile
	cd code/libraries/lua-5.4.3 && emmake make

# Delete built files
clean:
	rm -rf ./build
	rm -rf ./code/libraries
