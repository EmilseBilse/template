const fs = require('fs');
const path = require('path');

const inputDirectory = path.join(__dirname, 'input');

const outputDirectory = path.join(__dirname, 'output');

// Read all files in the input directory
fs.readdir(inputDirectory, (err, files) => {
    if (err) {
        console.error('Error reading the directory:', err);
        return;
    }

    files.forEach(file => {
        const inputFilePath = path.join(inputDirectory, file);
        
        // Read the content of the file
        fs.readFile(inputFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading the file ${file}:`, err);
                return;
            }

            // Transform the data
            const transformedData = data.split('\n').map(line => {
                if (line.trim() === 'emil') {
                    return 'john yes';
                }
                return line + ' yes';
            }).join('\n');

            // Construct the output file name and path
            const outputFileName = 'output_' + file;
            const outputFilePath = path.join(outputDirectory, outputFileName);

            // Write the transformed data to the output file
            fs.writeFile(outputFilePath, transformedData, (err) => {
                if (err) {
                    console.error(`Error writing to the file ${outputFileName}:`, err);
                    return;
                }
                console.log(`Data written successfully to ${outputFileName}!`);
            });
        });
    });
});
