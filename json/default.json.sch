/*
	Created by Jeferson Lima
	JSON schema for TATU IDE Web Application
*/
{
	// Just to assegurate this is a schema
	"schema": true,
	// The system and versions are variables used to differentiate this json from others
	"system": "tatu-ide",
	"version": 0.8,
	// The default name is the name used in the 
	"defaultName": "<string>",
	// Label is the name used to filter this 
	"label": "<string>",
	// Number of the used pins
	"numberOfPins": "<int>",
	// Label of the pins
	"pinLabel": [
		"<string>", // Pin 1
		"<string>", // Pin 2
		"<string>", // Pin 3
		"<string>"  // Pin 4
	],
	// Types of the pins
	"pinType":[
		"<string>", // Pin 1
		"<string>", // Pin 2
		"<string>", // Pin 3
		"<string>"  // Pin 4
	],
	// Code in global area
	"globalCode": "<string>",
	// Code in setup area
	"setupCode": "<string>",
	// Methods allowed
	"methodsAllowed": "<string>:GET|SET|BOTH"
	// Code used to GET
	"getCode": "<string>",
	// Code used to SET
	"setCode": "<string>"
}