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
  mounted(){
    this.form = {...this.initForm}
  },
  methods: {
    submit(evt) {
      evt.preventDefault();
      var requestBody = {
        date: this.form.date,
        slots: [
          {
            in: this.form.in,
            out: this.form.out
          }
        ]
      };
      axios.put("/employees/working-time", requestBody).then(response => {
        showSuccessAlert(response);
        this.form = {...this.initForm};
      }, showErrorAlert);
    }
  }
};
</script>

