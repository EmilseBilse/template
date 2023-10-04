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

            // Transform the data
            const transformedData: string = data.split('\n').map(line => {
                if (line.trim() === 'emil') {
                    return 'john yes';
                }
                return line + ' yes';
            }).join('\n');

            // Construct the output file name and path
            const outputFileName: string = 'output_' + file;
            const outputFilePath: string = path.join(outputDirectory, outputFileName);

            // Write the transformed data to the output file
            fs.writeFile(outputFilePath, transformedData, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                    console.error(`Error writing to the file ${outputFileName}:`, err);
                    return;
                }
                console.log(`Data written successfully to ${outputFileName}!`);
            });
        });
    });
});
