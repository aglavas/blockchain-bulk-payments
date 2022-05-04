const BulkPayment = artifacts.require('BulkPayment');
const truffleAssert = require('truffle-assertions');

contract('BulkPayment', (accounts) => {
  let bulkPayment = null;
  before(async () => {
    bulkPayment = await BulkPayment.deployed();
  });

  it('Should set accounts[0] as owner', async () => {
    const owner = await bulkPayment.owner();
    assert(owner === accounts[0]);
  });

  it('Shouldnt send bulk payment if the params are malformed', async () => {
    const recipients = [accounts[1], accounts[2], accounts[3]];
    const amounts = [40, 20];
    await truffleAssert.reverts(bulkPayment.sendPayments(recipients, amounts, {from: accounts[0]}), 'Address list and amounts must be of the same length.');
  });

  it('Should allow usage only to owner', async () => {
    const recipients = [accounts[1], accounts[2], accounts[3]];
    const amounts = [40, 20, 30];
    await truffleAssert.reverts(bulkPayment.sendPayments(recipients, amounts, {from: accounts[0]}), 'VM Exception while processing transaction: revert');
  });

  it('Should send bulk payments', async () => {
    const recipients = [accounts[1], accounts[2], accounts[3]];
    const amounts = [20000000, 30000000, 40000000];

    const initialBalances = await Promise.all(recipients.map(recipient => {
        return web3.eth.getBalance(recipient);
    }));

    let etherAmount = web3.utils.toWei("10", "ether");
    await bulkPayment.sendPayments(recipients, amounts, {from: accounts[0], value: etherAmount})
    const finalBalances = await Promise.all(recipients.map(recipient => {
        return web3.eth.getBalance(recipient);
    }));

    recipients.forEach((_item, i) => {
        const finalBalance = web3.utils.toBN(finalBalances[i]);
        const initialBalance = web3.utils.toBN(initialBalances[i]);
        assert(finalBalance.sub(initialBalance).toNumber() === amounts[i]);
    });
  });
});