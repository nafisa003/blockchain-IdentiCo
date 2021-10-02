const path=require('path');
const solc=require('solc');
const fs=require('fs-extra');


let buildPath=path.resolve(__dirname,'build');
fs.removeSync(buildPath);

const companyPath=path.resolve(__dirname,'contracts','Company.sol');
const source=fs.readFileSync(companyPath,'utf8');
const output=solc.compile(source,1).contracts;

// console.log(output);
fs.ensureDirSync(buildPath);

for(let contract in output){
    fs.outputJSONSync(
        path.resolve(buildPath,contract.replace(':','')+'.json'),
        output[contract]
    );
}
