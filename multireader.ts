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
            // Updated the coordinates parsing to be 4-tuple
            const coordinates: [number, number, number, number][] = [];
            for (let i = boardSize + 2; i < boardSize + 2 + numCoordinates; i++) {
                const [coords1, coords2] = lines[i].split(' ').map(coord => coord.split(',').map(num => parseInt(num, 10)));
                coordinates.push([coords1[0], coords1[1], coords2[0], coords2[1]]);
            }

            let results: string[] = [];
            coordinates.forEach(([x1, y1, x2, y2]) => {
                const visited: boolean[][] = Array(boardSize).fill(null).map(() => Array(boardSize).fill(false));

                if (dfs(x1, y1, x2, y2, board, visited)) {
                    results.push("SAME");
                } else {
                    results.push("DIFFERENT");
                }
            });

            console.log(results.join('\n'));

            // Construct the output file name and path
            const outputFileName: string = 'output_' + file;
            const outputFilePath: string = path.join(outputDirectory, outputFileName);

            // Write the transformed data to the output file
            fs.writeFile(outputFilePath, results.join('\n'), (err: NodeJS.ErrnoException | null) => {
                if (err) {
                    console.error(`Error writing to the file ${outputFileName}:`, err);
                    return;
                }
                console.log(`Data written successfully to ${outputFileName}!`);
            });
        });
    });
});

function dfs(x: number, y: number, targetX: number, targetY: number, board: string[][], visited: boolean[][]): boolean {
    if (x < 0 || x >= board.length || y < 0 || y >= board[0].length || visited[y][x] || board[y][x] === 'W') {
        return false;
    }

    if (x === targetX && y === targetY) {
        return true;
    }

    visited[y][x] = true;

    // Visit neighboring cells (up, down, left, right)
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let [dx, dy] of directions) {
        if (dfs(x + dx, y + dy, targetX, targetY, board, visited)) {
            return true;
        }
    }

    return false;
}