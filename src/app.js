"use strict";

hljs.initHighlightingOnLoad();
// Force defaut initialization
document.getElementById("defaultNPin").checked = true;
document.getElementById("typeDefaultChecked1").checked = true;
document.getElementById("typeDefaultChecked2").checked = true;
document.getElementById("typeDefaultChecked3").checked = true;
document.getElementById("typeDefaultChecked4").checked = true;
document.getElementById("methodsDefault").checked = true;

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

// Disable context menu on some divs
document.getElementById("main").oncontextmenu=function(){
    return false;
}

var num = 0;
var analogPins = [null,null,null,null,null,null];
var digitalPins = [null,null,null,null,null,null,null,null,null,null];
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
var codigoFinal = [];
var contentFinal = "";
var devicesReference = {};

// Search for a element is a list of elements
function  indexOfValue(elementos, valueSearched) {
    for (var i = 0; i < elementos.length; i++)
        if(elementos[i].value.indexOf(valueSearched) > -1)
            return i;
    return -1;
}

// Save a piece of text
function download(filename, text){
    var pom = document.createElement("a");
    pom.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    pom.setAttribute("download", filename);

    if(document.createEvent){
        var event = document.createEvent("MouseEvents");
        event.initEvent("click", true, true);
        pom.dispatchEvent(event);
    }
    else{
        pom.click();
    }

    console.log("Filename = " + filename);
    console.log("Content = " + text);
}

// Get JSON from a URL
function getJSON(url, successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "json";
    xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            successHandler && successHandler(xhr.response);
        }
        else {
            errorHandler && errorHandler(status);
        }
    };
    xhr.send();
}

// Check some inputs
function checkArgumentValue (elementos) {
    var j = 0;
    for (var k = 0; k < elementos.length; k++) {
        for (var i = 0, element = elementos[k]; i < element.length; i++)
            if((element[i].value == "") && (element[i].disabled != true)){
                element[i].style.borderColor = "#F00";
                j += 1;
            }
            else
                element[i].style.borderColor = "";
    }
    return j;
}

