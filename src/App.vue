<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="info" v-if="loggedIn" sticky>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
        <b-nav-item-dropdown text="Đơn hàng">
          <b-dropdown-item @click="$router.push('/drinks')">Tạo đơn</b-dropdown-item>
          <b-dropdown-item @click="$router.push('/orders')">Danh sách đơn</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown text="Nhân viên">
          <b-dropdown-item @click="$router.push('/create-employee')">Tạo nhân viên</b-dropdown-item>
          <b-dropdown-item @click="$router.push('/drinks')">Danh sách nhân viên</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown text="Cá nhân">
          <b-dropdown-item @click="$router.push('/add-working-time')">Nhập giờ làm</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item @click="logout">Đăng xuất</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <nav v-if="!loggedIn">
      <b-button @click="$router.push('/login')">Đăng nhập</b-button>
    </nav>

    <router-view />
  </div>
</template>

<script>
import Axios from "axios";
export default {
  name: "app",
  data: function() {
    return {
      loggedIn: localStorage.getItem("access_token"),
      role: localStorage.getItem("role"),
      name: localStorage.getItem("name")
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("access_token");
      delete Axios.defaults.headers.Authorization;
      this.loggedIn = false;
      this.$router.push("/login");
    }
  },
  mounted() {
    this.loggedIn = localStorage.getItem("access_token");
  }
};
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