var { expect } = require("chai");

var createModule = require("../build/compiled.js");

var stdout = [];
var stderr = [];

describe("Lua REPL Module", function() {
    describe("#parse", function() {
        beforeEach(async function() {
            stdout = [];
            stderr = [];

            var options = {
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
    });
});
