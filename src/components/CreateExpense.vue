<template>
  <div>
    <b-form @submit="submit" v-if="form">
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
import { showSuccessAlert, showErrorAlert } from "../helpers/helpers";
import {format} from 'date-fns'
export default {
  data: function() {
    return {
      initForm: {
        amount: 0,
        description: '',
        type: 'in',
        date: format(new Date(), 'YYYY-MM-DD')
      },
      form: null,
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
  mounted(){
    this.form = {...this.initForm}
  },
  methods: {
    submit(evt) {
      evt.preventDefault()
      var form = {...this.form};
      form.date = new Date(form.date).getTime();
      form.amount = parseInt(form.amount)
      axios
        .post("/expenses", form)
        .then(response => {
            showSuccessAlert(response)
            this.form = {...this.initForm}
          }, showErrorAlert)
    }
  }
};
</script>
