import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'
// import VueAxios from 'vue-axios'

Vue.use(Vuex)
// Vue.use(VueAxios, axios)



export default new Vuex.Store({
  state: {
    machines: [],
    parts: [],
  },
  mutations: {
    SET_MACHINES(state, machines) {
      state.machines = machines
    },
    SET_PARTS(state, parts) {
      state.parts = parts
    },
  },
  actions: {
    getMachines({ commit }, part_list) {
      Vue.axios.get('machines', {
          params: {
            part: part_list.join()
          }
      }).then(response => {
          const machines = response.data
          console.log("getMachines query result:", machines)
          commit('SET_MACHINES', machines)
      })
    },
    getParts({ commit }, machine_list) {
      Vue.axios.get('parts',{
          params: {
              machine: machine_list.join()
          }
      }).then(response => {
          // console.log(response)
          const parts = response.data
          console.log("getParts query result:", parts)
          commit('SET_PARTS', parts)
      })
    },
  },
  modules: {
  }
})
