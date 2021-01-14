import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

Vue.axios.defaults.baseURL = "http://localhost:5000/";

export default new Vuex.Store({
  state: {
    machines: []
  },
  mutations: {
    SET_MACHINES(state, machines) {
      state.machines = machines
    }
  },
  actions: {
    getMachines({ commit }) {
      Vue.axios.get('machine').then(response => {
          // console.log(response)
          commit('SET_MACHINES', response.data)
      })
    }
  },
  modules: {
  }
})
