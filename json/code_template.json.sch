#include <stdint.h>
#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>
#include <TATUDevice.h>
#include <TATUInterpreter.h>

// Device constants
#define DEVICE_ID       $(DEVICE_ID)$
#define DEVICE_NAME     $(DEVICE_NAME)$
#define DEVICE_PAN_ID   $(DEVICE_PAN_ID)$

// Information for connection with broker
#define MQTT_USER       $(MQTT_USER)$
#define MQTT_PASS       $(MQTT_PASS)$
#define MQTT_PORT       $(MQTT_PORT)$

// Message for annoucement of connection
const char hello [] PROGMEM = DEVICE_NAME " -- has connected";

// System properties
byte mac[]    = { $(DEVICE_MAC)$ };
byte ip[]     = { $(DEVICE_IP)$ };
byte server[] = { $(SERVER_IP)$ };

// The get function is called when a information is required
bool get(uint32_t hash,void* response,uint8_t code){
    
    // With the hash we know what atributte
    switch(hash){
        $(PROPERTIES_GET)$
        default:
            return false;
    }
    
    return true; 
}

// The set function is called when a modification is required
// Notice that the order of the parameters is diferent from the get function
bool set(uint32_t hash, uint8_t code,void* request){
    
    // With the hash we know what atributte
    switch(hash){
        $(PROPERTIES_SET)$
        default:
            return false;
    }
    
    return true; 
}

// Objetos para exemplo usando interface internet
EthernetClient ethClient;
TATUInterpreter interpreter;
TATUDevice device(DEVICE_NAME, ip, DEVICE_ID, DEVICE_PAN_ID, 0, server, MQTT_PORT, OS_VERSION, &interpreter, get, set);
MQTT_CALLBACK(bridge, device, mqtt_callback);
PubSubClient client(server, MQTT_PORT, mqtt_callback , ethClient);
MQTT_PUBLISH(bridge, client);

/* Constructs the JSON that describes the device
    Use ADD_SENSORS("sensor_name", "type", "pin") to add sensors
    In the last sensor that you want to add don't forget to use
    ADD_LAST_SENSOR("sensor_name", "type", "pin")
    If you don't have any sensor/actuator to add, use ADD_NONE()
*/
CREATE_DOD(DEVICE_NAME,
    ADD_LAST_SENSOR("sensor_name", "type", "pin"),
    ADD_NONE()
);

/* Nao e necessario editar as linhas abaixo ao nao ser que tenha modificado alguma variavel */
void setup() { 
    char aux[16];  
    Serial.begin(9600);
    Ethernet.begin(mac, ip);  

    configurar();

    //Trying connect to the broker  
    while(!client.connect(device.name,MQTT_USER,MQTT_PASS));
    client.publish("dev/CONNECTIONS",hello);
    client.subscribe(device.aux_topic_name);
    client.subscribe("dev");

    Serial.println("Conected");
}

void loop() { 
    client.loop(); 
    if(!client.connected()){
        reconnect();
    }
}

void reconnect() {
    // Loop until we're reconnected
    while (!client.connect(device.name, MQTT_USER, MQTT_PASS)) {
        Serial.print("Attempting MQTT connection...");
        // Attempt to connect
        if (client.publish("dev/CONNECTIONS",hello)) {
            Serial.print(device.name);
            Serial.println(" -- Connected");
        } 
        else {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            // Wait 5 seconds before retrying
            delay(5000);
        }
    }
}