<template>
  <div>
    <b-alert :variant="alert.variant" :show=3 v-if="alert.show" dismissible @dismissed="alert.show=false">{{alert.msg}}</b-alert>
    <div class="d-flex justify-content-center align-items-center">
      <span style="font-size: 50px" class="mr-auto col-md-8">{{totalAmount.toLocaleString({currency: 'VND'})}}</span>
      <div v-if="isCreatingOrder" style="margin:5px" class="align-self-right">
        <b-button variant="danger" style="margin:5px" @click="cancelOrder">Huỷ đơn</b-button>
        <b-button variant="success" style="margin:5px" @click="submitOrder">Tạo đơn</b-button>
      </div>
    </div>
    <b-list-group class="d-flex justify-content-center">
        <b-list-group-item v-for="drink in drinks" :key="drink['_id']" class="d-flex justify-content-center">
          <b-button class="p-2" @click="drink.quantity++;isCreatingOrder=true;totalAmount+=drink.price">+</b-button>
          <span class="col-md-2 d-flex flex-row">
            <div class="col-md-11">
              {{drink.name}} <br/>
              {{drink.price.toLocaleString({currency: 'VND'})}}
            </div>
            <b-badge variant="primary" pill class="align-self-center">{{drink.quantity}}</b-badge>
          </span>
          <b-button class="p-2" @click="drink.quantity--;totalAmount-=drink.price" v-bind:disabled="drink.quantity<=0">-</b-button>
        </b-list-group-item>
      </b-list-group>
    </div>
</template>

<script>
import axios from "axios";
export default {
  name: "app",
  data() {
    return {
      drinks: null,
      isCreatingOrder: false,
      totalAmount: 0,
      alert: {
        show: false,
        msg: '',
        variant: 'success'
      }
    };
  },
  mounted() {
    axios.get(`/drinks`).then(response => {
      var drinks = response.data;
      for (var drink of drinks) {
        drink.quantity = 0;
      }
      this.drinks = drinks;
    });
  },
  methods: {
    cancelOrder() {
      this.isCreatingOrder = false
      this.drinks.forEach(drink => drink.quantity = 0)
      this.totalAmount = 0
    },
    submitOrder() {
      axios.post('/orders', {
        items: this.drinks.filter(drink => drink.quantity>0),
        amount: this.totalAmount
      }).then(response => {
          this.alert = {
            show: true,
            msg: response.data.message,
            variant: 'success'
          }
          this.cancelOrder()
      }).catch(err => {
          this.alert = {
            show: true,
            msg: err.response.data.message,
            variant: 'danger'
          }
      })
    }
  }
};
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>