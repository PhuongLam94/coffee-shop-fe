<template>
  <div>
    <b-form @submit="submit">
      <b-form-group id="date-group" label="Ngày" label-for="date">
        <b-form-input id="date" type="date" v-model="form.date" required></b-form-input>
      </b-form-group>
      <b-form-group id="in-group" label="Từ" label-for="in-hour">
        <b-form-input id="in-hour" type="number" v-model="form.in.hour" required></b-form-input>
        <b-form-input id="in-min" type="number" v-model="form.in.min" required></b-form-input>
      </b-form-group>
      <b-form-group id="out-group" label="Đến" label-for="out-hour">
        <b-form-input id="out-hour" type="number" v-model="form.out.hour" required></b-form-input>
        <b-form-input id="out-min" type="number" v-model="form.out.min" required></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>
<script>
import axios from "axios";
import { format } from "date-fns";
import { showSuccessAlert, showErrorAlert } from "../helpers/helpers";
import store from '../data/store'
export default {
  data: function() {
    return {
      initForm: {
        date: format(new Date(), "YYYY-MM-DD"),
        in: { hour: 7, min: 30 },
        out: { hour: 11, min: 0 }
      },
      form: null
    };
  },
  beforeMount(){
    this.form = {...this.initForm}
  },
  methods: {
    submit(evt) {
      evt.preventDefault();
      var inTime = new Date(this.form.date)
      inTime.setHours(this.form.in.hour, this.form.in.min)
      var outTime = new Date(this.form.date)
      outTime.setHours(this.form.out.hour, this.form.out.min)
      var requestBody = {
        date: new Date(this.form.date).getTime(),
        slots: [
          {
            in: inTime.getTime(),
            out: outTime.getTime()
          }
        ]
      };
        store.commit('setLoading', true)
      axios.put("/employees/working-time", requestBody).then(response => {
        showSuccessAlert(response);
        this.form = {...this.initForm};
      }, showErrorAlert).finally(() =>
        store.commit('setLoading', false));
    }
  }
};
</script>

