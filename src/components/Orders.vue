<template>
  <div>
    <b-form-group>
        <b-form-radio v-model="viewBy" name="viewByModes" value="date">Xem theo ngày</b-form-radio>
        <b-form-radio v-model="viewBy" name="viewByModes" value="items">Xem theo món</b-form-radio>
    </b-form-group>
    <div style="font-size:50px">{{totalIncome.toLocaleString('VND')}}</div>
    <b-button variant="success" @click="getOrders()">Refresh</b-button>
    <b-card-group v-if="viewBy === 'date'">
      <b-card v-for="(orders, date) in ordersByDate" :key="date">
        <b-card-header v-b-toggle="date">
        {{orders.createdDate}} | {{orders.totalAmount.toLocaleString('VND')}} | {{orders.totalOrders}} đơn
        </b-card-header>
        <b-collapse :id="date" :visible="!orders.allCompleted">
          <b-card-body>
            <b-card-group>
              <b-card v-for="order in orders.orders" :key="order['_id']">
                <b-card-header v-b-toggle="order['_id']">{{order.createdBy}} | {{order.createdDate.toLocaleTimeString('vi-VI')}} | {{order.amount.toLocaleString({currency: 'VND'})}}</b-card-header>
                <b-collapse :id="order['_id']" :visible="!order.isCompleted">
                    <b-card-body>
                        <div
                            v-for="item in order.items"
                            :key="item['_id']"
                        >{{item.name}}: {{item.quantity}} 
                        <span v-if="item.note">({{item.note}})</span>
                        
                        </div>
                        <b-button variant="primary" v-if="!order.isCompleted" @click="markAsCompleted(order)">Đã xong</b-button>
                        </b-card-body>
                </b-collapse>
              </b-card>
            </b-card-group>
          </b-card-body>
        </b-collapse>
        
      </b-card>
    </b-card-group>
    <b-list-group v-if="viewBy === 'items'">
      <b-list-group-item v-for="(orderInfo, item) in ordersByItem" :key="item">
          {{item}}: {{orderInfo.quantity}} | {{orderInfo.totalAmount.toLocaleString('VND')}}
      </b-list-group-item>
    </b-list-group>
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
      ordersByDate: null,
      ordersByItem: null,
      viewBy: "date"
    };
  },
  mounted() {
    this.getOrders()
  },
  methods: {
    markAsCompleted(order){
      axios.put(`/orders/${order['_id']}/complete`).then(response => {
        order.isCompleted = true
      })
    },
    getOrders(){
      this.totalIncome = 0
      axios.get("/orders").then(response => {
      var orders = response.data;
      var ordersByDate = new Map();
      var ordersByItem = new Map();
      orders.sort((a, b) => (a.createdDate > b.createdDate ? -1 : 1));
      orders.forEach(order => {
        order.createdDate = new Date(order.createdDate);
        this.totalIncome += order.amount;
        var orderDate ='a'+
          order.createdDate.getDate() +
          "" +
          order.createdDate.getMonth() +
          "" +
          order.createdDate.getFullYear();
        if (ordersByDate[orderDate]) {
          ordersByDate[orderDate]["orders"].push(order);
          ordersByDate[orderDate]["totalAmount"] += order.amount;
          ordersByDate[orderDate]["totalOrders"]++;
          ordersByDate[orderDate]["allCompleted"] = ordersByDate[orderDate]["allCompleted"] && order.isCompleted
        } else {
          ordersByDate[orderDate] = {
            createdDate: order.createdDate.toLocaleDateString("vi-VI"),
            orders: [order],
            totalAmount: order.amount,
            totalOrders: 1,
            allCompleted: order.isCompleted,
          };
        }

         if (order.items)
          order.items.forEach(item => {
            if (item.name && ordersByItem[item.name]){
              ordersByItem[item.name].quantity += item.quantity;
              ordersByItem[item.name].totalAmount += item.quantity*item.price;
            }
            else {
              ordersByItem[item.name] = {
                quantity: item.quantity,
                totalAmount: item.quantity*item.price
              }
            }
          });
      });
      this.ordersByDate = {...ordersByDate}
      this.ordersByItem = {...ordersByItem}
    });
    }
  }
};
</script>
