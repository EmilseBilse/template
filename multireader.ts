import * as fs from 'fs';
import * as path from 'path';

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

            const lines = data.trim().split('\n').filter(line => line !== ""); // This will filter out any empty lines
            const boardSize = parseInt(lines[0], 10);

            if (isNaN(boardSize) || lines.length < boardSize + 2) {
                console.error(`File ${file} is not correctly formatted.`);
                return;
            }

            // Create the 2D array from the file content
            const board: string[][] = [];
            for (let i = 1; i <= boardSize; i++) {
                board.push([...lines[i]]);
            }

            const numCoordinates = parseInt(lines[boardSize + 1], 10);
            const coordinates: [number, number][] = [];
            for (let i = boardSize + 2; i < boardSize + 2 + numCoordinates; i++) {
                const [x, y] = lines[i].split(',').map(num => parseInt(num, 10));
                coordinates.push([x, y]);
            }

            let lettersArray: string[] = [];

            coordinates.forEach(([x, y]) => {
                // Adjusting the indices since the coordinates are 1-based
                const adjustedX = x;
                const adjustedY = y;

                if (adjustedX < boardSize && adjustedY < boardSize) {
                    const letter = board[adjustedY][adjustedX];  // Adjusted to get row (y) first and then column (x)
                    lettersArray.push(letter);
                } else {
                    console.error(`Coordinate (${x},${y}) is out of bounds for the board.`);
                }
            });

            const formattedString = lettersArray.join('\n');
            console.log(formattedString);

            // Construct the output file name and path
            const outputFileName: string = 'output_' + file;
            const outputFilePath: string = path.join(outputDirectory, outputFileName);

            // Write the transformed data to the output file
            fs.writeFile(outputFilePath, formattedString, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                    console.error(`Error writing to the file ${outputFileName}:`, err);
                    return;
                }
                console.log(`Data written successfully to ${outputFileName}!`);
            });
        });
    });
});
