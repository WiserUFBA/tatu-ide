"use strict";

// Highlight on begin
hljs.initHighlightingOnLoad();

// This bellow is experimental, and make the editor looks better
var cppEditorGlobal = CodeMirror.fromTextArea(document.getElementById("cpp-code1"), {
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    continueComments: true,
    tabSize: 4,
    indentUnit: 4,
    mode: "text/x-c++src"
});
var cppEditorSetup = CodeMirror.fromTextArea(document.getElementById("cpp-code2"), {
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    continueComments: true,
    tabSize: 4,
    indentUnit: 4,
    mode: "text/x-c++src"
});
var cppEditorGet = CodeMirror.fromTextArea(document.getElementById("cpp-code3"), {
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    continueComments: true,
    tabSize: 4,
    indentUnit: 4,
    mode: "text/x-c++src"
});
var cppEditorSet = CodeMirror.fromTextArea(document.getElementById("cpp-code4"), {
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    continueComments: true,
    tabSize: 4,
    indentUnit: 4,
    mode: "text/x-c++src"
});

var mac = CodeMirror.keyMap.default == CodeMirror.keyMap.macDefault;
CodeMirror.keyMap.default[(mac ? "Cmd" : "Ctrl") + "-Space"] = "autocomplete";
// Only to refresh when display the div
/*cppEditorGlobal.refresh();
cppEditorSetup.refresh();
cppEditorGet.refresh();
cppEditorSet.refresh();*/

// Force defaut initialization
document.getElementById("defaultNPin").checked = true;
document.getElementById("typeDefaultChecked1").checked = true;
document.getElementById("typeDefaultChecked2").checked = true;
document.getElementById("typeDefaultChecked3").checked = true;
document.getElementById("typeDefaultChecked4").checked = true;
document.getElementById("methodsDefault").checked = true;

// Disable context menu on some divs
document.getElementById("main").oncontextmenu = function(){
    return false;
}