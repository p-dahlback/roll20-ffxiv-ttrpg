#!/bin/bash
version="1.0.0"

echo "Generating sheet.html"
baseFile=$1
sheetWorkerDirectory=$2

echo "Inserting base content from $baseFile"
cat $baseFile > sheet.html

printf "%b\n" "\n\n<!-- -----------------SHEET WORKERS (version $version)----------------- -->\n" >> sheet.html

for file in $sheetWorkerDirectory/*.js
do
  [ -e "$file" ] || continue
  echo "Copying sheet worker $file into sheet.html"
  content=$(cat $file)
  printf "%b\n" "\n<script type=\"text/worker\"> // $file\n" >> sheet.html
  printf "%s\n" "$content" >> sheet.html
  printf "%b\n" "\n</script>" >> sheet.html
done