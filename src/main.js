import Vue from 'vue'
import App from './App.vue'
import Drinks from './components/Drinks'
import Login from './components/Login'
import Orders from './components/Orders'
import CreateEmployee from './components/CreateEmployee'
import AddEmpWorkingTime from './components/AddEmpWorkingTime'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueRouter from 'vue-router'
import Axios from 'axios'
import store from './data/store'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueRouter)
Axios.defaults.baseURL = process.env.VUE_APP_BASE_URL
Vue.prototype.$http = Axios
const accessToken = localStorage.getItem("access_token")

if (accessToken){
  Vue.prototype.$http.defaults.headers.common['Authorization'] = `bearer ${accessToken}`
}
const routes = [
  {path: '/login', component: Login},
  {path: '/drinks', component: Drinks},
  {path: '/orders', component: Orders},
  {path: '/create-employee', component: CreateEmployee},
  {path: '/add-working-time', component: AddEmpWorkingTime},
]

const router = new VueRouter({routes})


new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