// Generate the code
var botaogencode = document.getElementById("gencode");
botaogencode.onclick = function(){
    var n = 0, j = 0, myRef, myObj, devName;
    codigoFinal = [];33
    console.log("Code generated...");
    for (var i = 0; i < digitalPins.length; i++) {
        if(digitalPins[i] != null){
            console.log("Digital PIN" + i + " = Sensor" 
                        + parseInt(digitalPins[i].slice(digitalPins[i].indexOf("#") + 1))
                        + " Pin" + parseInt(digitalPins[i].slice(digitalPins[i].indexOf("$") + 1)));

            n = n + 1;
        }
    }
    for (var i = 0; i < analogPins.length; i++) {
        if(analogPins[i] != null)
            console.log("Analog PIN" + i + " = Sensor" 
                        + parseInt(analogPins[i].slice(analogPins[i].indexOf("#") + 1))
                        + " Pin" + parseInt(analogPins[i].slice(analogPins[i].indexOf("$") + 1)));
    }

    var randomMac = "0xFA, 0xCA, 0xAA, ";
    for (var i = 0 ; i < 5; i++)
        randomMac += "0x" + Math.floor(Math.random()*254).toString(16).toUpperCase() + ", ";
    randomMac = randomMac.slice(0, randomMac.length - 2);
    console.log("The mac Generated is " + randomMac);

    var fourSpaces = "    ";
    console.log("===== FINAL CODE =====");
    // Includes
    codigoFinal[j++] = "#include <stdint.h>";
    codigoFinal[j++] = "#include <SPI.h>";
    codigoFinal[j++] = "#include <Ethernet.h>";
    codigoFinal[j++] = "#include <PubSubClient.h>";
    codigoFinal[j++] = "#include <TATUDevice.h>";
    codigoFinal[j++] = "#include <TATUInterpreter.h>";
    codigoFinal[j++] = "";
    codigoFinal[j++] = "// Device Constants";
    codigoFinal[j++] = "#define DEVICE_SAMPLE X";
    codigoFinal[j++] = "#define DEVICE_ID XX";
    codigoFinal[j++] = "#define DEVICE_PAN_ID XX";
    codigoFinal[j++] = "#define MQTTPORT 1883";
    codigoFinal[j++] = "";
    codigoFinal[j++] = "// System Properties";
    codigoFinal[j++] = "byte mac[]    = {  " + randomMac + " };";
    codigoFinal[j++] = "byte server[] = { 192, 168, 0, 0 };";
    codigoFinal[j++] = "byte ip[]     = { 192, 168, 0, 0 };";
    codigoFinal[j++] = "";

    // Found and generate the desireds DEFINES
    // For Analog Pins
    for (var i = 0; i < analogPins.length; i++) {
        if(analogPins[i] != null){
            // Device Name
            devName = analogPins[i].slice(0, analogPins[i].indexOf("Pin"));
            // Put the Reference of our object into a variable
            myRef = devicesReference[devName];
            // Put the Reference of our sensor into a variable too
            myObj = dispositivosSistema[myRef.label];
            for(var k = 0; k < myObj.numberOfPins; k++)
                codigoFinal[j++] = "#define " + devName.toUpperCase().replace("#", "") + "PIN" + k + " " + i;
            codigoFinal[j++] = "";
        } 
    }

    var modePinos = [null, null, null, null, null, null, null, null, null, null, null, null];

    // For Digital Pins
    for (var i = 0; i < digitalPins.length; i++) {
        if(digitalPins[i] != null){
            // Device Name
            devName = digitalPins[i].slice(0, digitalPins[i].indexOf("Pin"));
            // Put the Reference of our object into a variable
            myRef = devicesReference[devName];
            // Put the Reference of our sensor into a variable too
            myObj = dispositivosSistema[myRef.label];
            for(var k = 0; k < myObj.numberOfPins; k++){
                codigoFinal[j++] = "#define " + devName.toUpperCase().replace("#", "") + "PIN" + k + " " + i;
                if(myObj.pinType[k] != "analog"){
                    if(myObj.pinType[k] == "digitalin"){
                        codigoFinal[j++] = "#define " + devName.toUpperCase().replace("#", "") + "PINTYPE" + k + " INPUT";
                        modePinos[i] = "pinMode(" + devName.toUpperCase().replace("#", "") + "PIN" + k + ", OUTPUT);";
                    }
                    else if(myObj.pinType[k] == "digitalout"){
                        codigoFinal[j++] = "#define " + devName.toUpperCase().replace("#", "") + "PINTYPE" + k + " OUTPUT";
                        modePinos[i] = "pinMode(" + devName.toUpperCase().replace("#", "") + "PIN" + k + ", OUTPUT);";
                    }
                }
            }
            codigoFinal[j++] = "";
        } 
    }

    codigoFinal[j++] = "bool callback(uint32_t hash,char* response,char* valor,uint8_t type) {";
    codigoFinal[j++] = fourSpaces + "// The callback will be placed here";
    codigoFinal[j++] = "}";
    codigoFinal[j++] = "";
    codigoFinal[j++] = "EthernetClient ethClient;";
    codigoFinal[j++] = "SETUP(\"name\", ip, DEVICE_ID, DEVICE_PAN_ID, DEVICE_SAMPLE,"+
                        " server, MQTTPORT, callback, ethClient);";
    codigoFinal[j++] = "";
    codigoFinal[j++] = "void setup(){";
    codigoFinal[j++] = fourSpaces + "Ethernet.begin(mac, ip);";
    codigoFinal[j++] = fourSpaces + "Serial.begin(9600);";
    for (var i = 0; i < digitalPins.length; i++) {
        if(digitalPins[i] != null){
            codigoFinal[j++] = fourSpaces + modePinos[i];
        }
    }
    codigoFinal[j++] = fourSpaces + "DEVICECONNECT();";
    codigoFinal[j++] = "}";
    codigoFinal[j++] = "void loop(){";
    codigoFinal[j++] = fourSpaces + "client.loop();";
    codigoFinal[j++] = "}";

    var div_code = document.getElementById("code-area");
    div_code.innerHTML = "";
    for (var i = 0; i < codigoFinal.length; i++) {
        console.log(codigoFinal[i]);
        div_code.innerHTML += codigoFinal[i].replace(/</g, "&lt;").replace(/</g, "&gt;") + "\n"; 
        contentFinal += codigoFinal[i] + "\n";        
    }
    hljs.highlightBlock(div_code);
};

// Filter the list of devices
document.getElementById("filter-input").oninput = function(){
    var entrada = this.value;
    var elementos = document.addDevice.menuDevices.options;
    if(entrada == ""){
        for(var i = 0; i < elementos.length; i ++)
            elementos[i].style.display = "";
        return;
    }
    for(var i = 0; i < elementos.length; i ++)
        if(elementos[i].label.indexOf(entrada) > -1)
            elementos[i].style.display = "";
        else
            elementos[i].style.display = "none";
};

