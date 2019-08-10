<template>
  <div>
    <div>
        <b-form @submit="onSubmit">
        <b-form-group
            id="input-group-1"
            label="Username:"
            label-for="input-1"
        >
            <b-form-input
            id="input-1"
            v-model="form.username"
            type="text"
            required
            placeholder="Enter username"
            ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Password:" label-for="input-2">
            <b-form-input
            id="input-2"
            type="password"
            v-model="form.password"
            required
            placeholder="Enter password"
            ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
    </div>
  </div>
</template>

<script>
  import { showSuccessAlert, showErrorAlert } from "../helpers/helpers";
  import store from '../data/store'
  import axios from 'axios'
  export default {
      name:'login',
    data() {
      return {
        form: {
          username: '',
          password: ''
        },
        showErr: false,
        errMsg: ''
      }
    },
    created(){
      if (store.state.user)
        this.$router.push('/drinks')
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault()
        store.commit('setLoading', true)

        axios.post('/auth', this.form).then(response => {
          showSuccessAlert(response)
          store.commit('setUser',{
            token: response.data.token,
            role: response.data.role,
            name: response.data.employeeName,
            username: this.form.username
        })
        this.$router.go('/drinks')
        }, showErrorAlert).finally(
        store.commit('setLoading', false))
      }
    }
  }
</script>