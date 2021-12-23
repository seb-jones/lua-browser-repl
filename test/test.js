const { expect } = require("chai");

const createModule = require("../build/compiled.js");

let stdout = [];
let stderr = [];

describe("Lua REPL Module", function() {
    describe("#parse", function() {
        beforeEach(async function() {
            stdout = [];
            stderr = [];

            const options = {
                "print": function(text) { stdout.push(text) },
                "printErr": function(text) { stderr.push(text) }
            };

            this.instance = await createModule(options);

            this.instance.ccall("initialise_lua");

            this.parse = this.instance.cwrap("parse", "number", [ "string" ]);
        });

        it("Evaluates a Lua expression", function() {
            this.parse("3 + 3");

            expect(stdout.length).to.equal(2);
            expect(stdout[1]).to.equal("6");
        });

        it("Evaluates a Lua assignment", function() {
            this.parse("x = 10");

            expect(stdout.length).to.equal(1);

            this.parse("x");

            expect(stdout.length).to.equal(2);
            expect(stdout[1]).to.equal("10");
        });

        it("Returns `true` if input is not a complete Lua chunk", function() {
            const inputChunkIsIncomplete = this.parse("print(");

            expect(inputChunkIsIncomplete).to.equal(1);

            expect(stdout).to.be.an('array')
                .with.lengthOf(1)
                .and.members([
                    "Welcome! This REPL is using Lua 5.4"
                ]);
        });
    });
});