// Generate the file to download
document.getElementById("downcode").onclick = function () {
    var fileName = Date().replace(/\s+/, ".");

    // Generate code if it's not generated yet
    botaogencode.onclick();

    fileName = fileName.slice(fileName.indexOf(".")+1, fileName.indexOf(":")).replace(/\s+/g, ".") + ".ino";
    console.log("Generating file to download");
    download(fileName, contentFinal);
};

// Clean the interface
document.getElementById("resetitem").onclick = function(){
    var arr = document.getElementsByClassName("sensor");
    // I don't know why I put this, but it works, and I don't wanna know the reason
    while(arr.length > 0){
        for(var i = 0; i < arr.length; i++)
            instance.remove(arr[i]);
        arr = document.getElementsByClassName("sensor");
    }
    for(var j = 0; j < digitalPins.length; j++){
        digitalPins[j] = null;
    }
    for(var k = 0; k < analogPins.length; k++){
        analogPins[k] = null;
    }
    // Damm'n it! I need to stop beer while I'm programming
    //document.getElementById("flowchartAnalogA").name = "AnalogPin";
    //document.getElementById("flowchartDigitaD").name = "DigitalPin";
    console.log("Interface Reseted!");
};

// 
document.addDevice.menuDevices.onchange = function() {
    var formAddDevice = document.addDevice;
    var valor = formAddDevice.menuDevices.value;
    var labelN = formAddDevice.labelDevice;
    var radios = formAddDevice.pinsDevice;
    var pinsLabel = [formAddDevice.pinLabel1, formAddDevice.pinLabel2,
                formAddDevice.pinLabel3, formAddDevice.pinLabel4];
    var entradas = [document.addDevice.elements["typePin1"],
                    document.addDevice.elements["typePin2"],
                    document.addDevice.elements["typePin3"],
                    document.addDevice.elements["typePin4"]];
    var metodos = document.addDevice.elements["methodsAllowed"];
    var editorBack = document.getElementsByClassName("cm-s-default");

    if(valor != "NewDevice"){
        formAddDevice.labelDevice.style.borderColor = "";
        formAddDevice.nameDevice.style.borderColor = "";
        document.getElementById("save-device").style.display = "none";
        var elementos = formAddDevice.menuDevices.options;
        var pos = indexOfValue(elementos, valor);
        labelN.value = elementos[pos].label;
        labelN.disabled = "true";

        // Reference of the device
        var myRef = dispositivosSistema[labelN.value];

        // Change name of the device
        formAddDevice.nameDevice.value = myRef.defaultName;
        // Entering the values from the array of references
        radios[myRef.numberOfPins - 1].checked = true;
        switch(myRef.methodsAllowed){
            case "GET":
                metodos[0].checked = true;
                break;
            case "SET":
                metodos[1].checked = true;
                break;
            case "BOTH":
                metodos[2].checked = true;
                break;
        }
        for (var i = 0; i < myRef.numberOfPins; i++)
            pinsLabel[i].value = myRef.pinLabel[i];
        for (var i = 0; i < myRef.numberOfPins; i++)
            switch(myRef.pinType[i]){
                case "analog":
                    entradas[i][0].checked = true;
                    break;
                case "digitalin":
                    entradas[i][1].checked = true;
                    break;
                case "digitalout":
                    entradas[i][2].checked = true;
                    break;
            }
        cppEditorGlobal.setValue(myRef.globalCode);
        cppEditorSetup.setValue(myRef.setupCode);
        cppEditorGet.setValue(myRef.getCode);
        cppEditorSet.setValue(myRef.setCode);

        for (var i=0, iLen=radios.length; i<iLen; i++)
            radios[i].disabled = true;
        for (var i=0, iLen=pinsLabel.length; i<iLen; i++){
            pinsLabel[i].style.borderColor = "";
            pinsLabel[i].disabled = true;
        }
        for (var i = entradas.length - 1; i >= 0; i--) {
            entradas[i][0].disabled = true;
            entradas[i][1].disabled = true;
            entradas[i][2].disabled = true;
        }
        for(var i = 0; i < 3; i++)
            metodos[i].disabled = true;
        for(var i = 0; i < 4; i++)
            editorBack[i].style.backgroundColor = "#E6E6E6";
        
        cppEditorGlobal.setOption("readOnly", true);
        cppEditorSetup.setOption("readOnly", true);
        cppEditorGet.setOption("readOnly", true);
        cppEditorSet.setOption("readOnly", true);
    }
    else{
        document.getElementById("save-device").style.display = "";
        formAddDevice.nameDevice.value = "";
        labelN.value = "";
        labelN.disabled = "";
        for (var i=0, iLen=radios.length; i<iLen; i++)
            radios[i].disabled = false;
        for (var i=0, iLen=pinsLabel.length; i<iLen; i++){
            pinsLabel[i].disabled = false;
            pinsLabel[i].value = "";
        }
        for (var i = entradas.length - 1; i >= 0; i--) {
            entradas[i][0].checked = true;
            entradas[i][0].disabled = false;
            entradas[i][1].disabled = false;
            entradas[i][2].disabled = false;
        }
        for(var i = 0; i < 3; i++)
            metodos[i].disabled = false;
        for(var i = 0; i < 4; i++)
            editorBack[i].style.backgroundColor = "";
        
        // Enable the Editors
        cppEditorGlobal.setOption("readOnly", false);
        cppEditorSetup.setOption("readOnly", false);
        cppEditorGet.setOption("readOnly", false);
        cppEditorSet.setOption("readOnly", false);
        // Replace the text with a default
        cppEditorGlobal.setValue("// Insert the code here");
        cppEditorSetup.setValue("// Insert the code here");
        cppEditorGet.setValue("// Insert the code here");
        cppEditorSet.setValue("// Insert the code here");
        // Check some Radio buttons
        document.getElementById("defaultNPin").checked = true;
        document.getElementById("methodsDefault").checked = true;
    }
};

