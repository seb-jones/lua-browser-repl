var terminalInput = null;
var historyPosition = null;
var currentInputLine = '';
var prompt1 = '>';
var prompt2 = '>>';

function getPrompt() {
    return currentInputLine === '' ? prompt1 : prompt2;
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
        new RegExp(`^(${prompt1}|${prompt2})\\s`),
        ""
    );
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
        if (e.code === 'ArrowUp') {
            if (historyPosition === null) {
                historyPosition = 1;
            } else {
                historyPosition++;
            }

            setInputToCurrentHistoryLine();

            return;
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
            'number',
            [ "string" ],
            [ currentInputLine + input ]
        );

        if (inputChunkIsIncomplete) {
            currentInputLine += input;
        } else {
            currentInputLine = '';
        }

        setPrompt();
    });
});