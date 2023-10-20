import * as fs from 'fs';
import * as path from 'path';
import {AStarFinder} from "astar-typescript";

const inputDirectory: string = path.join(__dirname, 'input');
const outputDirectory: string = path.join(__dirname, 'output');

// Read all files in the input directory
fs.readdir(inputDirectory, (err: NodeJS.ErrnoException | null, files: string[]) => {
    if (err) {
        console.error('Error reading the directory:', err);
        return;
    }

    files.forEach(file => {
        const inputFilePath: string = path.join(inputDirectory, file);
        
        // Read the content of the file
        fs.readFile(inputFilePath, 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
            if (err) {
                console.error(`Error reading the file ${file}:`, err);
                return;
            }

            const mapOffset = data.split("\n")[0];
            const map = data.split("\n").slice(1, parseInt(mapOffset) + 1);

            const coordSets = data.split("\n").slice(parseInt(mapOffset) + 2, -1);

            coordSets.forEach((coordSet) => {
                let test = coordSet.split(" ");
            });

            let coords = coordSets.map((coordSet) => {
                return coordSet.split(" ");
            });

            //make map into a matrix grid of 0 if the map has a W and 1 if the map has a L on the spots
            const grid = map.map((row) => {
                return row.split("").map((spot) => {
                    if (spot === "W") {
                        return 0;
                    } else {
                        return 1;
                    }
                });
            });

            let aStarInstance = new AStarFinder({
                grid: {
                    matrix: grid,
                },
            });

            let outputs: string[] = [];

            coords.forEach((coordPair) => {
                let startPos = { x: parseInt(coordPair[0].split(",")[0]), y: parseInt(coordPair[0].split(",")[1]) };
                let endPos = { x: parseInt(coordPair[1].split(",")[0]), y: parseInt(coordPair[1].split(",")[1]) };
                const path = aStarInstance.findPath(startPos, endPos);

                const pathOutput = path.map((coord) => `${coord[0]},${coord[1]}`).join(" ");
                outputs.push(pathOutput);
            });

            const output = outputs.join("\n");

            // Construct the output file name and path
            const outputFileName: string = 'output_' + file;
            const outputFilePath: string = path.join(outputDirectory, outputFileName);

            // Write the transformed data to the output file
            fs.writeFile(outputFilePath, output, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                    console.error(`Error writing to the file ${outputFileName}:`, err);
                    return;
                }
                console.log(`Data written successfully to ${outputFileName}!`);
            });
        });
    });
});
