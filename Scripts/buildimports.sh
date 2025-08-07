#!/bin/bash
version="1.0.0"

echo "Integrating imports"
buildDir=".build/$1"
sourceDirectory=$2
insertNameConstant="${3:-"0"}"
useRealNames="${4:-"0"}"

function mergeIntoFile () {
    printf "%b\n" "// Build (version $version): $1\n" >> $2
    cat $1 >> $2
    printf "%b\n" "\n" >> $2
}

function readImports () {
    result=$(sed -n "/build:import/p" "$1")

    if [ -z "$result" ]; then
        return 0
    fi

    # Make into array by newlines
    echo "Reading imports in $1"
    set -o noglob
    IFS=$'\n' importStatements=($result)
    set +o noglob 

    for import in "${importStatements[@]}"
    do
        cleanImport=$(sed "s/.*build:import \(.*\)\.js.*/\1/" <<< $import)
        if [ -z "$cleanImport" ]; then
            echo "Skipping $import"
            continue
        fi
        fullImport="$sourceDirectory/$cleanImport.js"
        echo "Importing $fullImport for $3"
        mergeIntoFile "$fullImport" "$2"
    done

    return 1
}

if test -d $buildDir; then
    rm -r $buildDir/*
else
    mkdir -p $buildDir
fi

for file in $sourceDirectory/*.js
do
    filename=$(basename -- "$file")
    filename="${filename%.*}"

    id=$(uuidgen)
    targetFile="$buildDir/$id.js"
    printf "%b\n" "// Build (version $version), generated file $filename\n" > $targetFile
    printf "%b\n" "const ${filename}Imports = new (function() {\n    this.export = {};\n" >> $targetFile

    if [ $insertNameConstant = "1" ]; then
        printf "%b\n" "const workerName = \"$filename\"\n" >> "$targetFile"
    fi

    readImports "$file" "$targetFile" "$file"

    if test -d $sourceDirectory/$filename; then
        importDirectory="$sourceDirectory/$filename"

        # Read all code from the directory
        while IFS= read -r -d '' -u 9
        do
            subfile=$REPLY
            if [ "$(basename -- "$subfile")" = "imports.js" ]; then
                readImports "$subfile" "$targetFile" "$file"
                continue
            fi
            echo "Importing $subfile for $file"
            mergeIntoFile "$subfile" "$targetFile"
        done 9< <( find $importDirectory -name "*js" -type f -exec printf '%s\0' {} + )
    fi

    echo "Finalizing $file"
    printf "%b\n" "\n})();\n" >> $targetFile
    printf "%b\n" "// Build: $file\n\n" >> "$targetFile"
    cat $file >> "$targetFile"

    # Discarding anything marked with build:remove
    sed -i -e '/build:remove/,/build:end/d' $targetFile

    if [ $useRealNames = "1" ]; then
        newFile="$buildDir/$filename.js"
        mv "$targetFile" "$newFile"
    fi
done
