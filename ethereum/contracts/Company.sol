pragma solidity ^0.4.17;

contract CompanyFactory{
    address[] public deployedCompanies;
    
    function createCompany(string name,uint minimum) public{
        
        address newCompany=new Company(name,minimum,msg.sender);
        deployedCompanies.push(newCompany);
    }
    
    function getDeployedCompanies() public view returns (address[]){
        return deployedCompanies;
    }
}

contract Company{
    
    struct Product{
        uint price;
        uint stock;
        address manufacturer;
        address currentOwner;
        string ownerName;
        string productName;
        string status;
        bool complete;
        
    }
    
    
    //only manager has access
    modifier restricted(){
        require(msg.sender==manager);
        _;
    }
    Product[] public products;
    address public manager;
    mapping (address=>bool) public sellers;
    uint public minimumToBook;
    string public companyName;
    
    function Company(string name,uint minimum,address creator) public{  
        manager=creator;
        companyName=name;
        minimumToBook=minimum;
    }
    
    function bookProduct() public payable{
        require(msg.value>=minimumToBook);
        
        sellers[msg.sender]=true;
    }
    
    function createProduct(string productName,uint price,uint stock) 
    public restricted{
        
        Product memory newProduct=Product({
            productName:productName,
            price:price,
            stock:stock,
            manufacturer:msg.sender,
            currentOwner:msg.sender,
            status:"Ready To Go",
            ownerName:companyName,
            complete:false
        });
        
        products.push(newProduct);
    }
    
    function buyProduct(uint index,string sellerName) public payable{
        
        Product storage product=products[index];
        require(sellers[msg.sender]);
        require(product.currentOwner!=msg.sender);
        require(msg.value>= (product.price/3) );
        product.ownerName=sellerName;
        product.currentOwner=msg.sender;
        
    }
    
    function shipProduct(uint index) public restricted{
        
        Product storage product=products[index];
        product.status="Shipped";
        product.complete=true;
    }
    
    function getProductCount() public view returns (uint){
        return products.length;
    }
    
    function getSummary() public view returns(uint,string,uint,address){
        return(
            minimumToBook,
            companyName,
            products.length,
            manager
            );
    }
    
    
}