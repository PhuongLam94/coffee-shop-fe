<template>
  <div>
    <div class="d-flex">
      <b-form-radio style="flex-basis: 50%" v-model="viewBy" name="viewByModes" value="date">Xem theo ngày</b-form-radio>
      <b-form-radio  style="flex-basis: 50%" v-model="viewBy" name="viewByModes" value="items">Xem theo món</b-form-radio>
      <b-button variant="success" @click="getOrders()">F5</b-button>
    </div>
    <div style="font-size:50px">{{totalIncome.toLocaleString('VND')}}</div>
    <b-card-group class="scroll-75" v-if="viewBy === 'date'">
    <b-card v-for="(orders, date) in ordersByDate" :key="date" style="flex-basis: 100%">
        <b-card-header
          v-b-toggle="date"
        >{{orders.createdDate}} | {{orders.totalAmount.toLocaleString('VND')}} | {{orders.totalItems}} ly</b-card-header>
        <b-collapse :id="date" :visible="!orders.allCompleted">
          <b-card-body>
            <b-card-group>
              <b-card v-for="order in orders.orders" :key="order['_id']" style="flex-basis: 50%">
                <b-card-header
                  v-b-toggle="order['_id']"
                >{{order.createdBy}} | {{order.createdDate.toLocaleTimeString('vi-VI')}} | {{order.amount.toLocaleString({currency: 'VND'})}}</b-card-header>
                <b-collapse :id="order['_id']" :visible="!order.isCompleted">
                  <b-card-body>
                    <div v-for="item in order.items" :key="item['_id']">
                      {{item.name}}: {{item.quantity}}
                      <span v-if="item.note">({{item.note}})</span>
                    </div>
                    <b-button
                      variant="primary"
                      v-if="!order.isCompleted"
                      @click="markAsCompleted(order)"
                    >Đã xong</b-button>
                    <b-button
                      variant="danger"
                      v-if="hasPerToDel(order)"
                      @click="delOrd(order)"
                    >Xoá đơn</b-button>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </b-card-group>
          </b-card-body>
        </b-collapse>
      </b-card>
    </b-card-group>
    <b-list-group v-if="viewBy === 'items'" class="scroll-75">
      <b-list-group-item
        v-for="(orderInfo) in ordersByItem"
        :key="orderInfo.name"
      >{{orderInfo.name}}: {{orderInfo.quantity}} | {{orderInfo.totalAmount.toLocaleString('VND')}}</b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import axios from "axios";
import { showSuccessAlert, showErrorAlert } from "../helpers/helpers";
import store from "../data/store";
export default {
  name: "orders",
  data: function() {
    return {
      orders: null,
      totalIncome: 0,
      ordersByDate: null,
      ordersByItem: null,
      viewBy: "date"
    };
  },
  mounted() {
    this.getOrders();
  },
  methods: {
    hasPerToDel(order) {
      return (
        store.state.user.role === "admin" ||
        order.createdBy === store.state.user.username
      );
    },
    delOrd(order) {
      store.commit("setLoading", true);
      axios
        .delete("/orders/" + order["_id"])
        .then(response => {
          showSuccessAlert(response);
          this.getOrders()
        }, showErrorAlert)
        .finally(() => store.commit("setLoading", false));
    },
    markAsCompleted(order) {
      store.commit("setLoading", true);

      axios.put(`/orders/${order["_id"]}/complete`).then(response => {

        showSuccessAlert(response);
        order.isCompleted = true;
      }, showErrorAlert).finall(
        store.commit("setLoading", false)
      )
    },
    getOrders() {
      this.totalIncome = 0;
      store.commit("setLoading", true);

      axios.get("/orders").then(response => {
        var orders = response.data;
        var ordersByDate = new Map();
        var ordersByItem = new Map();
        orders.sort((a, b) => (a.createdDate > b.createdDate ? -1 : 1));
        orders.forEach(order => {
          var orderItems = 0
          order.items.forEach(item => orderItems+=item.quantity)
          order.createdDate = new Date(order.createdDate);
          this.totalIncome += order.amount;
          var orderDate =
            "a" +
            order.createdDate.getDate() +
            "" +
            order.createdDate.getMonth() +
            "" +
            order.createdDate.getFullYear();
          if (ordersByDate[orderDate]) {
            ordersByDate[orderDate]["orders"].push(order);
            ordersByDate[orderDate]["totalAmount"] += order.amount;
            ordersByDate[orderDate]["totalItems"]+= orderItems;
            ordersByDate[orderDate]["allCompleted"] =
              ordersByDate[orderDate]["allCompleted"] && order.isCompleted;
          } else {
            ordersByDate[orderDate] = {
              createdDate: order.createdDate.toLocaleDateString("vi-VI"),
              orders: [order],
              totalAmount: order.amount,
              totalItems: orderItems,
              allCompleted: order.isCompleted
            };
          }

          if (order.items)
            order.items.forEach(item => {
              if (item.name && ordersByItem[item.name]) {
                ordersByItem[item.name].quantity += item.quantity;
                ordersByItem[item.name].totalAmount +=
                  item.quantity * item.price;
              } else {
                ordersByItem[item.name] = {
                  name: item.name,
                  quantity: item.quantity,
                  totalAmount: item.quantity * item.price
                };
              }
            });
        });
        this.ordersByDate = { ...ordersByDate };
        this.ordersByItem = Object.values(ordersByItem).sort((a, b) => a.totalAmount > b.totalAmount?-1:1);
      }, showErrorAlert).finally(() =>
        store.commit("setLoading", false))
    }
  }
};
</script>
