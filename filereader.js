const fs = require('fs');
const path = require('path');

// Path to the input file
const inputFilePath = path.join(__dirname, 'input', 'tester.in');

// Path to the output directory
const outputDirectory = path.join(__dirname, 'output');

// Read the input file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Transform the data by adding "yes" after each line
    const transformedData = data.split('\n').map(line => line + 'yes').join('\n');

    // Define the output file path
    const outputFilePath = path.join(outputDirectory, 'output.in');

    // Write the transformed data to the output file
    fs.writeFile(outputFilePath, transformedData, (err) => {
        if (err) {
            console.error('Error writing to the file:', err);
            return;
        }
        console.log('Data written successfully to the output file!');
    });
});