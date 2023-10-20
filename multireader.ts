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

            const lines = data.trim().split('\n').filter(line => line !== "");

            const boardSize = parseInt(lines[0], 10);
            if (isNaN(boardSize) || lines.length < boardSize + 2) {
                console.error(`File ${file} is not correctly formatted.`);
                return;
            }

            const numRoutes = parseInt(lines[boardSize + 1], 10);
            const routes: [number, number][][] = [];

            for (let i = boardSize + 2; i < boardSize + 2 + numRoutes; i++) {
                const route = lines[i].split(' ').map(coord => {
                    const [x, y] = coord.split(',').map(num => parseInt(num, 10));
                    return [x, y] as [number, number];
                });

                routes.push(route);
            }

            let results: string = '';

            routes.forEach(route => {
                results = results + isRouteValid(route) + '\n';
            });

            // Construct the output file name and path
            const outputFileName: string = 'output_' + file;
            const outputFilePath: string = path.join(outputDirectory, outputFileName);

            // Write the transformed data to the output file
            fs.writeFile(outputFilePath, results, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                    console.error(`Error writing to the file ${outputFileName}:`, err);
                    return;
                }
                console.log(`Data written successfully to ${outputFileName}!`);
            });
        });
    });
});

function isRouteValid(route: [number, number][]) {
    const visited = new Set<string>();

    for (let i = 0; i < route.length; i++) {
        const [x1, y1] = route[i];

        const keyCurrent = `${x1},${y1}`;

        if (visited.has(keyCurrent)) {
            return "INVALID";
        }

        visited.add(keyCurrent);

        if (i < route.length - 1) {
            const [x2, y2] = route[i + 1];

            // Check for diagonal crossings
            if (Math.abs(x1 - x2) === 1 && Math.abs(y1 - y2) === 1) {
                // A diagonal move was made
                const cross1 = `${x1},${y2}`;
                const cross2 = `${x2},${y1}`;
                if (visited.has(cross1) && visited.has(cross2)) {
                    return "INVALID";
                }
            }
        }
    }

    return "VALID";
}

