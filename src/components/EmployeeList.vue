<template>
  <div>
    <b-table striped hover :items="employees" :fields="fields" responsive="md">
        <template slot="showDetails" slot-scope="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? 'Ẩn' : 'Hiện'}}
        </b-button>
      </template>
      <template slot="row-details" slot-scope="row">
        <b-card>
          <b-row>
            <b-col class="text-sm-right"><b>Số CMND: </b></b-col>
            <b-col>{{ row.item.idCard }}</b-col>
          </b-row>
          <b-row>
            <b-col class="text-sm-right"><b>Số điện thoại: </b></b-col>
            <b-col>{{ row.item.phoneNumber }}</b-col>
          </b-row>
          <b-row>
            <b-col class="text-sm-right"><b>Ngày bắt đầu: </b></b-col>
            <b-col>{{ formatDate(row.item.startDate) }}</b-col>
          </b-row>
          <b-row>
            <b-col class="text-sm-right"><b>Username: </b></b-col>
            <b-col>{{ row.item.username }}</b-col>
          </b-row>
          <b-row>
            <b-col class="text-sm-right"><b>Ngày sinh: </b></b-col>
            <b-col>{{ formatDate(row.item.dob) }}</b-col>
          </b-row>
          <b-row>
            <b-col class="text-sm-right"><b>Email: </b></b-col>
            <b-col>{{ row.item.email }}</b-col>
          </b-row>
          <b-row>
            <b-col class="text-sm-right"><b>Người tạo: </b></b-col>
            <b-col>{{ row.item.createdBy }}</b-col>
          </b-row>
          <b-row>
            <b-col class="text-sm-right"><b>Ngày tạo: </b></b-col>
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
import {format} from 'date-fns'
export default {
  data: function() {
    return {
      employees: null,
      fields: {
          name: {
              label: 'Họ và tên'
          },
          showDetails: {
            label: 'Hiện chi tiết'
          }
        //   idCard: {label: 'Số CMND'},
        //   phoneNumber: {label: 'Số điện thoại'},
        //   startDate: {label: 'Ngày bắt đầu'},
        //   username: {label: 'Username'},
        //   dob: {
        //       label: 'Ngày sinh', 
        //       formatter: value => format(new Date(value), 'DD/MM/YYYY')},
        //   email: {label: 'Email'}
      }
    };
  },
  methods: {
    formatDate: value => format(new Date(value), 'DD/MM/YYYY')
  },
  beforeMount() {
    store.commit("setLoading", true);
    axios
      .get("/employees")
      .then(response => {
          this.employees = response.data
      }, showErrorAlert)
      .finally(() => store.commit("setLoading", false));
  }
};
</script>