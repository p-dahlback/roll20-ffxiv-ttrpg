#!/bin/bash
version="1.0.0"

echo "Generating sheet.html"
sourceDirectory=$1
baseFile=$2
sheetWorkerDirectory=$3

function contains() {
    # $1 - List
    # $2 - Item to check
    [[ $1 =~ (^|[[:space:]])$2($|[[:space:]]) ]] && echo "1" || echo "0"
}

function readImports () {
    # $1 - Base file
    # $2 - Target file
    # $3 - Base file name
    result=$(sed -n "/build:import/p" "$1")

    if [ -z "$result" ]; then
        return 0
    fi

    # Make into array by newlines
    echo "Reading imports in $1"
    set -o noglob
    IFS=$'\n' importStatements=($result)
    set +o noglob 

    declare -a importFiles
    latestIndex=0
    for import in "${importStatements[@]}"
    do
        cleanImport=$(sed "s/.*build:import \(.*\)\.html.*/\1/" <<< $import)
        if [ -z "$cleanImport" ]; then
            echo "Skipping $import"
            continue
        fi
        fullImport="$sourceDirectory/$cleanImport.html"
        containsResult=$(contains $importFiles "$fullImport")
        if [ $containsResult = "1" ]; then
            echo "Skipping $import; already handled"
            continue
        else
            echo "Importing $fullImport for $3"
            sed -i "/build:import $cleanImport.html/r$fullImport" $2
            importFiles[$latestIndex]="$fullImport"
            latestIndex=$((latestIndex+1))
        fi
    done

    return 1
}

echo "Inserting base content from $baseFile"
targetFile="sheet.html"
cat $baseFile > $targetFile

# Performing imports
readImports $baseFile $targetFile "$targetFile"

printf "%b\n" "\n\n<!-- -----------------SHEET WORKERS (version $version)----------------- -->\n" >> $targetFile

for file in $sheetWorkerDirectory/*.js
do
  [ -e "$file" ] || continue
  echo "Copying sheet worker $file into $targetFile"
  content=$(cat $file)
  printf "%b\n" "\n<script type=\"text/worker\">\n" >> $targetFile
  printf "%s\n" "$content" >> $targetFile
  printf "%b\n" "\n</script>" >> $targetFile
done