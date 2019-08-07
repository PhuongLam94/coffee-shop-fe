import Vue from 'vue'
import App from './App.vue'
import Drinks from './components/Drinks'
import Login from './components/Login'
import Orders from './components/Orders'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueRouter from 'vue-router'
import Axios from 'axios'
import serverInfo from './data/server-info'
import store from './data/store'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueRouter)

Axios.defaults.baseURL = `${serverInfo.HTTP_METHOD}://${serverInfo.BASE_URL}:${serverInfo.PORT}`
Vue.prototype.$http = Axios
const accessToken = localStorage.getItem("access_token")

if (accessToken){
  Vue.prototype.$http.defaults.headers.common['Authorization'] = `bearer ${accessToken}`
}
const routes = [
  {path: '/login', component: Login},
  {path: '/drinks', component: Drinks},
  {path: '/orders', component: Orders}
]

const router = new VueRouter({routes})


new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
