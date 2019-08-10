<template>
  <div>
    <b-alert
      :variant="alert.variant"
      :show="3"
      v-if="alert.show"
      dismissible
      @dismissed="alert.show=false"
    >{{alert.msg}}</b-alert>
    <div class="d-flex justify-content-center align-items-center">
      <span
        style="font-size: 50px"
        class="mr-auto col-md-8"
      >{{totalAmount.toLocaleString({currency: 'VND'})}}</span>
      <div v-if="isCreatingOrder" style="margin:5px" class="align-self-right">
        <b-button variant="danger" style="margin:5px" @click="cancelOrder">Huỷ đơn</b-button>
        <b-button variant="success" style="margin:5px" @click="submitOrder">Tạo đơn</b-button>
      </div>
    </div>
    <b-card-group>
      <b-card v-for="(drinks, type) in drinksByType" :key="type">
        <b-card-header v-b-toggle="type">{{type}}</b-card-header>
        <b-collapse :id="type" visible="true">
          <b-list-group class="d-flex justify-content-center">
            <b-list-group-item
              v-for="drink in drinks"
              :key="drink['_id']"
              class="d-flex justify-content-center flex-column"
            >
              <div class="p2 d-flex justify-content-center">
                <b-button class="p-2" @click="increaseDrinkQuantity(drink)">+</b-button>
                <span class="col-md-2 d-flex flex-row">
                  <div class="col-md-11">
                    {{drink.name}}
                    <br />
                    {{drink.price.toLocaleString({currency: 'VND'})}}
                  </div>
                  <b-badge variant="primary" pill class="align-self-center">{{drink.quantity}}</b-badge>
                </span>
                <b-button
                  class="p-2"
                  @click="drink.quantity--;totalAmount-=drink.price"
                  :disabled="drink.quantity<=0"
                >-</b-button>
              </div>
              <div v-if="drink.quantity>0" class="p-2">
                 <b-form-input v-model="drink.note" placeholder="Nhập ghi chú"></b-form-input>
              </div>
            </b-list-group-item>
          </b-list-group>
        </b-collapse>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "app",
  data() {
    return {
      drinksByType: null,
      isCreatingOrder: false,
      totalAmount: 0,
      alert: {
        show: false,
        msg: "",
        variant: "success"
      }
    };
  },
  mounted() {
    axios.get(`/drinks`).then(response => {
      var drinks = response.data;
      var drinksByType = new Map();
      drinks.forEach(drink => {
        drink.quantity = 0;
        drink.note = '';
        if (drinksByType[drink.type]) {
          drinksByType[drink.type].push(drink);
        } else {
          drinksByType[drink.type] = [drink];
        }
      });
      this.drinksByType = Object.assign({}, drinksByType);
    });
  },
  methods: {
    increaseDrinkQuantity(drink) {
      drink.quantity++;
      this.isCreatingOrder = true;
      this.totalAmount += drink.price;
    },
    cancelOrder() {
      this.isCreatingOrder = false;
      Object.entries(this.drinksByType).forEach(([, drinks]) => {
        drinks.forEach(drink => {
          drink.quantity = 0;
        });
      });
      this.totalAmount = 0;
    },
    submitOrder() {
      var drinksToOrder = [];
      Object.entries(this.drinksByType).forEach(([, drinks]) =>
        drinks.forEach(drink => {
          if (drink.quantity > 0) {
            drinksToOrder.push(drink);
          }
        })
      );
      axios
        .post("/orders", {
          items: drinksToOrder,
          amount: this.totalAmount
        })
        .then(response => {
          this.alert = {
            show: true,
            msg: response.data.message,
            variant: "success"
          };
          this.cancelOrder();
        })
        .catch(err => {
          this.alert = {
            show: true,
            msg: err.response.data.message,
            variant: "danger"
          };
        });
    }
  }
};
</script>