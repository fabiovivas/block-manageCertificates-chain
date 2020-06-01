const fs = require('fs');

let rawdata = fs.readFileSync('./build/contracts/ManageCertificate.json');
let smartContract = JSON.parse(rawdata);
let abi = JSON.stringify(smartContract.abi)
fs.writeFileSync('abi.json', abi);