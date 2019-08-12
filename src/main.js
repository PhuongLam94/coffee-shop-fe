import Vue from 'vue'
import App from './App.vue'
import Drinks from './components/Drinks'
import Login from './components/Login'
import Orders from './components/Orders'
import CreateEmployee from './components/CreateEmployee'
import AddEmpWorkingTime from './components/AddEmpWorkingTime'
import ChangePass from './components/ChangePass'
import CreateExpense from './components/CreateExpense'
import EmployeeList from './components/EmployeeList'
import CreateInventory from './components/CreateInventory'
import InventoryList from './components/InventoryList'
import ExpenseList from './components/ExpenseList'
import EmpWorkingTimeReport from './components/EmpWorkingTimeReport'

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
if (store.state.user){
  Axios.defaults.headers.common['Authorization'] = `bearer ${store.state.user.token}`
}
const routes = [
  {path: '/login', component: Login},
  {path: '/drinks', component: Drinks},
  {path: '/orders', component: Orders},
  {path: '/create-employee', component: CreateEmployee},
  {path: '/add-working-time', component: AddEmpWorkingTime},
  {path: '/change-pass', component: ChangePass},
  {path: '/create-expense', component: CreateExpense},
  {path: '/employee-list', component: EmployeeList},
  {path: '/create-inventory', component: CreateInventory},
  {path: '/inventory-list', component: InventoryList},
  {path: '/expense-list', component: ExpenseList},
  {path: '/working-time-report', component: EmpWorkingTimeReport},

]

const router = new VueRouter({routes})


new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