// Allow or disallow some input
function allowSomeInput(element) {
    var entradas = [document.addDevice.elements["typePin1"],
                    document.addDevice.elements["typePin2"],
                    document.addDevice.elements["typePin3"],
                    document.addDevice.elements["typePin4"]];
    var labelPinos = [document.addDevice.elements.pinLabel1,
                      document.addDevice.elements.pinLabel2,
                      document.addDevice.elements.pinLabel3,
                      document.addDevice.elements.pinLabel4];
    var ultimaEntrada = [labelPinos[0].style.borderColor, labelPinos[1].style.borderColor,
                         labelPinos[2].style.borderColor, labelPinos[3].style.borderColor];

    for(var i = 0; i < labelPinos.length; i++){
        labelPinos[i].disabled = true;
        labelPinos[i].style.borderColor = "";
    }

    for (var i = entradas.length - 1; i >= 0; i--) {
        entradas[i][0].disabled = true;
        entradas[i][1].disabled = true;
        entradas[i][2].disabled = true;
    }

    switch(parseInt(element.target.value)){
        case 4:
            labelPinos[3].disabled = false;
            labelPinos[3].style.borderColor = ultimaEntrada[3];
            entradas[3][0].disabled = false;
            entradas[3][1].disabled = false;
            entradas[3][2].disabled = false;
        case 3:
            labelPinos[2].disabled = false;
            labelPinos[2].style.borderColor = ultimaEntrada[2];
            entradas[2][0].disabled = false;
            entradas[2][1].disabled = false;
            entradas[2][2].disabled = false;
        case 2: 
            labelPinos[1].disabled = false;
            labelPinos[1].style.borderColor = ultimaEntrada[1];
            entradas[1][0].disabled = false;
            entradas[1][1].disabled = false;
            entradas[1][2].disabled = false;
        case 1:
            labelPinos[0].disabled = false;
            labelPinos[0].style.borderColor = ultimaEntrada[0];
            entradas[0][0].disabled = false;
            entradas[0][1].disabled = false;
            entradas[0][2].disabled = false;
    }
}
var elementosPinDevice = document.addDevice.elements["pinsDevice"];
for(var i = 0; i < 4; i++)
    elementosPinDevice[i].onchange = allowSomeInput;

for(var disableColors =[document.getElementById("label-newdevice"),
                        document.getElementById("name-newdevice"),
                        document.addDevice.elements.pinLabel1,
                        document.addDevice.elements.pinLabel2,
                        document.addDevice.elements.pinLabel3,
                        document.addDevice.elements.pinLabel4], i = 0;
                        i < disableColors.length; i++){
    disableColors[i].oninput = function(){
        this.style.borderColor = "";
    };
}

