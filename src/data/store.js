import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        alert: {
            show: false,
            message: "",
            variant: "success"
          },
        user: JSON.parse(localStorage.getItem('user')) || null,
        
    },
    mutations: {
        setAlert: (state, newAlert) => {
            state.alert = newAlert
        },
        setUser: (state, user) => {
            state.user = user
            localStorage.setItem('user',JSON.stringify(user))
        },
        clearUser: (state) => {
            state.user = null
            localStorage.removeItem('user')
        }
    }
  })
export default store