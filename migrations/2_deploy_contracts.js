var IotSecurity = artifacts.require("./IotSecurity.sol");

module.exports = function(deployer) {
  deployer.deploy(IotSecurity);
};
