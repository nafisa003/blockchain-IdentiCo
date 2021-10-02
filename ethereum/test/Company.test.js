const assert=require('assert');
const ganache=require('ganache-cli');
const Web3=require('web3');
const web3=new Web3(ganache.provider());

const compiledFactory=require('../build/CompanyFactory.json');
const compiledCampaign=require('../build/Company.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async()=>{
    accounts=await web3.eth.getAccounts();

    //create a new factory and deploy it   
    factory=await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data:compiledFactory.bytecode})
    .send({from:accounts[0],
          gas:'3000000'
        });

    await factory.methods.createCompany('Gucci','100').send({             //returns nothing but trx receipt
        from:accounts[0],
        gas:'3000000'
    });

    const addresses=await factory.methods.getDeployedCompanies().call(); //returns array
    campaignAddress=addresses[0]; //get address of campaign
     
    //get the campaign deployed at that address
    campaign=await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    ) //no need to execute deploy and send
});

describe('Campaigns',()=>{

    it('deploys a factory and a campaign',()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

}
);