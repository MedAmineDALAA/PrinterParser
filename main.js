const fs = require('fs');
const path = require('path');

// File path (assuming the file is in the same directory as this script)
const filePath = path.join(__dirname, 'data.txt');

// Read the ASCII data from the file
const data = fs.readFileSync(filePath, 'utf-8');

// Regex patterns to capture the data
const regexIndexAvant = /INDEX AVANT LIVRAISON\s*:\s*(\d+)/;
const regexIndexApres = /INDEX APRES LIVRAISON\s*:\s*(\d+)/;
const regexVolumeLivre = /VOLUME LIVRE\s*:\s*(\d+)\s*Litres/;
const regexProduitLivre = /PRODUIT LIVRE\s*:\s*(\w+)/;
const regexDate = /\d{2}\/\d{2}\/\d{4}/;
const regexTimeStart = /\d{2}:\d{2}(?=\svv)/;
const regexTimeEnd = /(?<=vv\d{3,}\s{26})\d{2}:\d{2}/;

// Extracting the data
const indexAvant = data.match(regexIndexAvant)?.[1];
const indexApres = data.match(regexIndexApres)?.[1];
const volumeLivre = data.match(regexVolumeLivre)?.[1];
const produitLivre = data.match(regexProduitLivre)?.[1];
const date = data.match(regexDate)?.[0];
const timeStart = data.match(regexTimeStart)?.[0];
const timeEnd = data.match(regexTimeEnd)?.[0];

// Output the extracted data
console.log(`Index Avant Livraison: ${indexAvant}`);
console.log(`Index Apres Livraison: ${indexApres}`);
console.log(`Volume Livré: ${volumeLivre} Litres`);
console.log(`Produit Livré: ${produitLivre}`);
console.log(`Date: ${date}`);
console.log(`Start Time: ${timeStart}`);
console.log(`End Time: ${timeEnd}`);
