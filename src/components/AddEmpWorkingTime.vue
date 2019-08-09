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
import axios from 'axios'
export default {
    data: function(){
        return {
            form: {
                date: '',
                in:{ hour: 6,min: 30},
                out: {hour: 11,min: 0}
            },
      alert: {
        show: false,
        msg: "",
        variant: "success"
      }
        }
    },
    methods: {
        submit(evt){
            evt.preventDefault()
            var requestBody = {
                date: this.form.date,
                slots: [
                    {
                        'in': this.form.in,
                        'out': this.form.out
                    }
                ]
            }
            axios.put('/employees/working-time', requestBody) .then(response => {
          this.alert = {
            show: true,
            msg: response.data.message,
            variant: "success"
          };
          this.form = {
             date: '',
                in:{ hour: 6,min: 30},
                out: {hour: 11,min: 0}
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
}
</script>

