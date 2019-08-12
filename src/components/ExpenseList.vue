<template>
  <div>
    <div>
      <b-form @submit="getReport">
        <b-form-group label="Từ ngày" label-for="fromDate">
          <b-form-input class="col-md-6" v-model="filter.fromDate" type="date"></b-form-input>
        </b-form-group>
        <b-form-group label="Tới ngày" label-for="toDate">
          <b-form-input class="col-md-6" v-model="filter.toDate" type="date"></b-form-input>
        </b-form-group>
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
              <b>Lợi nhuận:</b>
            </b-col>
            <b-col><strong>{{formatMoney(expenseInfo.revenue+expenseInfo.income-expenseInfo.outcome)}}</strong></b-col>
          </b-row>
        </b-card>
        <b-button v-b-toggle="'collapse-1'">Hiện danh sách</b-button>
    </div>
    <b-collapse id="collapse-1">
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
    </b-collapse>
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
          var fromDate, toDate
          if (today.getDate() < 10){
              //in previous month circle
              var year = today.getFullYear()
              var month = today.getMonth() - 1
              if (today.getMonth()==0){
               year--
               month = 11
              }
              fromDate = format(new Date(year, month, 10), 'YYYY-MM-DD')
              toDate = format(new Date(today.getFullYear(), today.getMonth(), 9), 'YYYY-MM-DD')
          } else {
              //in current month circle
                var year = today.getFullYear()
              var month = today.getMonth() + 1
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
          formatter: value => (value === "in" ? "Thu nhập" : "Chi phí")
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
    getReport(evt) {
      evt.preventDefault();
      store.commit("setLoading", true);
      axios
        .get(`/expenses?fromDate=${new Date(this.filter.fromDate).getTime()}&toDate=${new Date(this.filter.toDate).getTime()}`)
        .then(response => {
          this.expenseInfo = response.data;
        }, showErrorAlert)
        .finally(() => store.commit("setLoading", false));
    }
  },
  mounted() {}
};
</script>