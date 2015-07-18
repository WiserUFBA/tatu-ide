"use strict";

document.getElementById("main").oncontextmenu=function(){
    // Code to handle event
    return false;
}

var num = 0;
var analogPins = [null,null,null,null,null,null];
var digitalPins = [null,null,null,null,null,null,null,null,null,null];
var codigoFinal = [];
var contentFinal = "";
var allowChangePin = true;

function  indexOfValue(elementos, valueSearched) {
    for (var i = 0; i < elementos.length; i++)
        if(elementos[i].value.indexOf(valueSearched) > -1)
            return i;
    return -1;
}

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
                      .setLabel("#" + parseInt(connection.sourceId.slice(connection.sourceId.indexOf("#") + 1)) + "-" + connection.targetId.substring(15));
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
                instance.addEndpoint("flowchart" + toId, targetEndpoint2, { anchor: targetAnchors[j], uuid: targetUUID });
            }
            else{
                targetUUID = toId + "Pin$" + j;
                targetEndpoint.overlays[0][1].label = "Pin" + j;
                instance.addEndpoint("flowchart" + toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
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
        /*
        _addEndpoints("Window4", ["TopCenter", "BottomCenter"], ["LeftMiddle", "RightMiddle"]);
        _addEndpoints("Window2", ["LeftMiddle", "BottomCenter"], ["TopCenter", "RightMiddle"]);
        _addEndpoints("Window3", ["RightMiddle", "BottomCenter"], ["LeftMiddle", "TopCenter"]);
        _addEndpoints("Window1", ["LeftMiddle", "RightMiddle"], ["TopCenter", "BottomCenter"]);
        */

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

    var botaoadicionar = document.getElementById("additem");
    botaoadicionar.onclick = function(){
        document.getElementById("modal").style.display = "";
        document.getElementById("add-device").style.display = "";
        //adicionar("Device");
    };

    // Close
    document.getElementById("close-add-device").onclick = function (argument){
        document.getElementById("modal").style.display = "none";
        document.getElementById("add-device").style.display = "none";
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

    function allowSomeInput() {
        document.addDevice.pinLabel1.disabled = true;
        document.addDevice.pinLabel2.disabled = true;
        document.addDevice.pinLabel3.disabled = true;
        document.addDevice.pinLabel4.disabled = true;

        switch(this.value){
            case 4:
                document.addDevice.pinLabel4.disabled = false;
            case 3:
                document.addDevice.pinLabel3.disabled = false;
            case 2: 
                document.addDevice.pinLabel4.disabled = false;
            case 1:
                document.addDevice.pinLabel4.disabled = false;
        }
    }

    document.addDevice.pinsDevice[0].onclick = allowSomeInput;
    document.addDevice.pinsDevice[1].onclick = allowSomeInput;
    document.addDevice.pinsDevice[2].onclick = allowSomeInput;
    document.addDevice.pinsDevice[3].onclick = allowSomeInput;

    document.addDevice.menuDevices.onchange = function() {
        var formAddDevie = document.addDevice;
        var valor = formAddDevie.menuDevices.value;
        var labelN = formAddDevie.labelDevice;
        var radios = formAddDevie.pinsDevice;
        var pinsLabel = [formAddDevie.pinLabel1, formAddDevie.pinLabel2,
                    formAddDevie.pinLabel3, formAddDevie.pinLabel4];
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
            allowChangePin = false;
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
            document.addDevice.pinLabel4.checked = true;
            allowChangePin = true;
        }
    };

    // This will be default
    document.getElementById("additemsensor").onclick = function(){
        var entrada = prompt("Name the sensor. Pres OK to enter to default value 'Sensor'.");
        if(entrada === "") entrada = "Sensor";
        else if(entrada === null) return;
        adicionar(entrada);
    };

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

    // Clean the interface
    var botaoreset = document.getElementById("resetitem");
    botaoreset.onclick = function(){
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

    var botao_down = document.getElementById("downcode")
    botao_down.onclick = function () {
        var fileName = Date().replace(/\s+/, ".");

        // Generate code if it's not generated yet
        botaogencode.onclick();

        fileName = fileName.slice(fileName.indexOf(".")+1, fileName.indexOf(":")).replace(/\s+/g, ".") + ".ino";
        console.log("Generating file to download");
        download(fileName, contentFinal);
    };

    document.addDevice.menuDevices.onchange();
});