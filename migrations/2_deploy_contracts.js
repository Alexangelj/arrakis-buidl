const Test = artifacts.require("Test");

module.exports = function(deployer) {
  deployer.deploy(Test, 10000, 'test', 18, 'TST');
};