function allowEditor(element){
    var editors =  document.getElementsByClassName("cm-s-default");
    cppEditorGet.setOption("readOnly", true);
    cppEditorSet.setOption("readOnly", true);
    editors[2].style.backgroundColor = "#E6E6E6";
    editors[3].style.backgroundColor = "#E6E6E6";
    switch(element.target.value){
        case "GET":
            cppEditorGet.setOption("readOnly", false);
            editors[2].style.backgroundColor = "";
            return;
        case "SET":
            cppEditorSet.setOption("readOnly", false);
            editors[3].style.backgroundColor = "";
            return;
        case "BOTH":
            cppEditorGet.setOption("readOnly", false);
            cppEditorSet.setOption("readOnly", false);
            editors[2].style.backgroundColor = "";
            editors[3].style.backgroundColor = "";
            return;
    }
}

var metodosPermitidos = document.addDevice.elements["methodsAllowed"];
for(var i = 0; i < 3; i++)
    metodosPermitidos[i].onchange = allowEditor;

document.addDevice.menuDevices.onchange();

// Add a device item
document.getElementById("additem").onclick = function(){
    document.getElementById("modal").style.display = "";
    document.getElementById("add-device").style.display = "";
    // Refresh the view of the
    cppEditorGlobal.refresh();
    cppEditorSetup.refresh();
    cppEditorGet.refresh();
    cppEditorSet.refresh();
};

// Close the device item area
document.getElementById("close-add-device").onclick = function (argument){
    document.getElementById("modal").style.display = "none";
    document.getElementById("add-device").style.display = "none";
};

// Save a new device
document.getElementById("save-device").onclick = function(){
    var argumentos1 = [];
    for(var i = 0, aux = document.getElementsByClassName("pins-newdevice"), 
        tam = document.addDevice.pinsDevice.value; i < tam; i++) {
        argumentos1[i] = aux[i];
    }
    var argumentos2 = document.getElementsByClassName("input-newdevice");
    if((checkArgumentValue([argumentos1, argumentos2]) == 0)){
        // Get the labels and the type of the pins
        var labelRef = document.addDevice.labelDevice.value, nameRef = document.addDevice.nameDevice.value;
        var nPins = document.addDevice.pinsDevice.value;
        var arrayLabels = [], arrayTypes = [];
        for (var i = 0; i < nPins; i++) {
            arrayLabels[i] = document.addDevice["pinLabel" + (i + 1)].value;
            arrayTypes[i] = document.addDevice.elements["typePin" + (i + 1)].value;
        }

        // Add a item if they not exist, if they exist just override the property
        if(dispositivosSistema[labelRef] == undefined){
            document.getElementById("options-newdevice").innerHTML +=   "<option label=\"" + labelRef + "\" value=\""
                                                                        + nameRef + "\" >" + labelRef + "</option>";
            alert("Added a new Item!");
            console.log("Added a new item");
        }
        else{
            if(!confirm("Are you sure you wanna override the device with label " + labelRef + "?")){
                console.log("No item overrided");
                return;
            }
            console.log("Item overrided");
        }

        // Get all the values of the editable area
        dispositivosSistema[labelRef] = {
            system: "tatu-ide",
            version: 0.8,
            defaultName: nameRef,
            label: labelRef,
            numberOfPins: nPins,
            pinLabel: arrayLabels,
            pinType: arrayTypes,
            globalCode: cppEditorGlobal.getValue(),
            setupCode: cppEditorSetup.getValue(),
            methodsAllowed: document.addDevice.methodsAllowed.value,
            getCode: cppEditorGet.getValue(),
            setCode: cppEditorSet.getValue()
        };

        return;
    }
    alert("Please fill the marked inputs");
    console.log("You need to fill the form to add a new device");
};

// Save the JSON file
document.getElementById("download-device").onclick = function(){
    var labelRef = document.addDevice.labelDevice.value;
    
    var argumentos1 = [];
    for(var i = 0, aux = document.getElementsByClassName("pins-newdevice"), 
        tam = document.addDevice.pinsDevice.value; i < tam; i++) {
        argumentos1[i] = aux[i];
    }
    var argumentos2 = document.getElementsByClassName("input-newdevice");
    if((checkArgumentValue([argumentos1, argumentos2]) == 0)){
        download(labelRef + ".json", JSON.stringify(dispositivosSistema[labelRef]));
        return;
    }
    console.log("You cant save this undefined file");
    alert("You cant save this undefined file");
};

