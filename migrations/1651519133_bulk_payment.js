const BulkPayment = artifacts.require("BulkPayment");

module.exports = function(deployer, _network, accounts) {
  deployer.deploy(BulkPayment, accounts[0]);
};