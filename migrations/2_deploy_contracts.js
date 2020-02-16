const Rad = artifacts.require("Rad");
const Test20 = artifacts.require("Test20");
const Test721 = artifacts.require("Test721");

const totalSupply = (10**18).toString()
const _name721 = "Bufficorn"
const _symbol721 = "BUFF"

module.exports = function(deployer) {

  
  deployer.deploy(Rad);
  deployer.deploy(Test20, "Test Erc20 Token", "TEST", 18, totalSupply)
  deployer.deploy(Test721, _name721, _symbol721);
};
