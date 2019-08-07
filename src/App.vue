<template>
<div id="app">
    <nav v-if="!loggedIn">
        <b-button @click="$router.push('/login')">Đăng nhập</b-button>
    </nav>
    <nav v-if="loggedIn">
        <b-button @click="$router.push('/drinks')" variant="primary">Tạo đơn</b-button>
        <b-button @click="$router.push('/orders')" variant="secondary">Xem danh sách đơn</b-button>
        <b-button @click="logout" variant="success">Đăng xuất</b-button>
    </nav>
    <router-view />
  </div>
</template>

<script>
import Axios from 'axios';
export default {
  name: 'app',
  data: function(){
    return {
      loggedIn: localStorage.getItem('access_token')
    }
  },
  methods: {
    logout(){
      localStorage.removeItem('access_token')
      delete Axios.defaults.headers.Authorization
      this.$router.push('/login')
    }
  },
  mounted(){
    this.loggedIn = localStorage.getItem('access_token')
  }
  
}
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.btn {
  margin: 2px;
}
</style>