// Load a new JSON file
document.getElementById("load-device").onchange = function(event){
    document.getElementById("selectDev").selected = true;
    document.getElementById("options-newdevice").onchange();

    // DEBUG!
    //window.testA = event;
    window.testB = this;

    // Pick the reference of the file
    var file = this.files[0];

    console.log("You selected a file! The file name is " + file.name);

    if(window.testB.files[0].type != "application/json"){
        console.log("Incorrect file type. Please select another file");
        alert("Incorrect file type. Please select another file");
        return;
    }

    var reader = new FileReader();

    reader.onload = function (theFile){
        console.log("Content of the file uploaded => "+this.result);
        var saida = JSON.parse(this.result);
        if(((saida.system == undefined) || (saida.system != "tatu-ide")) ||
            ((saida.version == undefined) || (saida.version < 0.8))){
            console.log("This file is not valid, or is too old.");
            alert("This file is not valid, or is too old.");
            return;
        }
        if (dispositivosSistema[saida.label] != undefined){
            if (!confirm("Are you sure you wanna override the device with label " + saida.label + "?"))
                return;
            console.log("You are overriding a item");
        }
        else{
            if (!confirm("Do you really wanna add the file " + theFile.name + " with label " + saida.label + "?"))
                return;
            console.log("Adding a new item");
            document.getElementById("options-newdevice").innerHTML +=   "<option label=\"" + saida.label +
                                                                        "\" value=\"" + saida.defaultName + "\" >" 
                                                                        + saida.label + "</option>";
        }

        dispositivosSistema[saida.label] = saida;
    };

    reader.onerror = function(){
        alert("Error loading the file");
        console.log("Error loading the file");
    };

    reader.onabort = function(){
        alert("Error loading the file");
        console.log("Error loading the file");
    };

    reader.readAsText(file);
};

