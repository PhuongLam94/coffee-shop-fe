<template>
<div>
    <b-form @submit="submit">
        <b-form-group id="old-pass-group" label="Password cũ" label-for="old-pass">
            <b-form-input id="old-pass" v-model="form.oldPass" type="password" required></b-form-input>
        </b-form-group>
        <b-form-group id="new-pass1-group" label="Password mới" label-for="new-pass1">
            <b-form-input id="new-pass1" v-model="form.newPass1" type="password" required></b-form-input>
        </b-form-group>
         <b-form-group id="new-pass2-group" label="Nhập lại password mới" label-for="new-pass2">
            <b-form-input id="new-pass2" v-model="form.newPass2" type="password" required></b-form-input>
        </b-form-group>
        <b-button type="submit" :disabled="form.newPass1 !== form.newPass2">Gửi</b-button>
    </b-form>
</div>
</template>
<script>
import axios from 'axios'
import {showSuccessAlert, showErrorAlert} from '../helpers/helpers'

export default {
    data: function(){
        return {
            initForm: {
                oldPass: '',
                newPass1: '',
                newPass2: ''
            },
            form: null
        }
    },
  mounted(){
    this.form = {...this.initForm}
  },
    methods: {
        submit(evt){
            evt.preventDefault()
            var requestBody = {
                oldPass: this.form.oldPass,
                newPass: this.form.newPass1
            }
            axios.put('/users/change-password', requestBody).then(response =>
            {
                showSuccessAlert(response)
                this.form = {...this.initForm}
            }, showErrorAlert
            )
        }
    }
}
</script>

