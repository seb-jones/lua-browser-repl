var terminalInput = null;
var historyPosition = null;
var currentInputLine = "";
var prompt1 = ">";
var prompt2 = ">>";

function getCurrentPrompt() {
    return (currentInputLine === "") ? prompt1 : prompt2;
}

function setCurrentPrompt() {
    return document.getElementById("terminal-input-prompt").innerText = getCurrentPrompt();
}

function addLineToOutput(line, className = "terminal-output-line") {
    var span = document.createElement("span");

    span.innerText = line;

    span.className = className;

    document.getElementById("terminal-output").append(span);
}

var options = {
    print: function(text) {
        addLineToOutput(text);
    },
    printErr: function(text) {
        addLineToOutput(text, "terminal-error-line");
    },
};

createModule(options).then(function (instance) {
    window.onerror = function(message) {
        instance.printErr(message);
    };

    instance.ccall("initialise_lua");

    setCurrentPrompt();

    terminalInput = document.getElementById("terminal-input");

    terminalInput.addEventListener("keydown", function (e) {
        var historyLineElements = document.getElementsByClassName("terminal-input-line");

        if (historyLineElements.length === 0) {
            return;
        }

        if (e.code !== "ArrowUp" && e.code !== "ArrowDown") {
            return;
        }

        //
        // Convert history line elements into array of strings, ignoring empty lines
        //
        var historyLines = [];

        for (var i = 0; i < historyLineElements.length; i++) {
            var line = historyLineElements[i].innerText.trim();

            if (line !== prompt1 && line !== prompt2) {
                historyLines.push(line);
            }
        }

        if (e.code === "ArrowUp") {
            historyPosition = (historyPosition === null) ?
                1 : (historyPosition + 1);
        } else {
            historyPosition = (historyPosition === null) ?
                historyLines.length : (historyPosition - 1);
        }

        if (historyPosition < 1 || historyPosition > historyLines.length) {
            terminalInput.value = "";
            historyPosition = null;
        } else {
            terminalInput.value = historyLines[historyLines.length - historyPosition]
                .replace(
                    new RegExp(`^(${prompt1}|${prompt2})\\s`),
                    ""
                );
        }
    });

    document.getElementById("terminal-form").addEventListener("submit", function (e) {
        e.preventDefault();

        historyPosition = null;

        var input = terminalInput.value;

        terminalInput.value = "";

        addLineToOutput(getCurrentPrompt() + " " + input, "terminal-input-line");

        var inputChunkIsIncomplete = instance.ccall(
            "parse",
            "number",
            [ "string" ],
            [ currentInputLine + input ]
        );

        currentInputLine = inputChunkIsIncomplete ?
            (currentInputLine + input) :
            "";

        setCurrentPrompt();
    });
});
