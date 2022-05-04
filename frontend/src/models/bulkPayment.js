import { initWeb3, contractAddress, initContract} from '../utils.js'


class BulkPayment {
    async init() {
        this.web3 = await initWeb3();
        this.bulkPayment = await initContract(this.web3);
        this.accounts = await this.web3.eth.getAccounts().then(result => {
            return result;
        });
    }

    async getBalance() {
        return this.web3.eth.getBalance(contractAddress);
    }

    async sendPayments(to, amount) { //@todo auto add missing coins (transaction value) to complete operation
        return this.bulkPayment.methods.sendPayments(to, amount).send({from: this.accounts[0]});
    } 
}

export default BulkPayment;
