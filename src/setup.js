"use strict";

// Global Variables
var num = 0;
var codigoFinal = [];
var contentFinal = "";
var devicesReference = {};
var analogPins = [null,null,null,null,null,null];
var digitalPins = [null,null,null,null,null,null,null,null,null,null];

// Some initializations
// Position the input selectors based on draw area
var draw_area = document.getElementById("flowchart-demo").offsetWidth;
document.getElementById("flowchartDigitaD").style.left = (((draw_area / 4) * 3) - 150) + "px";
document.getElementById("flowchartAnalogA").style.left = ((draw_area / 4) - 150) + "px";

// Constants
var spc4 = "    ";

var dispositivosSistema = {
"simple-sensor": {
    system: "tatu-ide",
    version: 0.8,
    defaultName: "Example",
    label: "simple-sensor",
    numberOfPins: 1,
    pinLabel: [
        "signal",
    ],
    pinType:[
        "analog"
    ],
    globalCode: "// No Global Code",
    setupCode: "// No Setup Code Needed",
    methodsAllowed: "GET",
    getCode: "$RES = analogRead($1);",
    setCode: "// No Set code allowed"
},
"simple-actuatorA": {
    system: "tatu-ide",
    version: 0.8,
    defaultName: "Example",
    label: "simple-actuatorA",
    numberOfPins: 1,
    pinLabel: [
        "signal"
    ],
    pinType:[
        "digitalout"
    ],
    globalCode: "int ent = 0;",
    setupCode: "// No Setup Code Needed",
    methodsAllowed: "BOTH",
    getCode: "$RES = ent;",
    setCode: "ent = $IN;\nanalogWrite($1, $IN);"
},
"simple-actuatorD": {
    system: "tatu-ide",
    version: 0.8,
    defaultName: "Example",
    label: "simple-actuatorD",
    numberOfPins: 1,
    pinLabel: [
        "signal"
    ],
    pinType:[
        "digitalout"
    ],
    globalCode: "int ent = 0;",
    setupCode: "// No Setup Code Needed",
    methodsAllowed: "BOTH",
    getCode: "$RES = ent;",
    setCode: "ent = $IN;\ndigitalWrite($1, $IN);"
}};