// The code bellow initialize the jsPlumb library
jsPlumb.ready(function () {
    var instance = jsPlumb.getInstance({
        // default drag options
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        // the overlays to decorate each connection with.
        // note that the label overlay uses a function to generate the label text; in this
        // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
        ConnectionOverlays: [
            [ "Arrow", { location: 1 } ],
            [ "Label", {
                location: 0.1,
                id: "label",
                cssClass: "aLabel"
            }]
        ],
        Container: "flowchart-demo"
    });

    var basicType = {
        connector: "StateMachine",
        paintStyle: { strokeStyle: "red", lineWidth: 4 },
        hoverPaintStyle: { strokeStyle: "blue" },
        overlays: [
            "Arrow"
        ]
    };
    instance.registerConnectionType("basic", basicType);

    // this is the paint style for the connecting lines..
    var connectorPaintStyle = {
            lineWidth: 4,
            strokeStyle: "#61B7CF",
            joinstyle: "round",
            outlineColor: "white",
            outlineWidth: 2
        },
        // .. and this is the hover style.
        connectorHoverStyle = {
            lineWidth: 4,
            strokeStyle: "#216477",
            outlineWidth: 2,
            outlineColor: "white"
        },
        endpointHoverStyle = {
            fillStyle: "#216477",
            strokeStyle: "#216477"
        },
        // the definition of source endpoints (the small blue ones)
        sourceEndpoint = {
            endpoint: "Dot",
            paintStyle: {
                strokeStyle: "#346789",
                fillStyle: "transparent",
                radius: 5,
                lineWidth: 3
            },
            isSource: true,
            connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
            connectorStyle: connectorPaintStyle,
            hoverPaintStyle: endpointHoverStyle,
            connectorHoverStyle: connectorHoverStyle,
            dragOptions: {},
            overlays: [
                [ "Label", {
                    location: [0.5, 1.5],
                    label: "Drag",
                    cssClass: "endpointSourceLabel"
                } ]
            ]
        },
        // the definition of target endpoints (will appear when the user drags a connection)
        targetEndpoint = {
            endpoint: "Dot",
            paintStyle: { fillStyle: "#7AB02C", radius: 6 },
            hoverPaintStyle: endpointHoverStyle,
            maxConnections: 1,
            dropOptions: { hoverClass: "hover", activeClass: "active" },
            isTarget: true,
            overlays: [
                [ "Label", { location: [0.5, -0.5], label: "Pin", cssClass: "endpointTargetLabel" } ]
            ],
            onMaxConnections: function(info) {
                console.log("You couldn't have two senors in the same PIN!");
                alert("You should not connect two sensors in the same PIN!");
            }
        },
        init = function (connection) {
            connection.getOverlay("label")
                      .setLabel("#" + parseInt(connection.sourceId.slice(connection.sourceId.indexOf("#") + 1))
                                + "-" + connection.targetId.substring(15));
        },

        targetEndpoint2 = {
            endpoint: "Dot",
            paintStyle: { fillStyle: "#8B0000", radius: 6 },
            hoverPaintStyle: endpointHoverStyle,
            maxConnections: 1,
            dropOptions: { hoverClass: "hover", activeClass: "active" },
            isTarget: true,
            overlays: [
                [ "Label", { location: [0.5, -0.5], label: "Pin", cssClass: "endpointTargetLabel" } ]
            ],
            onMaxConnections: function(info) {
                console.log("You couldn't have two senors in the same PIN!");
                alert("You should not connect two sensors in the same PIN!");
            }
        };

    var _addEndpoints = function (toId, sourceAnchors, nameAnchors, targetAnchors) {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + "Pin$" + i;
            sourceEndpoint.overlays[0][1].label = nameAnchors[i];
            instance.addEndpoint("flowchart" + toId, sourceEndpoint, {
                anchor: sourceAnchors[i], uuid: sourceUUID
            });
        }
        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID;
            if(toId === "DigitaD"){
                targetUUID = toId + "Pin$" + (j + 2);
                targetEndpoint2.overlays[0][1].label = "Pin" + (j + 2);
                instance.addEndpoint("flowchart" + toId, targetEndpoint2,
                                    { anchor: targetAnchors[j], uuid: targetUUID });
            }
            else{
                targetUUID = toId + "Pin$" + j;
                targetEndpoint.overlays[0][1].label = "Pin" + j;
                instance.addEndpoint("flowchart" + toId, targetEndpoint, 
                                    { anchor: targetAnchors[j], uuid: targetUUID });
            }
        }
    };

    // suspend drawing and initialise.
    instance.batch(function () {
        // Add some endpoints for example of course
        _addEndpoints("AnalogA", [],[], ["BottomLeft", [ 0.20, 0.47, 0, 1, 0, 50 ],
                                    [ 0.40, 0.47, 0, 1, 0, 50 ], [ 0.60, 0.47, 0, 1, 0, 50 ],
                                    [ 0.80, 0.47, 0, 1, 0, 50 ], "BottomRight"]);
        _addEndpoints("DigitaD", [],[], [ "BottomLeft", [ 0.14, 0.47, 0, 1, 0, 50 ],
                                     [ 0.28, 0.47, 0, 1, 0, 50 ], [ 0.42, 0.47, 0, 1, 0, 50 ],
                                     [ 0.56, 0.47, 0, 1, 0, 50 ], [ 0.70, 0.47, 0, 1, 0, 50 ],
                                     [ 0.85, 0.47, 0, 1, 0, 50 ], "BottomRight"]);

        document.getElementById("flowchartAnalogA").name = "AnalogPin";
        document.getElementById("flowchartDigitaD").name = "DigitalPin";

        // listen for new connections; initialise them the same way we initialise the connections at startup.
        instance.bind("connection", function (connInfo, originalEvent) {
            init(connInfo.connection);
        });

        // make all the window divs draggable
        instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
        // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
        // method, or document.querySelectorAll:
        //jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });

        // listen for clicks on connections, and offer to delete connections on click.
        instance.bind("contextmenu", function (connection, originalEvent) {
            if(confirm("Delete connection from " + document.getElementById(connection.sourceId).name
                        + " to " + document.getElementById(connection.targetId).name + "?")){
                var arr = connection.getUuids();
                var i = parseInt(arr[1].slice(arr[1].indexOf("$") + 1));
                if(connection.targetId == "flowchartAnalogA")
                    analogPins[i] = null;
                else
                    digitalPins[i] = null;
                console.log("Deleted connection from " + document.getElementById(connection.sourceId).name
                        + " to " + document.getElementById(connection.targetId).name + "?");    
                instance.detach(connection);
            }
            connection.toggleType("basic");
            originalEvent.preventDefault();
            return false;
        });

        instance.bind("connectionDrag", function (connection) {
            console.log("Connection " + connection.id + 
                        " is being dragged");
            var arr = connection.getUuids();
            if(arr[1] != null){
                var i = parseInt(arr[1].slice(arr[1].indexOf("$") + 1));
                if(arr[1].charAt(0) == 'A')
                    analogPins[i] = null;
                else
                    digitalPins[i] = null;
                console.log("Old connection deleted");
            }
        });

        instance.bind("connectionDragStop", function (connection) {
            console.log("Connection " + connection.id + " was dragged");
            var arr = connection.getUuids();
            var i = parseInt(arr[1].slice(arr[1].indexOf("$") + 1));
            if(connection.targetId == "flowchartAnalogA")
                analogPins[i] = arr[0];
            else{
                digitalPins[i] = arr[0];
            }
            console.log("Connection between " + arr[0] + " and " + arr[1] + " was created.");
        });

        instance.bind("connectionMoved", function (params) {
            console.log("connection " + params.connection.id + " was moved");
        });

    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);
    window.instance = instance;

    // Add a new item to the system
    function adicionar(name, label){
        var endpointsNum = [[[0.5, -0.07, 0, -1]],
                        [[0, -0.07, 0, -1], [1, -0.07, 0, -1]],
                        [[0, -0.07, 0, -1], [0.5, -0.07, 0, -1], [1, -0.07, 0, -1]],
                        [[0, -0.07, 0, -1], [0.33, -0.07, 0, -1], [0.66, -0.07, 0, -1], [1, -0.07, 0, -1]]];
        devicesReference[name + "#" + num] = {name:name, label:label};
        var tempdiv = document.createElement('div');
        tempdiv.id = "flowchart"+name+"#" + num;
        tempdiv.className = "sensor window locatezero";
        tempdiv.innerHTML = "<strong> "+ name + num + "</strong><br/><br/>";
        tempdiv.name = name+"#"+num;
        tempdiv.oncontextmenu = function(){
            if(confirm("Delete " + tempdiv.name + " ?")){
                var arr = instance.select({ source: tempdiv.id });
                window.arr = arr;
                if(arr.length > 0){
                    for(var i = 0; i < arr.length; i++){
                        var conn = arr.get(i);
                        var uid = conn.getUuids();
                        var i = parseInt(uid[1].slice(uid[1].indexOf("$") + 1));
                        if(uid[1].charAt(0) == 'A')
                            analogPins[i] = null;
                        else
                            digitalPins[i] = null;
                        console.log("Connection " + conn.id + " deleted");
                    }
                }
                console.log(tempdiv.name + " deleted");
                delete devicesReference[this.name];
                instance.remove(this);
            }
        };
        document.getElementById("flowchart-demo").appendChild(tempdiv);
        _addEndpoints(name + "#" + num, endpointsNum[dispositivosSistema[label].numberOfPins - 1],
                        dispositivosSistema[label].pinLabel, []);
        console.log("Added a item. Num " + num);
        num = num + 1;
        // Make everything draggable
        instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
    }

    // Default add buttons, need to be fixed and add some log
    function addactuator(){
        var entrada = prompt("Name the actuator. Pres OK to enter to default value 'Actuator'.");
        var labelD = "simple-actuator";
        if(entrada === "") entrada = "Actuator";
        else if(entrada === null) return;
        switch(this.name){
            case "digital": entrada += "D"; labelD += "D"; break;
            case "analog": entrada += "A"; labelD += "A"; break;
        }
        adicionar(entrada, labelD);
    };

    document.getElementById("additemactuator-a").onclick = addactuator;
    document.getElementById("additemactuator-d").onclick = addactuator;

    document.getElementById("additemsensor").onclick = function(){
        var entrada = prompt("Name the sensor. Pres OK to enter to default value 'Sensor'.");
        if(entrada === "") entrada = "Sensor";
        else if(entrada === null) return;
        adicionar(entrada, "simple-sensor");
    };

    document.getElementById("confirm-add-device").onclick = function (argument){
        var name = document.addDevice.nameDevice.value;
        var argumentos1 = [];
        for(var i = 0, aux = document.getElementsByClassName("pins-newdevice"), 
            tam = document.addDevice.pinsDevice.value; i < tam; i++) {
            argumentos1[i] = aux[i];
        }
        var argumentos2 = document.getElementsByClassName("input-newdevice");
        if((checkArgumentValue([argumentos1, argumentos2]) == 0)){
            document.getElementById("modal").style.display = "none";
            document.getElementById("add-device").style.display = "none";
            adicionar(name, document.addDevice.labelDevice.value);
            return;
        }
        console.log("Check the blank arguments!");
        alert("Please fill the form!");
    };

    // Improvised Login for some tests
    /*
    var login_hue = document.getElementById("send-pass");
    login_hue.onclick = function(){
        var input_pass = document.getElementById("password").value;
        console.log(input_pass);
        if(input_pass === "vacagostosa"){
            document.getElementById("login").style.display = "none";
            document.getElementById("modal").style.display = "none";
        }
    }
    */
    //document.getElementById("password").onenter = login_hue.onclick;
});