<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="4">
        <v-select
            v-model="machinesSelected"
            :items="machines"
            attach
            chips
            label="Machines"
            multiple
            v-on:change="machinesUpdated"
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
            v-model="partsSelected"
            :items="parts"
            attach
            chips
            label="Parts"
            multiple
            v-on:change="partsUpdated"
        ></v-select>
      </v-col>
    </v-row>

    <v-row justify="center">
          <v-col cols="12" md="4">
        <v-menu
            v-model="startDateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
        >
          <template v-slot:activator="{ on }">
            <v-text-field
                label="Start Date"
                readonly
                :value="startDateDisp"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            locale="en-ca"
            :min="minDate"
            :max="maxDate"
            v-model="startDateVal"
            no-title
            @input="startDateMenu = false"
        ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="4">
        <v-spacer></v-spacer>
        <v-btn v-on:click="get_data" >Get Data</v-btn>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-simple-table v-if="showTable">
          <template v-slot:default>
            <thead>
              <tr>
                <th>
                  Shift
                </th>
                <th v-for="hour in 8" v-bind:key="hour">{{ hour }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(shift, index) in shiftNames" v-bind:key="index">
                <td>{{shift}}</td>
                <td v-for="hour in 8" v-bind:key="hour">
                  {{ hourly_data[(hour - 1) + (8 * index)].count }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <div v-else>No data yet</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from "vue";

export default {
  name: 'myStore',
  data () {
    return {
        startDateVal: new Date().toISOString().substr(0, 10),
        minDate: "",
        maxDate: "",
        startDateMenu: false,
        shiftNames: ["Midnight", "Day", "Afternoon"],
        showTable: false,

        // values for final query
        machinesSelected: [],
        partsSelected: [],
        interval: 3600,
        count: 24,
        hourly_data: [],
    }
  },
  methods: {
    machinesUpdated() {
      if (this.partsSelected.length == 0) {
        this.$store.dispatch("getParts", this.machinesSelected);
        this.showTable = false
        console.log("machinesUpdated - partsSelected", this.partsSelected)
        console.log("machinesUpdated - machinesSelected", this.machinesSelected)
      }
    },
    partsUpdated() {
      if (this.machinesSelected.length == 0) {
        this.$store.dispatch("getMachines", this.partsSelected);
        this.showTable = false
        console.log("partsUpdated - partsSelected", this.partsSelected)
        console.log("partsUpdated - machinesSelected", this.machinesSelected)
      }
    },
    range(start, count) {
      return Array.apply(0, Array(count))
          .map((element, index) => index + start);
    },
    // TODO:  Move this to the store
    get_data() {
      const isodate= new Date(
          Number(this.startDateVal.slice(0,4)),
          Number(this.startDateVal.slice(5,7)-1),
          Number(this.startDateVal.slice(8,10)-1),
          23,0,0)

      let parameters = {
        start: Math.round(isodate.getTime() / 1000),
        count: this.count,
      }
      if (this.machinesSelected.length>0) {
        parameters['machine'] = this.machinesSelected.join()
      }
      if (this.partsSelected.length>0) {
        parameters['part'] = this.partsSelected.join()
      }
      Vue.axios.get('counts', {
        params: parameters
      }).then(response => {
        const result = response.data
        console.log("get_data query result:", result)
        this.hourly_data = result['result']
        console.log("hourlydata: ", this.hourly_data)
        this.showTable = true
      })
    },
  },
  computed: {
    machines() {
      return this.$store.state.machines
    },
    parts() {
      return this.$store.state.parts
    },
    startDateDisp() {
      return this.startDateVal;
    },
  },
  created() {
    this.$store.dispatch("getMachines",this.partsSelected);
    this.$store.dispatch("getParts", this.machinesSelected);
  }
}
// v-date-picker v-menu integration: https://techformist.com/vuetify-input-field-date-picker/
// TODO: Hide the table when there is no data.
</script>