<template>
  <div>
    <div>
      <b-form @submit="getReport">
        <div class="d-flex">
        <label for="fromDate" style="flex-basis: 20%">Từ ngày: </label>
          <b-input v-model="filter.fromDate" type="date" style="flex-basis: 80%"></b-input>
        </div>
        <div class="d-flex">
        <label for="toDate" style="flex-basis: 20%">Tới ngày:</label>
          <b-input v-model="filter.toDate" type="date" style="flex-basis: 80%"></b-input>
       </div>
        <b-button variant="primary" type="submit">Xem</b-button>
      </b-form>
    </div>
    <b-table v-if="inventoryInfo" striped hover :items="inventoryInfo" :fields="fields" responsive="md">
      <template slot="showDetails" slot-scope="row">
        <b-button
          size="sm"
          @click="row.toggleDetails"
          class="mr-2"
        >{{ row.detailsShowing ? 'Ẩn' : 'Hiện'}}</b-button>
      </template>
      <template slot="row-details" slot-scope="row">
        <b-table :items="row.item.inventories" :fields="inventoryFields" responsive="md"></b-table>
      </template>
    </b-table>
  </div>
</template>
<script>
import axios from "axios";
import store from "../data/store";
import { showErrorAlert } from "../helpers/helpers";
import { format } from "date-fns";
export default {
  computed: {
      filter: function(){
          var today = new Date()
          var fromDate, toDate, year, month
          if (today.getDate() < 10){
              //in previous month circle
              year = today.getFullYear()
              month = today.getMonth() - 1
              if (today.getMonth()==0){
               year--
               month = 11
              }
              fromDate = format(new Date(year, month, 10), 'YYYY-MM-DD')
              toDate = format(new Date(today.getFullYear(), today.getMonth(), 9), 'YYYY-MM-DD')
          } else {
              //in current month circle
                year = today.getFullYear()
              month = today.getMonth() + 1
              if (today.getMonth()==11){
               year++
               month = 0
              }
              fromDate = format(new Date(today.getFullYear(), today.getMonth(), 10), 'YYYY-MM-DD')
              toDate = format(new Date(year, month, 9), 'YYYY-MM-DD')
          }
          return {
              fromDate: fromDate,
              toDate: toDate
          }

      }
  },
  data: function() {
    return {
      inventoryInfo: null,
      fields: {
        "ingredientInfo.name": {
          label: "Tên"
        },
        amount: {
          label: "Số lượng tồn",
          formatter: value => Math.round(value*100)/100
        },
        "ingredientInfo.unit.storage": {
          label: "Đơn vị tồn"
        },
        showDetails: {
          label: ""
        }
      },
      inventoryFields: {
          date: {
              label: "Ngày",
              formatter: value => value?this.formatDate(value):''
          },
          quantity: {
              label: "Số lượng",
              formatter: value => Math.round(value*100)/100
          },
          type: {
              label: "Loại",
              formatter: value => value === "in"?"Nhập":"Xuất"
          },
          description: {
            label: 'Mô tả'
          }
      }
    };
  },
  methods: {
    formatMoney: value => value.toLocaleString('VND'),
    formatDate: value => format(new Date(value), "DD/MM/YYYY"),
    formatTime: value => format(value, 'HH:mm'),
    getReport(evt) {
      evt.preventDefault();
      store.commit("setLoading", true);
      axios
        .get(`/inventories?fromDate=${new Date(this.filter.fromDate).getTime()}&toDate=${new Date(this.filter.toDate).getTime()}`)
        .then(response => {
          this.inventoryInfo = response.data;
        }, showErrorAlert)
        .finally(() => 
          store.commit("setLoading", false)
          );
    }
  },
  mounted() {}
};
</script>