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
    <b-alert variant="danger" show v-if="showErr">{{errMsg}}</b-alert>
  </div>
</template>

<script>
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
      if (localStorage.getItem('access_token'))
        this.$router.push('/drinks')
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault()
        axios.post('/auth', this.form).then(response => {
            if (response.data.token){
              localStorage.setItem('access_token', response.data.token)
            }
            axios.defaults.headers.common['Authorization'] = `bearer ${localStorage.getItem('access_token')}`
            this.$router.go('/drinks')
        }).catch(err => {
            this.showErr = true
            this.errMsg = err.response.data.message
        })
      }
    }
  }
</script>