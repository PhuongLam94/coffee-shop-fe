<template>
  <div>
    <b-alert
      :variant="alert.variant"
      :show="3"
      v-if="alert.show"
      dismissible
      @dismissed="alert.show=false"
    >{{alert.msg}}</b-alert>
    <b-form @submit="submit">
      <b-form-group id="amount-group" label="Số tiền:" label-for="amount">
        <b-form-input id="amount" v-model="form.amount" type="number" required></b-form-input>
      </b-form-group>
      <b-form-group id="description-group" label="Nội dung:" label-for="description">
        <b-form-input id="description" v-model="form.description" required></b-form-input>
      </b-form-group>
      <b-form-group id="type-group" label="Loại:" label-for="type">
        <b-form-select id="type" v-model="form.type" :options="typeOptions" required></b-form-select>
      </b-form-group>
      <b-form-group id="date-group" label="Ngày:" label-for="date">
        <b-form-input id="date" v-model="form.date" type="date" required></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>
<script>
import axios from "axios";
import {format} from 'date-fns'
export default {
  data: function() {
    return {
      form: {
        amount: 0,
        description: '',
        type: 'in',
        date: format(new Date(), 'YYYY-MM-DD')
      },
      alert: {
        show: false,
        msg: "",
        variant: "success"
      },
      typeOptions: [
          {
              text: 'Thu nhập',
              value: 'in'
          },
          {
              text: 'Chi phí',
              value: 'out'
          }
      ]
    };
  },
  methods: {
    submit(evt) {
      evt.preventDefault()
      var form = {...this.form};
      form.date = new Date(form.date).getTime();
      axios
        .post("/expenses", form)
        .then(response => {
          this.alert = {
            show: true,
            msg: response.data.message,
            variant: "success"
          };
          this.form = {
            amount: 0,
        description: '',
        type: 'in',
        date: format(new Date(), 'YYYY-MM-DD')
          };
        })
        .catch(
          err =>
            (this.alert = {
              show: true,
              msg: err.response.data.message,
              variant: "danger"
            })
        );
    }
  }
};
</script>
