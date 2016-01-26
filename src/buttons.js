"use strict";

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

// Add new devices to the IDE
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
        document.getElementById("edit-device").style.display = "";
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
        document.getElementById("edit-device").style.display = "none";
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
    // I really don't see the need of this two lines
    //document.getElementById("selectDev").selected = true;
    //document.getElementById("options-newdevice").onchange();

    // Pick the reference of the file
    var file = this.files[0];

    console.log("You selected a file! The file name is " + file.name);

    if(this.files[0].type != "application/json"){
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

// Edit the selected item
document.getElementById("edit-device").onclick = function (){
    // Get the label from the actual menu
    var myLabel = document.getElementById("label-newdevice").value;

    // Force selection of the new-device and change the button 
    document.getElementById("selectDev").selected = true;
    document.getElementById("edit-device").style.display = "none";
    document.getElementById("save-device").style.display = "";

    // Enable the Editors
    cppEditorGlobal.setOption("readOnly", false);
    cppEditorSetup.setOption("readOnly", false);
    cppEditorGet.setOption("readOnly", false);
    cppEditorSet.setOption("readOnly", false);

    // Enable the label and pin output editors
    document.forms.addDevice.labelDevice.disabled = false;

    // How much elements need to be re-enabled?
    var tam = document.forms.addDevice.pinsDevice.value;

    // Elements
    var formAddDevice = document.addDevice;
    var radios = formAddDevice.pinsDevice;
    var pinsLabel = [formAddDevice.pinLabel1, formAddDevice.pinLabel2,
                formAddDevice.pinLabel3, formAddDevice.pinLabel4];
    var entradas = [document.addDevice.elements["typePin1"],
                    document.addDevice.elements["typePin2"],
                    document.addDevice.elements["typePin3"],
                    document.addDevice.elements["typePin4"]];
    var metodos = document.addDevice.elements["methodsAllowed"];
    var editorBack = document.getElementsByClassName("cm-s-default");

    // Enable the other objects of the form
    for (var i=0; i < 4; i++)
        radios[i].disabled = false;
    for (var i=0; i < tam; i++)
        pinsLabel[i].disabled = false;
    for (var i = 0; i < tam; i++) {
        entradas[i][0].disabled = false;
        entradas[i][1].disabled = false;
        entradas[i][2].disabled = false;
    }
    for(var i = 0; i < 3; i++)
        metodos[i].disabled = false;
    for(var i = 0; i < 4; i++)
        editorBack[i].style.backgroundColor = "";
};

document.getElementById("selectDev").selected = true;
document.getElementById("options-newdevice").onchange();