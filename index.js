var terminalInput = null;
var historyPosition = null;

function getPrompt() {
    return document.getElementById("terminal-input-prompt").innerText.trim();
}

function addLineToOutput(line, className = "terminal-output-line") {
    var span = document.createElement("span");

    span.innerText = line;

    span.className = className;

    document.getElementById("terminal-output").append(span);
}

function setInputToCurrentHistoryLine() {
    var lines = document.getElementsByClassName("terminal-input-line");

    if (lines.length === 0) {
        historyPosition = null;
        return;
    }

    if (historyPosition > lines.length) {
        historyPosition = 1;
    }

    if (historyPosition < 1) {
        historyPosition = lines.length;
    }

    terminalInput.value = lines[lines.length - historyPosition].innerText.replace(
        /^\$\s*/, ''
    );
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

        terminalInput = document.getElementById("terminal-input");

        terminalInput.addEventListener("keydown", function (e) {
            if (e.code === 'ArrowUp') {
                if (historyPosition === null) {
                    historyPosition = 1;
                } else {
                    historyPosition++;
                }

                setInputToCurrentHistoryLine();

                return;
            }

            historyPosition = null;

            if (e.code === "Enter") {
                e.preventDefault();

                var input = terminalInput.value;

                terminalInput.value = "";

                addLineToOutput(getPrompt() + " " + input, "terminal-input-line");

                Module.ccall("parse", null, [ "string" ], [ input ]);
            }
        });
    },
};
