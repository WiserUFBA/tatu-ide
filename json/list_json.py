#!/bin/python

# Developed By Jeferson Lima
# Transform a list of JSON files in a array of strings

import os
import glob

# Remove old files if they are present
os.remove('list.json')

# Get all the files that end with *.json
files_list = glob.glob("*.json")

# Initialize the result string and the length variable
tam = 0
saida = '{"arquivos":['

# Put the files found in the result string
for json_file in files_list:
    saida += '"' + json_file + '"'
    saida += ','
    tam += 1

# Close the string as a JSON file
saida = saida[:-1]
saida += '], "length":' + str(tam) + '}\n'

# Save the JSON string into a file
arq = open('list.json', 'w')
arq.write(saida)
arq.close()

# Exit the program
print("Result JSON = " + saida)
print("Thanks!")
