var { expect } = require("chai");

var moduleFactory = require("../build/compiled.js");

var stdout = [];
var stderr = [];

describe("Lua REPL Module", function() {
    describe("#parse", function() {
        beforeEach(async function() {
            stdout = [];
            stderr = [];

            var Module = {
                'print': function(text) { stdout.push(text) },
                'printErr': function(text) { stderr.push(text) }
            };

            this.instance = await moduleFactory(Module);

            this.instance.ccall("initialise_lua");
        });

        it("Evaluates a Lua expression", async function() {
            this.instance.ccall(
                "parse",
                "number",
                [ "string" ],
                [ "3 + 3" ]
            );

            expect(stdout.length).to.equal(2);

            expect(stdout[1]).to.equal('6');
        });

        it("Evaluates a Lua assignment", async function() {
            this.instance.ccall(
                "parse",
                "number",
                [ "string" ],
                [ "x = 10" ]
            );

            expect(stdout.length).to.equal(1);

            this.instance.ccall(
                "parse",
                "number",
                [ "string" ],
                [ "x" ]
            );

            expect(stdout.length).to.equal(2);
            expect(stdout[1]).to.equal('10');

        });
    });
});
