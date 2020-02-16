const Rad = artifacts.require("Rad");
const Test20 = artifacts.require("Test20");

module.exports = function(deployer) {

  var totalSupply = (10**18).toString()
  deployer.deploy(Rad);
  deployer.deploy(Test20, "Test Erc20 Token", "TEST", 18, totalSupply)
};
