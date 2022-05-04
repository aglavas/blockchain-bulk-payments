<template>
  <div id="app" v-if="ready">
    <head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    </head>
    <div class="container">
      <h1>Bulk Payment</h1>
      <hr>
      <PaymentTransaction 
        v-for="(paymentTransaction, index) in paymentTransactions"
        :key="index"
        :id="index"
        :paymentTransaction="paymentTransaction"
        :active="addActive"
        @addOne="addOneRow"
        @remove="removeRow"
        ></PaymentTransaction>
      <div class="row mt-6">
        <div class="col-sm-4">
          <button type="button" @click="sendPayments" class="btn btn-primary btn-lg btn-block">Send Payments</button>
        </div>
        <div class="col-sm-4">
          Wallet balance: {{ walletBalance }} WEI ({{ walletBalanceEth }} ETH)
        </div>
        <div class="col-sm-4">
          <p> {{ result}} </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BulkPayment from './models/bulkPayment.js'
import PaymentTransaction from './components/PaymentTransaction.vue'

export default {
  name: 'App',
  components: {
    PaymentTransaction
  },
  data() {
    return {
      paymentTransactions: [],
      addActive: false,
      bulkPayment: false,
      web3: false,
      walletBalance: 0,
      ready: false,
      result: null
    }
  },
  computed: {
    walletBalanceEth: function() {
      return this.web3.utils.fromWei(this.walletBalance, 'ether');
    }
  },
  async mounted() {
    let bulkPayment = new BulkPayment();
    await bulkPayment.init();
    this.bulkPayment = bulkPayment;
    this.web3 = this.bulkPayment.web3;
    this.walletBalance = await this.bulkPayment.getBalance();
    this.paymentTransactions.push({
      address: null,
      amount: null,
      validationErrors: [],
      position: 1,
    })
    this.ready = true;
  },
  watch: { 
    paymentTransactions: {
      handler(transactions) {
        let active = false;
        transactions.forEach(paymentTransaction => {
          active = (paymentTransaction.address && paymentTransaction.address.length && paymentTransaction.amount && paymentTransaction.amount.length);
        }, active);
          
        if (this.$children.length) {
          if (active) {
            this.addActive = true;
          } else {
            this.addActive = false;
          }
        }
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    addOneRow() {
      this.paymentTransactions.push({
        address: null,
        amount: null,
        validationErrors: [],
        position: 2,
      })
    },
    async sendPayments() {
      let validationResult = this.validatePaymentData();

      if (!validationResult) {
        return true;
      }

      let addressArray = [];
      let amountArray = [];

      this.paymentTransactions.forEach((item) => {
        addressArray.push(item.address);
        amountArray.push(item.amount);
      }, addressArray, amountArray)
      
      this.bulkPayment.sendPayments(addressArray, amountArray).then(() => {
        this.result = "Payments successfully sent."
      }).catch(() => {
        this.result = "Error while sending payments."
      })
    },
    validatePaymentData() {
      let hasErrors = false;
      let amount = 0;
      this.paymentTransactions.forEach((item) => {
        if (!item.address) {
          item.validationErrors.push({
            key: 'address',
            msg: "ETH address is missing.",
          })  
          hasErrors = true;
        }

        if (!item.amount) {
          item.validationErrors.push({
            key: 'address',
            msg: "ETH address is missing.",
          })  

          hasErrors = true;
        } else {
          amount += item.amount;
        }
      });

      console.log(amount); //Implement validation for amount

      return !hasErrors;
    },
    removeRow(index) {
      this.$delete(this.paymentTransactions, index);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}


.rcorners2 {
  border-radius: 25px;
  border: 2px solid #73AD21;
  padding: 20px;
  height: 220px;
}

.rcorners1 {
  border-radius: 25px;
  background: #61bcd8;
  padding: 20px;
  height: auto;
}

.card-margin {
  margin-left: 6.5rem!important;
}

.cursor-pointer{
  cursor: pointer;
}

.disabled
{
    opacity:0.5;
}

.btn-hover {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    margin: 20px;
    height: 55px;
    text-align:center;
    border: none;
    background-size: 300% 100%;

    border-radius: 50px;
    moz-transition: all .4s ease-in-out;
    -o-transition: all .4s ease-in-out;
    -webkit-transition: all .4s ease-in-out;
    transition: all .4s ease-in-out;
}

.btn-hover:hover {
    background-position: 100% 0;
    moz-transition: all .4s ease-in-out;
    -o-transition: all .4s ease-in-out;
    -webkit-transition: all .4s ease-in-out;
    transition: all .4s ease-in-out;
}

.btn-hover:focus {
    outline: none;
}

.btn-hover.color-1 {
    background-image: linear-gradient(to right, #25aae1, #40e495, #30dd8a, #2bb673);
    box-shadow: 0 4px 15px 0 rgba(49, 196, 190, 0.75);
}
.btn-hover.color-2 {
    background-image: linear-gradient(to right, #f5ce62, #e43603, #fa7199, #e85a19);
    box-shadow: 0 4px 15px 0 rgba(229, 66, 10, 0.75);
}
.btn-hover.color-3 {
    background-image: linear-gradient(to right, #667eea, #764ba2, #6B8DD6, #8E37D7);
    box-shadow: 0 4px 15px 0 rgba(116, 79, 168, 0.75);
}
.btn-hover.color-4 {
    background-image: linear-gradient(to right, #fc6076, #ff9a44, #ef9d43, #e75516);
    box-shadow: 0 4px 15px 0 rgba(252, 104, 110, 0.75);
}
.btn-hover.color-5 {
    background-image: linear-gradient(to right, #0ba360, #3cba92, #30dd8a, #2bb673);
    box-shadow: 0 4px 15px 0 rgba(23, 168, 108, 0.75);
}
.btn-hover.color-6 {
    background-image: linear-gradient(to right, #009245, #FCEE21, #00A8C5, #D9E021);
    box-shadow: 0 4px 15px 0 rgba(83, 176, 57, 0.75);
}
.btn-hover.color-7 {
    background-image: linear-gradient(to right, #6253e1, #852D91, #A3A1FF, #F24645);
    box-shadow: 0 4px 15px 0 rgba(126, 52, 161, 0.75);
}
.btn-hover.color-8 {
    background-image: linear-gradient(to right, #29323c, #485563, #2b5876, #4e4376);
    box-shadow: 0 4px 15px 0 rgba(45, 54, 65, 0.75);
}
.btn-hover.color-9 {
    background-image: linear-gradient(to right, #25aae1, #4481eb, #04befe, #3f86ed);
    box-shadow: 0 4px 15px 0 rgba(65, 132, 234, 0.75);
}
.btn-hover.color-10 {
        background-image: linear-gradient(to right, #ed6ea0, #ec8c69, #f7186a , #FBB03B);
    box-shadow: 0 4px 15px 0 rgba(236, 116, 149, 0.75);
}
.btn-hover.color-11 {
       background-image: linear-gradient(to right, #eb3941, #f15e64, #e14e53, #e2373f);  box-shadow: 0 5px 15px rgba(242, 97, 103, .4);
}



</style>
