<template>
  <div>
    <div style="font-size:50px">{{totalIncome.toLocaleString({currency: 'VND'})}}</div>
    <b-card-group v-if="ordersByDate">
      <b-card v-for="(orders, date) in ordersByDate" :key="date">
        <b-card-header v-b-toggle="date">
        {{orders.createdDate}} | {{orders.totalAmount.toLocaleString({currency: 'VND'})}} | {{orders.totalOrders}} đơn
        </b-card-header>
        <b-collapse :id="date">
          <b-card-body>
            <b-card-group>
              <b-card v-for="order in orders.orders" :key="order['_id']">
                <b-card-header v-b-toggle="order['_id']">{{order.createdBy}} | {{order.createdDate.toLocaleTimeString('vi-VI')}} | {{order.amount.toLocaleString({currency: 'VND'})}}</b-card-header>
                <b-collapse :id="order['_id']">
                    <b-card-body>
                        <div
                            v-for="item in order.items"
                            :key="item['_id']"
                        >{{item.name}}: {{item.quantity}}</div>
                        </b-card-body>
                </b-collapse>
              </b-card>
            </b-card-group>
          </b-card-body>
        </b-collapse>
        
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "orders",
  data: function() {
    return {
      orders: null,
      totalIncome: 0,
      ordersByDate: new Map(),
      ordersByItem: new Map()
    };
  },
  mounted() {
    axios.get("/orders").then(response => {
      var orders = response.data;
      var ordersByDate = new Map();
      var ordersByItem = new Map();
      orders.sort((a, b) => (a.createdDate > b.createdDate ? 1 : -1));
      orders.forEach(order => {
        order.createdDate = new Date(order.createdDate);
        this.totalIncome += order.amount;
        var orderDate =
          order.createdDate.getDate() +
          "" +
          order.createdDate.getMonth() +
          "" +
          order.createdDate.getFullYear();
        if (ordersByDate[orderDate]) {
          ordersByDate[orderDate]["orders"].push(order);
          ordersByDate[orderDate]["totalAmount"] += order.amount;
          ordersByDate[orderDate]["totalOrders"]++;
        } else {
          ordersByDate[orderDate] = {
            createdDate: order.createdDate.toLocaleDateString("vi-VI"),
            orders: [order],
            totalAmount: order.amount,
            totalOrders: 1
          };
        }
        if (order.items)
          order.items.forEach(item => {
            if (item.name && ordersByItem[item.name])
              ordersByItem[item.name] += item.quantity;
            else {
              ordersByItem[item.name] = item.quantity;
            }
          });
      });
      this.ordersByDate = Object.assign({}, ordersByDate);
      this.ordersByItem = Object.assign({}, ordersByItem);
    });
  }
};
</script>
