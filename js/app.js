"use strict";

hljs.initHighlightingOnLoad();
// Force defaut initialization
document.getElementById("defaultNPin").checked = true;
document.getElementById("typeDefaultChecked1").checked = true;
document.getElementById("typeDefaultChecked2").checked = true;
document.getElementById("typeDefaultChecked3").checked = true;
document.getElementById("typeDefaultChecked4").checked = true;

// This bellow is experimental, and make the editor looks better
var cppEditor1 = CodeMirror.fromTextArea(document.getElementById("cpp-code1"), {
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    continueComments: true,
    tabSize: 4,
    indentUnit: 4,
    mode: "text/x-c++src"
});
var cppEditor2 = CodeMirror.fromTextArea(document.getElementById("cpp-code2"), {
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    continueComments: true,
    tabSize: 4,
    indentUnit: 4,
    mode: "text/x-c++src"
});
var cppEditor3 = CodeMirror.fromTextArea(document.getElementById("cpp-code3"), {
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    continueComments: true,
    tabSize: 4,
    indentUnit: 4,
    mode: "text/x-c++src"
});
var cppEditor4 = CodeMirror.fromTextArea(document.getElementById("cpp-code4"), {
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

cppEditor1.refresh();
cppEditor2.refresh();
cppEditor3.refresh();
cppEditor4.refresh();

// Disable context menu on some divs
document.getElementById("main").oncontextmenu=function(){
    return false;
}

var num = 0;
var analogPins = [null,null,null,null,null,null];
var digitalPins = [null,null,null,null,null,null,null,null,null,null];
var codigoFinal = [];
var contentFinal = "";

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
    for (var i = 0; i < elementos.length; i++)
        if(elementos[i].value == ""){
            elementos[i].style.borderColor = "#F00";
            j += 1;
        }
        else
            elementos[i].style.borderColor = "";
    return j;
}

// Generate the code
var botaogencode = document.getElementById("gencode");
botaogencode.onclick = function(){
    var n = 0, j = 0;
    codigoFinal = [];
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

    console.log("===== FINAL CODE =====");
    codigoFinal[j++] = "void setup(){";
    for (var i = 0; i < digitalPins.length; i++) {
        if(digitalPins[i] != null){
            codigoFinal[j++] = "  pinMode(" + i + ", INPUT);";
        }
    }
    codigoFinal[j++] = "}";
    codigoFinal[j++] = "void loop(){";
    codigoFinal[j++] = "}";

    var div_code = document.getElementById("code-area");
    div_code.innerHTML = "";
    for (var i = 0; i < codigoFinal.length; i++) {
        console.log(codigoFinal[i]);
        div_code.innerHTML += codigoFinal[i];
        div_code.innerHTML += "\n"; 
    }
    contentFinal = div_code.innerHTML;
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
    var formAddDevie = document.addDevice;
    var valor = formAddDevie.menuDevices.value;
    var labelN = formAddDevie.labelDevice;
    var radios = formAddDevie.pinsDevice;
    var pinsLabel = [formAddDevie.pinLabel1, formAddDevie.pinLabel2,
                formAddDevie.pinLabel3, formAddDevie.pinLabel4];
    var entradas = [document.forms["addDevice"].elements["typePin1"],
                    document.forms["addDevice"].elements["typePin2"],
                    document.forms["addDevice"].elements["typePin3"],
                    document.forms["addDevice"].elements["typePin4"]];

    if(valor != "NewDevice"){
        document.getElementById("save-device").style.display = "none";
        var elementos = formAddDevie.menuDevices.options;
        formAddDevie.nameDevice.value = valor;
        var pos = indexOfValue(elementos, valor);
        labelN.value = elementos[pos].label;
        labelN.disabled = "true";
        for (var i=0, iLen=radios.length; i<iLen; i++)
            radios[i].disabled = true;
        for (var i=0, iLen=pinsLabel.length; i<iLen; i++)
            pinsLabel[i].disabled = true;
        for (var i = entradas.length - 1; i >= 0; i--) {
            entradas[i][0].disabled = true;
            entradas[i][1].disabled = true;
            entradas[i][2].disabled = true;
        }
        cppEditor1.setOption("readOnly", true);
        cppEditor2.setOption("readOnly", true);
        cppEditor3.setOption("readOnly", true);
        cppEditor4.setOption("readOnly", true);
        document.getElementsByClassName("cm-s-default")[0].style.backgroundColor = "#E6E6E6";
        document.getElementsByClassName("cm-s-default")[1].style.backgroundColor = "#E6E6E6";
        document.getElementsByClassName("cm-s-default")[2].style.backgroundColor = "#E6E6E6";
        document.getElementsByClassName("cm-s-default")[3].style.backgroundColor = "#E6E6E6";
    }
    else{
        document.getElementById("save-device").style.display = "";
        formAddDevie.nameDevice.value = "";
        labelN.value = "";
        labelN.disabled = "";
        for (var i=0, iLen=radios.length; i<iLen; i++)
            radios[i].disabled = false;
        for (var i=0, iLen=pinsLabel.length; i<iLen; i++)
            pinsLabel[i].disabled = false;
        for (var i = entradas.length - 1; i >= 0; i--) {
            entradas[i][0].disabled = false;
            entradas[i][1].disabled = false;
            entradas[i][2].disabled = false;
        }
        document.getElementById("defaultNPin").checked = true;
        cppEditor1.setOption("readOnly", false);
        cppEditor2.setOption("readOnly", false);
        cppEditor3.setOption("readOnly", false);
        cppEditor4.setOption("readOnly", false);
        document.getElementsByClassName("cm-s-default")[0].style.backgroundColor = "";
        document.getElementsByClassName("cm-s-default")[1].style.backgroundColor = "";
        document.getElementsByClassName("cm-s-default")[2].style.backgroundColor = "";
        document.getElementsByClassName("cm-s-default")[3].style.backgroundColor = "";
    }
};

// Allow or disallow some input
function allowSomeInput(element) {
    var entradas = [document.forms["addDevice"].elements["typePin1"],
                    document.forms["addDevice"].elements["typePin2"],
                    document.forms["addDevice"].elements["typePin3"],
                    document.forms["addDevice"].elements["typePin4"]];
    document.forms["addDevice"].elements.pinLabel1.disabled = true;
    document.forms["addDevice"].elements.pinLabel2.disabled = true;
    document.forms["addDevice"].elements.pinLabel3.disabled = true;
    document.forms["addDevice"].elements.pinLabel4.disabled = true;

    for (var i = entradas.length - 1; i >= 0; i--) {
        entradas[i][0].disabled = true;
        entradas[i][1].disabled = true;
        entradas[i][2].disabled = true;
    }

    switch(parseInt(element.target.value)){
        case 4:
            document.forms["addDevice"].elements.pinLabel4.disabled = false;
            entradas[3][0].disabled = false;
            entradas[3][1].disabled = false;
            entradas[3][2].disabled = false;
        case 3:
            document.forms["addDevice"].elements.pinLabel3.disabled = false;
            entradas[2][0].disabled = false;
            entradas[2][1].disabled = false;
            entradas[2][2].disabled = false;
        case 2: 
            document.forms["addDevice"].elements.pinLabel2.disabled = false;
            entradas[1][0].disabled = false;
            entradas[1][1].disabled = false;
            entradas[1][2].disabled = false;
        case 1:
            document.forms["addDevice"].elements.pinLabel1.disabled = false;
            entradas[0][0].disabled = false;
            entradas[0][1].disabled = false;
            entradas[0][2].disabled = false;
    }
}

document.forms["addDevice"].elements["pinsDevice"][0].onchange = allowSomeInput;
document.forms["addDevice"].elements["pinsDevice"][1].onchange = allowSomeInput;
document.forms["addDevice"].elements["pinsDevice"][2].onchange = allowSomeInput;
document.forms["addDevice"].elements["pinsDevice"][3].onchange = allowSomeInput;

document.addDevice.menuDevices.onchange();

// Add a device item
document.getElementById("additem").onclick = function(){
    document.getElementById("modal").style.display = "";
    document.getElementById("add-device").style.display = "";
    // Refresh the view of the
    cppEditor1.refresh();
    cppEditor2.refresh();
    cppEditor3.refresh();
    cppEditor4.refresh();
};

// Close the device item area
document.getElementById("close-add-device").onclick = function (argument){
    document.getElementById("modal").style.display = "none";
    document.getElementById("add-device").style.display = "none";
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
            else
                digitalPins[i] = arr[0];
            console.log("Connection between " + arr[0] + " and " + arr[1] + " was created.");
        });

        instance.bind("connectionMoved", function (params) {
            console.log("connection " + params.connection.id + " was moved");
        });

    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);
    window.instance = instance;

    // Add a new item to the system
    function adicionar(name){
        var tempdiv = document.createElement('div');
        if(name == "Actuator") 
            tempdiv.id = "flowchartActuat#" + num;
        else
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
                instance.remove(tempdiv);
            }
        };
        document.getElementById("flowchart-demo").appendChild(tempdiv);
        _addEndpoints(name + "#" + num, [[0.5, -0.07, 0, -1]],["Signal"], []);
        console.log("Added a item. Num " + num);
        num = num + 1;
        // Make everything draggable
        instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
    }

    // Default add buttons, need to be fixed and add some log
    function addactuator(){
        var entrada = prompt("Name the actuator. Pres OK to enter to default value 'Actuator'.");
        if(entrada === "") entrada = "Actuator";
        else if(entrada === null) return;
        switch(this.name){
            case "digital": entrada += "D"; break;
            case "analog": entrada += "A"; break;
        }
        adicionar(entrada);
    };

    document.getElementById("additemactuator-a").onclick = addactuator;
    document.getElementById("additemactuator-d").onclick = addactuator;

    document.getElementById("additemsensor").onclick = function(){
        var entrada = prompt("Name the sensor. Pres OK to enter to default value 'Sensor'.");
        if(entrada === "") entrada = "Sensor";
        else if(entrada === null) return;
        adicionar(entrada);
    };

    document.getElementById("confirm-add-device").onclick = function (argument){
        var name = document.addDevice.nameDevice.value;
        if(checkArgumentValue(document.getElementsByClassName("input-newdevice")) == 0){
            document.getElementById("modal").style.display = "none";
            document.getElementById("add-device").style.display = "none";
            adicionar(name);
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