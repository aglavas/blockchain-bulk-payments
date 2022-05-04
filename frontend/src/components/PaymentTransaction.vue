<template>
  <div>
    <div class="row mt-6">
        <div class="col-sm-10">
            <div class="form-group rcorners1">
                <div class="w-75 card-margin">
                    <label class="h3">ETH Address</label>
                    <input v-model="paymentTransaction.address" type="text" class="form-control" required>
                    <div class="mt-2 mb-5"> 
                        <label class="h3">Amount in WEI</label>
                        <input v-model="paymentTransaction.amount" type="number" min="10" class="form-control" required>
                    </div>
                    <ValidationErrors :errors="paymentTransaction.validationErrors"></ValidationErrors>
                </div>
            </div>
        </div>
        <div class="col-sm-2">
            <div class="mt-5" v-if="paymentTransaction.position == 1">
                <svg @click="(active) ? $emit('addOne') : ''" xmlns="http://www.w3.org/2000/svg" width="50" height="50" v-bind:class="buttonClass()" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                </svg>
            </div>
            <div class="mt-5" v-if="paymentTransaction.position == 2">
                <svg @click="$emit('remove', id)" xmlns="http://www.w3.org/2000/svg" width="50" height="50"  class="bi bi-x-lg btn-hover color-4 cursor-pointer" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
                    <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
                </svg>
            </div>
        </div>
      </div>
  </div>
</template>

<script>

import ValidationErrors from './ValidationErrors.vue'

export default {
  name: 'PaymentTransaction',
  emits: ['addOne', 'remove'],
  components: {
    ValidationErrors
  },
  props: {
      paymentTransaction: Object,
      id: Number,
      active: {
        type: Boolean,
        default: false,
      } 
  },
  methods: {
      buttonClass() {
        return {
        'btn-hover color-5 cursor-pointer': this.active,  
        'disabled': !this.active}
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
</style>
