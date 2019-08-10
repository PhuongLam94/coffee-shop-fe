<template>
  <div id="app">
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
        <b-nav-item-dropdown text="Đơn hàng">
          <b-dropdown-item @click="$router.push('/drinks')">Tạo đơn</b-dropdown-item>
          <b-dropdown-item @click="$router.push('/orders')">Danh sách đơn</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown text="Nhân viên" v-if="user.role === 'admin'">
          <b-dropdown-item @click="$router.push('/create-employee')">Tạo nhân viên</b-dropdown-item>
          <b-dropdown-item @click="$router.push('/drinks')">Danh sách nhân viên</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown text="Tài chính">
          <b-dropdown-item @click="$router.push('/create-expense')">Tạo thu nhập/chi phí</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown text="Cá nhân">
          <b-dropdown-item @click="$router.push('/add-working-time')">Nhập giờ làm</b-dropdown-item>
          <b-dropdown-item @click="$router.push('/change-pass')">Đổi password</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item @click="logout">Đăng xuất</b-nav-item>
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
</style>