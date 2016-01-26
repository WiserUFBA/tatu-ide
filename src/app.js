"use strict";

// Variables of environment
var codeVars = [];
// System
codeVars["DEVICE_ID"]       = 1;
codeVars["DEVICE_NAME"]     = "TEST";
codeVars["DEVICE_PAN_ID"]   = 10;
// Network
codeVars["DEVICE_MAC"]      = "00:00:00:00:00:00:00:00";
codeVars["DEVICE_IP"]       = "192, 168, 0, 10";
codeVars["SERVER_IP"]       = "192, 168, 0, 1";
// MQTT
codeVars["MQTT_PORT"]       = 1883;
codeVars["MQTT_USER"]       = "user";
codeVars["MQTT_PASS"]       = "pass";
// Functions
codeVars["PROPERTIES_GET"]  = "";
codeVars["PROPERTIES_SET"]  = "";

// Generate the code
var botaogencode = document.getElementById("gencode");
botaogencode.onclick = function(){
    var n = 0;
    var j = 0;
    var myRef;
    var myObj;
    var devName;
    var temporaria;
    var div_code = document.getElementById("code-area");
    var modePinos = [null, null, null, null, null, null, null, null, null, null, null, null];

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

    // Found and generate the desireds DEFINES
    codigoFinal[j++] = "// Pin Constants";

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
            //codigoFinal[j++] = "";
        } 
    }

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
                        //codigoFinal[j++] = "#define " + devName.toUpperCase().replace("#", "") + "PINTYPE" + k + " INPUT";
                        modePinos[i] = "pinMode(" + devName.toUpperCase().replace("#", "") + "PIN" + k + ", OUTPUT);";
                    }
                    else if(myObj.pinType[k] == "digitalout"){
                        //codigoFinal[j++] = "#define " + devName.toUpperCase().replace("#", "") + "PINTYPE" + k + " OUTPUT";
                        modePinos[i] = "pinMode(" + devName.toUpperCase().replace("#", "") + "PIN" + k + ", OUTPUT);";
                    }
                }
            }
            //codigoFinal[j++] = "";
        } 
    }

    codigoFinal[j++] = "";

    // If there's no constant override the first comment and the blank line
    if(j == 2) j = 0;

    /* Template Code */
    
    //////////////////////////////////////////////////////////////////////////////////////////
    /*                     ||
        |   | |¨¨ |¨\ |¨¨  || 
        |---| |-  | / |-  \  /
        |   | |.. | \ |..  \/
        
        All that you need to edit to make this usable is on the next four commented lines
    */
    /////////////////////////////////////////////////////////////////////////////////////////
    
    // Generate GETTERS
    // codeVars["PROPERTY_GET"] = getterGenerate();

    // Generate SETTERS
    // codeVars["PROPERTY_SET"] = setterGenerate();

    // Generate a random mac
    codeVars["DEVICE_MAC"]      = randomMac();

    // Use template and substitute all variables
    for (var i = 0; i < codeDefault.length; i++) {
        if(codeDefault[i].indexOf("$(") > -1){
            temporaria = codeDefault[i].slice(codeDefault[i].indexOf("$(") + 2, codeDefault[i].indexOf(")$"));
            codigoFinal[j++] = replaceAll(codeDefault[i], "$(" + temporaria + ")$", codeVars[temporaria]);
            continue;
        }
        else codigoFinal[j++] = codeDefault[i];
    };

    /* Template Code */

    // Configurar
    codigoFinal[j++] = "";
    codigoFinal[j++] = "void configurar(){";
    for (var i = 0; i < digitalPins.length; i++) {
        if(digitalPins[i] != null){
            codigoFinal[j++] = spc4 + modePinos[i];
        }
    }
    codigoFinal[j++] = "}";

    // Assign the result
    div_code.innerHTML = "";
    for (var i = 0; i < codigoFinal.length; i++) {
        console.log(codigoFinal[i]);
        div_code.innerHTML += codigoFinal[i].replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n"; 
        contentFinal += codigoFinal[i] + "\n";        
    }
    hljs.highlightBlock(div_code);
};

// The code bellow initialize the jsPlumb library
jsPlumb.ready(function () {

    var instance = jsPlumb.getInstance({
        // default drag options
        DragOptions: { cursor: "pointer", zIndex: 2000 },
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
        };

    // .. and this is the hover style.
    var connectorHoverStyle = {
            lineWidth: 4,
            strokeStyle: "#216477",
            outlineWidth: 2,
            outlineColor: "white"
        };
    var endpointHoverStyle = {
            fillStyle: "#216477",
            strokeStyle: "#216477"
        };

    // the definition of source endpoints (the small blue ones)
    var sourceEndpoint = {
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
        };

    // the definition of target endpoints (will appear when the user drags a connection)
    var targetEndpoint = {
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
        };
    var targetEndpoint2 = {
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

    var init = function (connection) {
            connection.getOverlay("label")
                      .setLabel("#" + parseInt(connection.sourceId.slice(connection.sourceId.indexOf("#") + 1))
                                + "-" + connection.targetId.substring(15));
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
});