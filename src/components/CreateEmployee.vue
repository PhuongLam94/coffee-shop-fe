<template>
  <div>
    <b-form @submit="submit">
      <b-form-group id="name-group" label="Họ và tên" label-for="name">
        <b-form-input id="name" v-model="form.name" required></b-form-input>
      </b-form-group>
      <b-form-group id="id-card-group" label="Số CMND" label-for="idCard">
        <b-form-input id="idCard" v-model="form.idCard" required></b-form-input>
      </b-form-group>
      <b-form-group id="phone-number-group" label="Số điện thoại" label-for="phoneNumber">
        <b-form-input id="phoneNumber" v-model="form.phoneNumber" required></b-form-input>
      </b-form-group>
      <b-form-group id="start-date-group" label="Ngày bắt đầu" label-for="startDate">
        <b-form-input id="startDate" v-model="form.startDate" type="date" required></b-form-input>
      </b-form-group>
      <b-form-group id="username-group" label="Username" label-for="username">
        <b-form-input id="username" v-model="form.username" required></b-form-input>
      </b-form-group>
      <b-form-group id="password-group" label="Password" label-for="password">
        <b-form-input id="password" type="password" v-model="form.password" required></b-form-input>
      </b-form-group>
      <b-form-group id="dob-group" label="Ngày sinh" label-for="dob">
        <b-form-input id="dob" v-model="form.dob" type="date"></b-form-input>
      </b-form-group>
      <b-form-group id="email-group" label="Email" label-for="email">
        <b-form-input id="email" v-model="form.email" type="email"></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>
<script>
import axios from "axios";
import store from '../data/store'
import {format} from "date-fns"
import { showSuccessAlert, showErrorAlert } from "../helpers/helpers";
export default {
  data: function() {
    return {
      initForm: {
        name: "",
        idCard: "",
        phoneNumber: "",
        startDate: format(new Date(), 'YYYY-MM-DD'),
        username: "",
        password: "",
        dob: null,
        email: ""
      },
      form: null
    };
  },
  mounted(){
    this.form = {...this.initForm}
  },
  methods: {
    submit(evt) {
      evt.preventDefault()
      var form = {...this.form};
      form.startDate = new Date(form.startDate).getTime();
      if (form.dob) form.dob = new Date(form.dob).getTime();
        store.commit('setLoading', true)

      axios.post("/employees", form)
        .then(response => {
         showSuccessAlert(response)
          this.form = {...this.initForm};

        }, showErrorAlert).finally(() =>
        store.commit('setLoading', false));
    }
  }
};
</script>
