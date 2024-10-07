const { SerialPort } = require('serialport');

// Replace with your COM port and baud rate
const port = new SerialPort({
  path: 'COM2',  // Change to your port
  baudRate: 9600,
  autoOpen: false
});

// Open the port manually
port.open((err) => {
  if (err) {
    return console.error('Error opening the port: ', err.message);
  }
  console.log('Port opened successfully');
});

let dataBuffer = '';  // Buffer to accumulate incoming data

// Define function to replace special characters with readable form
function parseSpecialChars(data) {
  return data
    .replace(/<27>/g, '')  // Replace ESC sequences (ASCII 27)
    .replace(/<\n>/g, '\n')   // Replace newline placeholders
    .replace(/<\f>/g, '')     // Replace form feed
    .replace(/ÿ/g, '')        // Remove invalid characters
    .replace(/<\d+>/g, '');   // Optionally remove any remaining control codes
}

// Specific extraction function for the required fields
function extractSpecificData(parsedData) {
  const result = {};
  
  // Define regex patterns for the required fields
  const patterns = {
    'BON DE LIVRAISON': /LIVRAISONNN\s*:\s*([^\n]+)/,
    'INDEX AVANT LIVRAISON': /INDEX AVANT LIVRAISON\s*:\s*(\d+)/,
    'INDEX APRES LIVRAISON': /INDEX APRES LIVRAISON\s*:\s*(\d+)/,
    'VOLUME LIVRE': /VOLUME LIVRE\s*:\s*(\d+)\s*Litres/,
    'PRODUIT LIVRE': /PRODUIT LIVRE\s*:\s*([^<\n]+)/,  // Adjusted pattern
    'TEST CLIENT': /TESTE CLIENT\s*:\s*([^\n]+)/,
    'SITE': /SITE\s*:\s*([^\n]+)/,
    'HEURE DEBUT': /HEURE DEBUT\s*:\s*([^\n]+)/,
    'HEURE FIN': /HEURE FIN\s*:\s*([^\n]+)/,
  };

  // Iterate over each pattern and extract values
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = parsedData.match(pattern);
    result[key] = match ? match[1].trim() : 'N/A';  // Store the extracted value or 'N/A' if not found
  }

  return result;
}

port.on('data', (chunk) => {
  // Append the chunk to the buffer
  dataBuffer += chunk.toString('binary');

  // Process the buffer using the custom parsing rules
  let parsedData = parseSpecialChars(dataBuffer);

  // Extract specific data based on the defined patterns
  let extractedData = extractSpecificData(parsedData);

  // Log the extracted specific data
  console.log('Extracted Data:', extractedData);

  // Clear the buffer after processing
  dataBuffer = '';
});

// Error handling
port.on('error', (err) => {
  console.error('Serial port error: ', err.message);
});
