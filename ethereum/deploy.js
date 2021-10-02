const HDWalletProvider=require('truffle-hdwallet-provider');
const Web3=require('web3');
const compiledFactory=require('./build/CompanyFactory.json');
const { meta_pass, infura_api } = require('./private');

const provider=new HDWalletProvider(
    meta_pass,infura_api
   
);

const web3=new Web3(provider);

const deploy=async ()=>{
    //GET LIST OF ACCOUNTS 
    const accounts=await web3.eth.getAccounts();

    console.log("Attempting to deploy from account",accounts[0]);
    //DEPLOY TO RINKEBY
   const result= await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data:compiledFactory.bytecode})
    .send({from:accounts[0],gas:'3000000'});

    // console.log(interface);
    console.log("Contract deployed to",result.options.address); //contract address on blockchain
    
};
deploy();