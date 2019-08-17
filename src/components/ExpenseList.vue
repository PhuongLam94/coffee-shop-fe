<template>
  <div>
    <div>
      <b-button variant="success" @click="getReportAllTime()">Xem tất cả</b-button>
      <b-form @submit="getReportForTimeRange">
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
    <div v-if="expenseInfo">
      <b-card>
          <b-row>
            <b-col class="text-sm-right">
              <b>Doanh thu:</b>
            </b-col>
            <b-col>{{formatMoney(expenseInfo.revenue)}}</b-col>
          </b-row>
          <b-row>
            <b-col class="text-sm-right">
              <b>Chi phí:</b>
            </b-col>
            <b-col>{{formatMoney(expenseInfo.outcome)}}</b-col>
          </b-row>
          <b-row>
            <b-col class="text-sm-right">
              <b>Thu nhập khác:</b>
            </b-col>
            <b-col>{{formatMoney(expenseInfo.income)}}</b-col>
          </b-row>
          <b-row>
            <b-col class="text-sm-right">
              <b>Nhập hàng:</b>
            </b-col>
            <b-col>{{formatMoney(expenseInfo.inInventory)}}</b-col>
          </b-row>
          <b-row>
            <b-col class="text-sm-right">
              <b>Xuất hàng:</b>
            </b-col>
            <b-col>{{formatMoney(expenseInfo.outInventory)}}</b-col>
          </b-row>
          <b-row>
            <b-col class="text-sm-right">
              <b>Lợi nhuận:</b>
            </b-col>
            <b-col><strong>{{formatMoney(expenseInfo.revenue+expenseInfo.income-expenseInfo.outcome+expenseInfo.outInventory-expenseInfo.inInventory)}}</strong></b-col>
          </b-row>
        </b-card>
    </div>
    <b-table v-if="expenseInfo" striped hover :items="expenseInfo.expenseList" :fields="fields" responsive="md">
      <template slot="showDetails" slot-scope="row">
        <b-button
          size="sm"
          @click="row.toggleDetails"
          class="mr-2"
        >{{ row.detailsShowing ? 'Ẩn' : 'Hiện'}}</b-button>
      </template>
      <template slot="row-details" slot-scope="row">
        <b-card>
          <b-row>
            <b-col class="text-sm-right">
              <b>Nội dung:</b>
            </b-col>
            <b-col>{{ row.item.description }}</b-col>
          </b-row>
          <b-row>
            <b-col class="text-sm-right">
              <b>Người tạo:</b>
            </b-col>
            <b-col>{{ row.item.createdBy }}</b-col>
          </b-row>
          <b-row>
            <b-col class="text-sm-right">
              <b>Ngày tạo:</b>
            </b-col>
            <b-col>{{ formatDate(row.item.createdAt) }}</b-col>
          </b-row>
        </b-card>
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
      expenseInfo: null,
      fields: {
        type: {
          label: "Loại",
          formatter: value => {
            switch (value){
              case 'in':
                return 'Thu nhập';
              case 'out':
                  return 'Chi phí';
              case 'revenue':
                  return 'Doanh thu';
              case 'inInventory':
                return 'Nhập hàng';
              case 'outInventory':
                return 'Xuất hàng'

            }
            }
        },
        amount: {
          label: "Số tiền",
          formatter: value => value.toLocaleString("VND")
        },
        date: {
          label: "Ngày",
          formatter: this.formatDate
        },
        showDetails: {
          label: "Hiện chi tiết"
        }
      }
    };
  },
  methods: {
    formatMoney: value => value.toLocaleString('VND'),
    formatDate: value => format(new Date(value), "DD/MM/YYYY"),
    getReportForTimeRange(evt) {
      evt.preventDefault();
      this.getReport(new Date(`${this.filter.fromDate}GMT+7`).getTime(), new Date(`${this.filter.toDate}GMT+7`).getTime())
    },
    getReportAllTime(){
      this.getReport()
    },
    getReport(fromDate, toDate){
      store.commit("setLoading", true);
      var query = fromDate?`?fromDate=${fromDate}&toDate=${toDate}`:''
      axios
        .get(`/expenses${query}`)
        .then(response => {
          this.expenseInfo = response.data;
        }, showErrorAlert)
        .finally(() => store.commit("setLoading", false));
    }
  },
  mounted() {}
};
</script>