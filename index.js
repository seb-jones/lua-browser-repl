var terminalInput = null;
var historyPosition = null;
var currentInputLine = "";
var prompt1 = ">";
var prompt2 = ">>";

function getPrompt() {
    return (currentInputLine === "") ? prompt1 : prompt2;
}

function setPrompt() {
    return document.getElementById("terminal-input-prompt").innerText = getPrompt();
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

    setPrompt();

    terminalInput = document.getElementById("terminal-input");

    terminalInput.addEventListener("keydown", function (e) {
        var historyLines = document.getElementsByClassName("terminal-input-line");

        if (historyLines.length === 0) {
            return;
        }

        if (e.code !== "ArrowUp" && e.code !== "ArrowDown") {
            return;
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
                .innerText
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

        addLineToOutput(getPrompt() + " " + input, "terminal-input-line");

        var inputChunkIsIncomplete = instance.ccall(
            "parse",
            "number",
            [ "string" ],
            [ currentInputLine + input ]
        );

        currentInputLine = inputChunkIsIncomplete ?
            (currentInputLine + input) :
            "";

        setPrompt();
    });
});
