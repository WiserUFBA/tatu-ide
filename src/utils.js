"use strict";

// Stack Overflow little trick
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

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

// Generate a random mac using the following header
function randomMac () {
    var mac_generated = "0xFA, 0xCA, 0xAA, ";
    for (var i = 0 ; i < 5; i++)
        mac_generated += "0x" + Math.floor(Math.random()*254).toString(16).toUpperCase() + ", ";
    mac_generated = mac_generated.slice(0, mac_generated.length - 2);
    console.log("The mac Generated is " + mac_generated);
    return mac_generated;
}

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