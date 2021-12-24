const prompt1 = ">";
const prompt2 = ">>";
let currentInputLine = "";

function getCurrentPrompt() {
    return (currentInputLine === "") ? prompt1 : prompt2;
}

function setCurrentPrompt() {
    return document.getElementById("terminal-input-prompt").innerText = getCurrentPrompt();
}

function addLineToOutput(line, className = "terminal-output-line") {
    let span = document.createElement("span");

    span.innerText = line;

    span.className = className;

    document.getElementById("terminal-output").append(span);
}

const options = {
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

    let historyPosition = null;
    let terminalInput = document.getElementById("terminal-input");

    terminalInput.addEventListener("keydown", function (e) {
        const historyLineElements = document.getElementsByClassName("terminal-input-line");

        if (historyLineElements.length === 0) {
            return;
        }

        if (e.code !== "ArrowUp" && e.code !== "ArrowDown") {
            return;
        }

        //
        // Convert history line elements into array of strings, ignoring empty lines
        //
        let historyLines = [];

        for (let i = 0; i < historyLineElements.length; i++) {
            const line = historyLineElements[i].innerText.trim();

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

        const input = terminalInput.value;

        terminalInput.value = "";

        addLineToOutput(getCurrentPrompt() + " " + input, "terminal-input-line");

        const inputChunkIsIncomplete = instance.ccall(
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
