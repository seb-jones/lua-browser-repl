function addLineToOutput(line, className = "terminal-output-line") {
    var span = document.createElement("span");

    span.innerText = line;

    span.className = className;

    document.getElementById("terminal-output").append(span);
}

var Module = {
    print: function(text) {
        console.log(text);
        addLineToOutput(text);
    },
    printErr: function(text) {
        console.error(text);
        addLineToOutput(text, "terminal-error-line");
    },
    onRuntimeInitialized: function() {
        window.onerror = function(message) {
            Module.printErr(message);
        };

        var terminalInput = document.getElementById("terminal-input");

        terminalInput.addEventListener("keydown", function (e) {
            if (e.code === "Enter") {
                e.preventDefault();

                var input = terminalInput.value;

                terminalInput.value = "";

                var prompt = document.getElementById("terminal-input-prompt").innerText.trim();

                addLineToOutput(prompt + " " + input, "terminal-input-line");

                Module.ccall("parse", null, [ "string" ], [ input ]);
            }
        });
    },
};
