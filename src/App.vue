<template>
  <div id="app">
    <div id="overlay" v-if="loading" class="d-flex justify-content-center align-items-center">
        <b-spinner label="loading"></b-spinner>
    </div>
    <b-alert
      :variant="alert.variant"
      show="3"
      v-if="alert.show"
      dismissible
      @dismissed="alert.show=false"
     id="alert-msg" 
    >{{alert.message}}</b-alert>
    <b-navbar toggleable="md" type="dark" variant="info" v-if="user" sticky style="z-index: 1">
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item @click="$router.push('/drinks')">Tạo đơn</b-nav-item>
        <b-nav-item-dropdown text="Đơn hàng">
          <b-dropdown-item @click="$router.push('/orders')">Danh sách đơn</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown text="Nhân viên" v-if="user.role === 'admin'">
          <b-dropdown-item @click="$router.push('/create-employee')">Tạo nhân viên</b-dropdown-item>
          <b-dropdown-item @click="$router.push('/employee-list')">Danh sách nhân viên</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown text="Tài chính">
          <b-dropdown-item @click="$router.push('/create-expense')">Tạo thu nhập/chi phí</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown text="Kho">
          <b-dropdown-item @click="$router.push('/create-inventories')"> Tạo nhập/xuất</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown text="Cá nhân">
          <b-dropdown-item @click="$router.push('/add-working-time')">Nhập giờ làm</b-dropdown-item>
          <b-dropdown-item @click="$router.push('/change-pass')">Đổi password</b-dropdown-item>
          <b-dropdown-item @click="logout">Đăng xuấ</b-dropdown-item>
        </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <nav v-if="!user">
      <b-button @click="$router.push('/login')">Đăng nhập</b-button>
    </nav>

    <router-view />
  </div>
</template>

<script>
import Axios from "axios";
import store from './data/store'
export default {
    name: "app",
  computed: {
    alert: function() {
      return store.state.alert
    },
    user: function(){
      return store.state.user
    },
    loading: function(){
      return store.state.loading
    }
  },
  methods: {
    logout() {
      store.commit('clearUser')
      delete Axios.defaults.headers.common.Authorization;
      this.$router.push("/login");
    }
  },
  mounted(){
    if (this.$route === "/login" && store.state.user)
        this.$router.push('/drinks')
    if (!store.state.user && this.$route !== "/login")
        this.$router.push('/login')
  }
};
</script>

<style>
#app {
  margin: 3px;
  color: #2c3e50;
  text-align: center;
}
label{
  text-align: left
}
.btn {
  margin: 2px;
}
#hello-div{
  text-align: right
}
#alert-msg{
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2
}
#overlay {
  position: fixed; /* Sit on top of the page content */
  display: block; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0; 
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}
</style>